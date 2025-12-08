import {accessToken} from './user.js';

const playRequest = {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
    },
}

const play = async () => {
    await fetch('https://api.spotify.com/v1/me/player/play', playRequest)
    .then(response => {
        if (response.status === 204) {
            console.log('Playback started successfully');
        } else {
            console.log('Failed to start playback, status code:', response.status);
        }
    })
    .catch(error => console.error('Error:', error));
}

export { play };