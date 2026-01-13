import { ref } from 'vue';

let time = ref(new Date().toLocaleTimeString());

const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString();
};

const getCurrentTimeAsNumber = (): number => {
    return Date.now();
};

const clock = setInterval(() => {
    time.value = getCurrentTime();
}, 1000);

const killClock = (): void => {
    if(clock === null) {
        return;
    }
    clearInterval(clock);
};

export { time, killClock, getCurrentTimeAsNumber };