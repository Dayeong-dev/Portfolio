window.addEventListener('load', () => {
    const slides = document.querySelectorAll(".career .container .slider article.slide");
    const length = slides.length;

    const pagination = document.querySelector(".career .container .pagination");
    const preBtn = pagination.querySelector(".fa-arrow-left-long");
    const nextBtn = pagination.querySelector(".fa-arrow-right-long");

    const page = pagination.querySelector("div.num .page");
    const total = pagination.querySelector("div.num .total");
    total.innerText = length;

    let num = 0;    // 현재 페이지 - 1

    preBtn.addEventListener("click", () => {
        if(num === 0) return;
        
        num--;
        page.innerText = num + 1;

        for(let slide of slides) {
            slide.style.transform = `translateX(${-100 * num}%)`;
        }
    });

    nextBtn.addEventListener("click", () => {
        if(num === length - 1) return;
        
        num++;
        page.innerText = num + 1;

        for(let slide of slides) {
            slide.style.transform = `translateX(${-100 * num}%)`;
        }
    });
});