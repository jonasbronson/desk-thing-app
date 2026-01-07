import {getCurrentTimeAsNumber} from './clockService';
import {ref} from "vue";

let endTime: number | null = null;

let timeLeft: number = 25 * 60 * 1000; // Default 25 minutes

const startTimer = (): void => {
    const currentTime = getCurrentTimeAsNumber();
    endTime = currentTime + timeLeft;
    timer = setInterval(() => {
        const remaining = getRemainingTime();
        if (remaining !== 0 && remaining !== null) {
            timeLeft = remaining;
            timeLeftDisplay = remainingTimeToString();
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

let timer: any = ref(null);

const stopTimer = (): void => {
    if(timer === null) {
        return;
    }
    clearInterval(timer);
};

let timeLeftDisplay: any = ref(remainingTimeToString());

export { startTimer, getRemainingTime, remainingTimeToString, stopTimer, timeLeftDisplay };