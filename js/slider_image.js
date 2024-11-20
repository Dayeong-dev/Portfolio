window.addEventListener('load', () => {
    const slides = document.querySelectorAll(".project .slider .slide");

    for(let slide of slides) {
        const wrap = slide.querySelector(".inner .wrap");
        const prevBtn = slide.querySelector(".inner .fa-circle-chevron-left");
        const nextBtn = slide.querySelector(".inner .fa-circle-chevron-right");
        const images = wrap.querySelectorAll("img");

        const pagination = slide.querySelector(".inner .pagination");

        const count = images.length;
        let curr = 0;

        // 이미지 페이지네이션 초기화
        for(let i = 0; i < count; i++) {
            let dot = document.createElement('i');
            dot.setAttribute('class', "fa-solid fa-circle");

            // 첫 번째 dot의 class 속성에 activity 추가
            if(i === 0) dot.classList.add("activity");

            pagination.appendChild(dot);
        }

        const dots = pagination.querySelectorAll("i");

        // 이미지 슬라이더 - 왼쪽 버튼 클릭 이벤트
        prevBtn.addEventListener("click", () => {
            if(curr === 0) return;

            curr--;
            wrap.style.transform = `translateX(${-100 * curr}%)`;

            // 페이지네이션 재세팅
            activition(curr, dots);
        });

        // 이미지 슬라이더 - 오른쪽 버튼 클릭 이벤트
        nextBtn.addEventListener("click", () => {
            if(curr === count - 1) return;

            curr++;
            wrap.style.transform = `translateX(${-100 * curr}%)`;
            
            // 페이지네이션 재세팅
            activition(curr, dots);
        });
    }

    // 페이지네이션 재세팅 함수
    const activition = (index, dots) => {
        for(let dot of dots) {
            dot.classList.remove("activity");
        }
        dots[index].classList.add("activity");
    }
});