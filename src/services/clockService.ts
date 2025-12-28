let time = new Date().toLocaleTimeString();

const getCurrentTime = (): string => {
    time = new Date().toLocaleTimeString();
    return time;
};

export { getCurrentTime, time };