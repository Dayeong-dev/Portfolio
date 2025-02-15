import { scrollElements, modalElements } from "../dom/domElements.js";
import { debounce, throttle } from "./common.js";

let page = 0;
let maxPage = 5;
let startX = 0;
let startY = 0;

let observer;   // Intersection Observer 저장 변수

let minHeight = 680;    // 섹션의 최소 높이
let isOnePageScroll = true;

let lastScrollTime = 0;
let prevDeltaY = 0;
let SCROLL_DELAY = 300;

const handleWheel = (e) => {
    const wrapper = scrollElements.wrapper;

    // 일반 스크롤이 적용되는 환경
    if(!isOnePageScroll) return;

    e.preventDefault();
    e.stopPropagation();    // 버블링 중단

    if((Math.abs(e.deltaY) > 4) && (Math.abs(prevDeltaY) < Math.abs(e.deltaY))) {
        if(Date.now() - lastScrollTime > SCROLL_DELAY) {
            if(e.deltaY < 0 && page > 0) {
                page--;
            }
            else if(e.deltaY > 0 && page < maxPage) {
                page++;
            }
            adjustPage(wrapper);
        }
        lastScrollTime = Date.now();
    }
    prevDeltaY = e.deltaY;

    // 일정 시간 wheel 이벤트 호출 없을 시 prevDeltaY 값 초기화 
    const debouncedScroll = debounce(() => {
        prevDeltaY = 0;
    }, SCROLL_DELAY);

    debouncedScroll();
}

const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY; 
}

const handleTouchMove = (e) => {
    const wrapper = scrollElements.wrapper;

    // 일반 스크롤이 적용되는 환경
    if(!isOnePageScroll) return;

    e.preventDefault();
    e.stopPropagation();    // 버블링 중단

    // touchstart 이벤트가 일어난 시점에서만 적용
    if(!startY) return;
        
    const throttledScroll = throttle((e) => {
        let currX = e.touches[0].clientX;
        let currY = e.touches[0].clientY;

        // 가로로 터치 슬라이드 시 스크롤 무시 
        if(Math.abs(startX - currX) > 10) return;

        if(startY < currY && page > 0)
            page--;
        if(startY > currY && page < maxPage)
            page++;

        startX = 0;
        startY = 0;

        adjustPage(wrapper);
    });

    throttledScroll(e);
}

const handleResize = () => { 
    // resize 이벤트 진행 시 스크롤 기능 중단
    removeScrollEvent();
    // resize 시 모든 observer 종료
    if (observer) observer.disconnect();

    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

	const debouncedResize = debounce(() => {
        const wrapper = scrollElements.wrapper;
        const modal = modalElements.modal;
        const overflowY = getComputedStyle(wrapper).overflowY;
        const isModalOpen = (getComputedStyle(modal).display === "block");

        // 원 페이지 스크롤이 적용되는 환경인지 확인
        isOnePageScroll = (overflowY !== 'scroll');

        // 현재 페이지에 맞게 자동 스크롤
        adjustPage(wrapper);

        let previousScrollTop = null;   // 이전 스크롤 위치
        let num = 120;   // 최대 반복 횟수

        /**
         * 스크롤 이벤트가 종료되었는지 확인하는 함수
         */
        const waitForScrollAnimation = () => {
            if(num-- <= 0) return;

            // 현재 스크롤 위치 저장
            const currentScrollTop = wrapper.scrollTop;

            // 스크롤 위치가 더 이상 변경되지 않으면 createObserver 함수 호출
            if (currentScrollTop === previousScrollTop) {
                // Intersection Observer 재 생성 및 시작
                createObserver();                
                // resize 이벤트 종료 시 모달이 켜진 상태가 아닐 때 스크롤 기능 재시작
                if(!isModalOpen) addScrollEvent();
                return;
            }
            
            previousScrollTop = currentScrollTop;
            requestAnimationFrame(waitForScrollAnimation);  // waitForScrollAnimation 반복
        }

        // 스크롤 이벤트가 끝날 때까지 대기
        requestAnimationFrame(waitForScrollAnimation);
	}, 300);

    debouncedResize();
}

/**
 * 해당 요소의 스크롤 위치 세팅 함수 - 현재 페이지의 시작 지점으로 스크롤 세팅
 * @param {*} el 스크롤을 적용할 요소(Element)
 */
const adjustPage = (el) => {
    const targetScrollTop = page * Math.max(window.innerHeight, minHeight);

    el.scrollTo({
        top: targetScrollTop, 
        behavior: "smooth",
    });
}

/**
 * 관찰 중인 섹션 인덱스 확인 후 page 저장 함수 (Intersection Observer API 사용) 
 */
const createObserver = () => {
    // 원 페이지 스크롤 일 때는 관찰 중단
    if(isOnePageScroll) return;

    const sections = scrollElements.sections;

    // 뷰포트 높이가 minHeight 보다 작을 시 섹션과 뷰포트 높이 비율에 맞게 동적으로 threshold 적용
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight >= minHeight ? 0.6 : (viewportHeight / minHeight) * 0.6

    // Intersection Observer 생성
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 현재 위치한 섹션의 인덱스 추출 및 page 변수에 저장
                const index = Array.from(sections).indexOf(entry.target);
                page = index;
            }
        });
    }, {
        root: scrollElements.wrapper,
        threshold: threshold,
    });
    
    // Observer 시작
    sections.forEach((section) => observer.observe(section));
}

/**
 * vh 동적 처리 함수
 */
const adjustHeight = () => {
    const vh = window.innerHeight * 0.01;   // 현재 뷰포트의 실제 높이(px 단위)
    document.documentElement.style.setProperty('--vh', `${vh}px`);  // '--vh'라는 커스텀 속성 설정(동적으로 변하는 1vh의 실제 값)
}

/**
 * 스크롤 이벤트 등록 함수
 */
const addScrollEvent = () => {
    // wheel 이벤트 - 원페이지 스크롤 적용(PC)
    window.addEventListener('wheel', handleWheel, {passive: false});
    // 터치 슬라이드 방향 확인을 위한 터치 시작(touchstart) 지점 Y값 저장(모바일)
    window.addEventListener('touchstart', handleTouchStart, {passive: false});
    // touchmove 이벤트 - 원페이지 스크롤 적용(모바일)
    window.addEventListener('touchmove', handleTouchMove, {passive: false});
}

/**
 * 스크롤 이벤트 제거 함수
 */
const removeScrollEvent = () => {
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
}

const initializeScroll = () => {
    const wrapper = scrollElements.wrapper;
    const nav = scrollElements.nav;
    const overflowY = getComputedStyle(wrapper).overflowY;

    // 원 페이지 스크롤이 적용되는 환경인지 확인
    isOnePageScroll = (overflowY !== 'scroll');
    
    // Intersection Observer 생성 및 시작
    if(!('IntersectionObserver' in window))
        import('intersection-observer').then(() => createObserver);
    else
        createObserver();

    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();
    // 초기 스크롤 이벤트 등록 함수
    addScrollEvent();

    // 메뉴 클릭 시 해당 섹션으로 자동 스크롤
    for(let i = 0; i < nav.length; i++) {
        let el = nav[i];

        el.addEventListener('click', e => {
            page = i + 1;
            adjustPage(wrapper);
        });
    }

    window.addEventListener('resize', handleResize);
}

export {initializeScroll, addScrollEvent, removeScrollEvent, adjustHeight};