import { lazyImageElements } from "../dom/domElements.js";

const initializeLazyImage = () => {
    const gifs = lazyImageElements.gifs;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = "src/assets/images/" + entry.target.dataset.src;
                observer.unobserve(entry.target);
            }
        });
    });
    
    gifs.forEach(gif => observer.observe(gif));
}

export {initializeLazyImage};