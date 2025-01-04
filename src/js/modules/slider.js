import { sliderProjectElements, sliderImageElements, sliderCareerElements } from '../dom/domElements.js';

// 공통 상수
const SLIDE_WIDTH_PERCENT = -100;

// Project Slider State
const projectSliderState = {
    currentPage: 0,
    maxPage: 0,
}

// Career Slider State
const careerSliderState = {
    currentPage:0,
    maxPage: 0,
}

/**
 * Project Slider - 왼쪽 버튼 클릭 이벤트
 */
const prevProjectSlide = () => {
    const {slider, btnPrev, btnNext} = sliderProjectElements;

    projectSliderState.currentPage--;
    slider.style.transform = `translateX(${SLIDE_WIDTH_PERCENT * projectSliderState.currentPage}%)`;

    if(projectSliderState.currentPage === 0) {
        btnPrev.style.pointerEvents = "none";
        btnPrev.style.color = "#ddd";
    }

    if(getComputedStyle(btnNext).pointerEvents === "none") {
        btnNext.style.pointerEvents = "auto";
        btnNext.style.color = "#000";
    }
}

/**
 * Project Slider - 오른쪽 버튼 클릭 이벤트
 */
const nextProjectSlide = () => {
    const {slider, btnPrev, btnNext} = sliderProjectElements;

    projectSliderState.currentPage++;
    slider.style.transform = `translateX(${SLIDE_WIDTH_PERCENT * projectSliderState.currentPage}%)`;

    if(projectSliderState.currentPage === projectSliderState.maxPage - 1) {
        btnNext.style.pointerEvents = "none";
        btnNext.style.color = "#ddd";
    }

    if(getComputedStyle(btnPrev).pointerEvents === "none") {
        btnPrev.style.pointerEvents = "auto";
        btnPrev.style.color = "#000";
    }
}

// const prevImageSlide = () => {}
// const nextImageSlide = () => {}

/**
 * Career Slider - 왼쪽 화살표 버튼 클릭 이벤트
 */
const prevCareerSlide = () => {
    const {slides, page} = sliderCareerElements
    
    if(careerSliderState.currentPage === 0) return;
    
    careerSliderState.currentPage--;
    page.innerText = careerSliderState.currentPage + 1;

    for(let slide of slides) {
        slide.style.transform = `translateX(${SLIDE_WIDTH_PERCENT * careerSliderState.currentPage}%)`;
    }
}

/**
 * Career Slider - 오른쪽 화살표 클릭 이벤트
 */
const nextCareerSlide = () => {
    const {slides, page} = sliderCareerElements

    if(careerSliderState.currentPage === careerSliderState.maxPage - 1) return;
    
    careerSliderState.currentPage++;
    page.innerText = careerSliderState.currentPage + 1;

    for(let slide of slides) {
        slide.style.transform = `translateX(${SLIDE_WIDTH_PERCENT * careerSliderState.currentPage}%)`;
    }
}

/**
 * 페이지네이션 업데이트 함수
 * @param {*} index 활성화 된 이미지 인덱스
 * @param {*} dots 페이지네이션 dot 리스트
 */
const updatePaginationDots = (index, dots) => {
    for(let dot of dots) {
        dot.classList.remove("active");
    }
    dots[index].classList.add("active");
}

const initializeProjectSlider = () => {
    const {btnPrev, btnNext, slides} = sliderProjectElements;
    projectSliderState.maxPage = slides.length;
    
    // slide의 갯수가 1개일 시 오른쪽 버튼 비활성 상태로 초기화
    if(projectSliderState.maxPage === 1) {
        btnNext.style.pointerEvents = "none";
        btnNext.style.color = "#ddd";
    }

    btnPrev.addEventListener('click', prevProjectSlide);
    btnNext.addEventListener('click', nextProjectSlide);
}

const initializeImageSlider = () => {
    const slides = sliderImageElements.slides;

    slides.forEach((slide, index) => {
        const {prevBtn, nextBtn, pagination, images, wrap} = sliderImageElements.slideElements[index];

        const count = images.length;
        let curr = 0;

        // 이미지 페이지네이션 초기화
        for(let i = 0; i < count; i++) {
            let dot = document.createElement("i");
            dot.setAttribute('class', "fa-solid fa-circle");

            // 첫 번째 dot의 class 속성에 active 추가
            if(i === curr) dot.classList.add("active");

            pagination.appendChild(dot);
        }

        const dots = pagination.querySelectorAll("i");

        prevBtn.addEventListener("click", () => {
            if(curr === 0) return;

            curr--;
            wrap.style.transform = `translateX(${SLIDE_WIDTH_PERCENT * curr}%)`;

            // 페이지네이션 재세팅
            updatePaginationDots(curr, dots);
        });

        nextBtn.addEventListener("click", () => {
            if(curr === count - 1) return;

            curr++;
            wrap.style.transform = `translateX(${SLIDE_WIDTH_PERCENT * curr}%)`;
            
            // 페이지네이션 재세팅
            updatePaginationDots(curr, dots);
        });
    });
}

const initializeCareerSlider = () => {
    const {slides, total, preBtn, nextBtn} = sliderCareerElements;
    
    careerSliderState.maxPage = slides.length;
    total.innerText = careerSliderState.maxPage;

    preBtn.addEventListener("click", prevCareerSlide);
    nextBtn.addEventListener("click", nextCareerSlide);
}

export {initializeProjectSlider, initializeImageSlider, initializeCareerSlider};