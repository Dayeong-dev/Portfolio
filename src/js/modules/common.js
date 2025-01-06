let timer;
export const debounce = (func, delay) => {
    return (...args) => {
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    }
}

let isInTrottle = false;
export const throttle = (func, delay) => {
    return (...args) => {
        if(!isInTrottle) {
            isInTrottle = true;
            func(...args);
            setTimeout(() => {
                isInTrottle = false;
            }, delay);
        }
    }
}