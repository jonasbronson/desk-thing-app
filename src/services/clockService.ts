let time = new Date().toLocaleTimeString();

const getCurrentTime = (): string => {
    time = new Date().toLocaleTimeString();
    return time;
};

const getCurrentTimeAsNumber = (): number => {
    return Date.now();
};

export { getCurrentTime, getCurrentTimeAsNumber, time };