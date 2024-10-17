window.addEventListener('load', () => {
    const slider = document.querySelector('.project .slider');
    const slides = document.querySelectorAll('.project .slide');

    const btnPrev = document.querySelector('.project .left');
    const btnNext = document.querySelector('.project .right');

    const num = slides.length;
    let i = 0;

    btnPrev.addEventListener("click", () => {
        i--;
        slider.style.transform = `translateX(${-100 * i}%)`;
        if(i === 0) {
            btnPrev.style.pointerEvents = "none";
            btnPrev.style.color = "#ddd";
        }
        else {
            btnNext.style.pointerEvents = "auto";
            btnNext.style.color = "#000";
        }
    });

    btnNext.addEventListener("click", () => {
        i++;
        slider.style.transform = `translateX(${-100 * i}%)`;
        if(i === num - 1) {
            btnNext.style.pointerEvents = "none";
            btnNext.style.color = "#ddd";
        }
        else {
            btnPrev.style.pointerEvents = "auto";
            btnPrev.style.color = "#000";
        }
    });
});