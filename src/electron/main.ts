import { app, BrowserWindow, ipcMain } from 'electron'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import setAccessToken from '../api/spotify/user.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    //frame: false, // Removes the window frame (title bar)
    resizable: false, // This prevents resizing
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    // Add CSS to hide scrollbars
    //win?.webContents.insertCSS('body::-webkit-scrollbar { display: none; } body { overflow: hidden; }')
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    //win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

function base64url(buffer: Buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Start Spotify PKCE auth inside the existing main window (navigates the same window)
ipcMain.handle('spotify-start-auth-inplace', async () => {
  if (!win) throw new Error('Main window not available')

  const clientId = process.env.SPOTIFY_CLIENT_ID || ''
  // This redirect URI must be registered in your Spotify app settings exactly.
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:8000/callback'

  const state = crypto.randomBytes(16).toString('hex')
  const code_verifier = base64url(crypto.randomBytes(64))
  const code_challenge = base64url(crypto.createHash('sha256').update(code_verifier).digest())

  const scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state user-library-read'

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
    code_challenge_method: 'S256',
    code_challenge,
  })

  const authUrl = 'https://accounts.spotify.com/authorize?' + params.toString()

  return new Promise(async (resolve, reject) => {
    let finished = false

    const restoreApp = () => {
      // restore the app UI after auth completes
      if (VITE_DEV_SERVER_URL) {
        win?.loadURL(VITE_DEV_SERVER_URL).catch(() => {})
      } else {
        win?.loadFile(path.join(RENDERER_DIST, 'index.html')).catch(() => {})
      }
    }

    const cleanupListeners = () => {
      win?.webContents.removeListener('will-redirect', onRedirect)
      win?.webContents.removeListener('will-navigate', onNavigate)
    }

    const onRedirect = async (event: Electron.Event, url: string) => {
      try {
        if (!url.startsWith(redirectUri)) return
        event.preventDefault()
        cleanupListeners()

        const u = new URL(url)
        const code = u.searchParams.get('code')
        const error = u.searchParams.get('error')

        if (error) {
          restoreApp()
          finished = true
          return reject(new Error(String(error)))
        }

        if (!code) {
          restoreApp()
          finished = true
          return reject(new Error('Missing code in redirect'))
        }

        // Exchange code for tokens (PKCE) in the main process
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier,
        })

        const res = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        })

        const tokenJson = await res.json()
        restoreApp()
        finished = true

        if (!res.ok) return reject(new Error('Token exchange failed: ' + JSON.stringify(tokenJson)))

        // store tokens in a global variable for now (you can persist securely)
        ;(global as any).__spotifyTokens = tokenJson;

        resolve(tokenJson)
      } catch (err) {
        restoreApp()
        finished = true
        reject(err)
      }
    }

    const onNavigate = (event: Electron.Event, url: string) => {
      // navigation can also carry the redirect
      return onRedirect(event, url)
    }

    if (win != null){
      // attach listeners
      win.webContents.on('will-redirect', onRedirect)
      win.webContents.on('will-navigate', onNavigate)

      // load the Spotify auth URL in the same window
      try {
        await win.loadURL(authUrl)
      } catch (err) {
        cleanupListeners()
        if (!finished) reject(err)
      }
    }
  })
})

ipcMain.handle('spotify-play', async () => {
  const tokens = (global as any).__spotifyTokens
  if (!tokens) throw new Error('No Spotify tokens available')
  const accessToken = tokens.access_token
  const res = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error('Spotify play request failed: ' + errorText)
  }
  return true
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
