export let commonElements = {};

// 테마 관련 요소
export let themeElements = {
    theme_toggle: document.getElementById("theme_toggle"),
    tooltip: document.querySelector(".tooltip"),
}

// 메뉴 관련 요소
export let navbarElements = {
    nav: document.querySelector("header > .wrap nav"),
    menuIcon: document.querySelector("header > i.menu"),
};

// 스크롤 관련 요소
export let scrollElements = {
    wrapper: document.getElementById('wrapper'),
    nav: document.querySelectorAll('header > .wrap nav ul li'),
    sections: document.querySelectorAll('main > section'), 
};

// 모달 관련 요소
export let modalElements = {
    projectImageWrappers: document.querySelectorAll('.project .container .slider .slide .inner > .wrap .images'),
    modal: document.querySelector(".modal"),
    modalContent: document.querySelector(".modal > .wrap .content"),
    footer: document.querySelector(".modal > .wrap .footer"), 
    cancel: document.querySelector(".modal > .wrap .header i"),
    spinner: document.querySelector(".modal > .wrap .content i.fa-spinner"),
};

// 커리어 슬라이더 관련 요소
export let sliderCareerElements = {
    slides: document.querySelectorAll(".career .container .slider article.slide"),
    pagination: document.querySelector(".career .container .pagination"),
    preBtn: document.querySelector(".career .container .pagination .fa-arrow-left-long"),
    nextBtn: document.querySelector(".career .container .pagination .fa-arrow-right-long"),
    page: document.querySelector(".career .container .pagination div.num .page"),
    total: document.querySelector(".career .container .pagination div.num .total"),
};

// 프로젝트 슬라이더 관련 요소
export let sliderProjectElements = {
    slider: document.querySelector('.project .slider'),
    slides: document.querySelectorAll('.project .slide'),
    btnPrev: document.querySelector('.project .container > .fa-chevron-left'),
    btnNext: document.querySelector('.project .container > .fa-chevron-right'),
};

// 해당 프로젝트의 이미지 슬라이더 관련 요소
export let sliderImageElements = {
    slides: document.querySelectorAll(".project .slider .slide"),
    slideElements: {},
};

export const setImageSlideElement = () => {
    let slideElements = {};
    let slides = sliderImageElements.slides;

    slides.forEach((slide, index) => {
        slideElements[index] = {
            prevBtn: slide.querySelector(".inner > .wrap .fa-circle-chevron-left"),
            nextBtn: slide.querySelector(".inner > .wrap .fa-circle-chevron-right"),
            imageWrapper: slide.querySelector(".inner > .wrap .images"),
            imgs: slide.querySelectorAll(".inner > .wrap .images img"),
            pagination: slide.querySelector(".inner > .wrap .pagination"),
            dots: slide.querySelectorAll(".inner > .wrap .pagination i"),
        }
    });
    
    sliderImageElements.slideElements = slideElements;
}

setImageSlideElement();

// 마우스 이벤트 관련 요소
export let mouseEventElements = {
    circles: document.querySelectorAll('.circle'),
}