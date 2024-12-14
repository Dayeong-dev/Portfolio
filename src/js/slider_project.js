window.addEventListener('load', () => {
    const slider = document.querySelector('.project .slider');
    const slides = document.querySelectorAll('.project .slide');

    const btnPrev = document.querySelector('.project .container > .fa-chevron-left');
    const btnNext = document.querySelector('.project .container > .fa-chevron-right');

    const num = slides.length;
    let i = 0;

    // slide의 갯수가 1개일 시 오른쪽 버튼 비활성 상태로 초기화
    if(num === 1) {
        btnNext.style.pointerEvents = "none";
        btnNext.style.color = "#ddd";
    }

    // 슬라이더 - 왼쪽 버튼 클릭 이벤트
    btnPrev.addEventListener("click", () => {
        i--;
        slider.style.transform = `translateX(${-100 * i}%)`;
        if(i === 0) {
            btnPrev.style.pointerEvents = "none";
            btnPrev.style.color = "#ddd";
        }
        if(getComputedStyle(btnNext).pointerEvents === "none") {
            btnNext.style.pointerEvents = "auto";
            btnNext.style.color = "#000";
        }
    });

    // 슬라이더 - 오른쪽 버튼 클릭 이벤트
    btnNext.addEventListener("click", () => {
        i++;
        slider.style.transform = `translateX(${-100 * i}%)`;
        if(i === num - 1) {
            btnNext.style.pointerEvents = "none";
            btnNext.style.color = "#ddd";
        }
        if(getComputedStyle(btnPrev).pointerEvents === "none") {
            btnPrev.style.pointerEvents = "auto";
            btnPrev.style.color = "#000";
        }
    });
});