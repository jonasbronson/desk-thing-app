import {getCurrentTimeAsNumber} from './clockService';
import { ref } from 'vue';

let endTime: number | null = null;

const timerDefault: number = 20 * 60 * 1000; // Default 20 minutes

const breakDefault: number = 5 * 60 * 1000; // Default 5 minutes

let timeLeft: number = timerDefault;

let timerActive: any = ref(false);

let breakActive: any = ref(false);

const startTimer = (): void => {
    breakActive.value ? setEndTimer(breakDefault) : setEndTimer(timerDefault);
    timeLeft = timeLeft === 0 ? timerDefault : timeLeft;
    clearTimer();
    timerActive.value = true;
    timer = setInterval(() => {
        const remaining = getRemainingTime();
        if (remaining !== 0 && remaining !== null) {
            timeLeft = remaining;
            timeLeftDisplay.value = remainingTimeToString();
        }
        else{
            stopTimer();
        }
    }, 250);
};

const getRemainingTime = (): number | null => {
    if (endTime === null) {
        return null;
    }
    const currentTime = getCurrentTimeAsNumber();
    const remainingTime = endTime - currentTime;
    return remainingTime > 0 ? remainingTime : 0;
};

const remainingTimeToString = (): string => {
    const totalSeconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

let timer: any = null;

const setEndTimer = (timerDuration: number): void => {
    const currentTime = getCurrentTimeAsNumber();
    endTime = currentTime + timerDuration;
};

const stopTimer = (): void => {
    if(remainingTimeToString() === "00:00" && !breakActive.value) {
        startBreak();
    }
    else if(remainingTimeToString() === "00:00" && breakActive.value) {
        breakActive.value = false;
        startTimer();
    }
    else{
        clearTimer();
        breakActive.value = false;
        timeLeft = timerDefault;
        timeLeftDisplay.value = remainingTimeToString();
    }
};

const startBreak = (): void => {
    timeLeft = breakDefault;
    clearTimer();
    breakActive.value = true;
    startTimer();
}

const clearTimer = (): void => {
    if(timer === null) {
        return;
    }
    timerActive.value = false;
    clearInterval(timer);
}

let timeLeftDisplay = ref(remainingTimeToString());

export { startTimer, startBreak, getRemainingTime, remainingTimeToString, stopTimer, timeLeftDisplay, timerActive, breakActive };