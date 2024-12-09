/* 새로고침 시 스크롤 위치 복원 안함 */
history.scrollRestoration = "manual";

let page = 0;
let maxPage = 4;
let animated = false;
let startY = null;

let observer;   // Intersection Observer 저장 변수

let minHeight = 680;    // 섹션의 최소 높이
let isOnePageScroll = true;

window.addEventListener('load', () => {
    const wrapper = document.getElementById('wrapper');
    const nav = document.querySelectorAll('nav ul li');
    const overflowY = getComputedStyle(wrapper).overflowY;

    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    // Intersection Observer 생성 및 시작
    if(!('IntersectionObserver' in window))
        import('intersection-observer').then(() => createObserver);
    else
        createObserver();

    // 원 페이지 스크롤이 적용되는 환경인지 확인
    isOnePageScroll = (overflowY !== 'scroll');

    // wheel 이벤트 - 원페이지 스크롤 적용(PC)
    window.addEventListener('wheel', e => {
        // 일반 스크롤이 적용되는 환경
        if(!isOnePageScroll) return;

        e.preventDefault();
        e.stopPropagation();    // 버블링 중단

        // overflowY 속성 값이 hidden이면 스크롤 기능 중단
        if(getComputedStyle(wrapper).overflowY === "hidden") return;
          
        // 0.5초 내에 일어난 wheel 이벤트들은 한번으로 인정
        if(!animated) {
            animated = true;
            setTimeout(() => {
                animated = false;
            }, 500);
            
            // 위로 스크롤 시
            if(e.deltaY < 0) {
                if(page === 0)
                    return;
                page--;
            }
            
            // 아래로 스크롤 시
            if(e.deltaY > 0) {
                if(page === maxPage)
                    return;
                page++;
            }
            
            scrollEvent(wrapper);
        }
    }, {passive: false});

    // 터치 슬라이드 방향 확인을 위한 터치 시작(touchstart) 지점 Y값 저장(모바일)
    window.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY; 
    }, {passive: false});

    // touchmove 이벤트 - 원페이지 스크롤 적용(모바일)
    window.addEventListener('touchmove', e => {
        // 일반 스크롤이 적용되는 환경
        if(!isOnePageScroll) return;

        e.preventDefault();
        e.stopPropagation();    // 버블링 중단

        // overflowY 속성 값이 hidden이면 스크롤 기능 중단
        if(getComputedStyle(wrapper).overflowY === "hidden") return;
    
        // 0.5초 내에 일어난 touchmove 이벤트들은 한번으로 인정
        // touchstart 이벤트가 일어난 시점에서만 적용
        if(!animated && startY !== null) {
            animated = true;
            setTimeout(() => {
                animated = false;
            }, 500);
    
            let curr = e.touches[0].clientY;
            
            // 터치 슬라이드 방향이 위에서 아래
            if(startY < curr) {
                if(page === 0)
                    return;
                page--;
            }
    
            // 터치 슬라이드 방향이 아래에서 위
            if(startY > curr) {
                if(page === maxPage)
                    return;
                page++;
            }
    
            startY = null;
    
            scrollEvent(wrapper);
        }
    }, {passive: false});

    // 메뉴 클릭 시 해당 섹션으로 자동 스크롤
    for(let i = 0; i < nav.length; i++) {
        let el = nav[i];

        el.addEventListener('click', e => {
            page = i + 1;
            scrollEvent(wrapper);
        });
    }
});

let timer = null;
let initialHeight = window.innerHeight;

// 뷰포트 크기 변경 시 원래 위치하던 섹션으로 자동 스크롤
window.addEventListener('resize', () => { 
    // resize 시 모든 observer 종료
    if (observer) observer.disconnect();

    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    clearTimeout(timer);
	timer = setTimeout(() => {
        const wrapper = document.getElementById('wrapper');
        const overflowY = getComputedStyle(wrapper).overflowY;

        // resize 이벤트 진행 시 스크롤 기능 중단
        wrapper.style.overflowY = "hidden";

        // 원 페이지 스크롤이 적용되는 환경인지 확인
        isOnePageScroll = (overflowY !== 'scroll');

        // 현재 페이지에 맞게 자동 스크롤
        scrollEvent(wrapper);

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
                // resize 이벤트 종료 시 스크롤 기능 재시작
                wrapper.style.overflowY = overflowY;
                // Intersection Observer 재 생성 및 시작
                createObserver();
                return;
            }
            
            previousScrollTop = currentScrollTop;
            requestAnimationFrame(waitForScrollAnimation);  // waitForScrollAnimation 반복
        }

        // 스크롤 이벤트가 끝날 때까지 대기
        requestAnimationFrame(waitForScrollAnimation);
	}, 300);
});

/**
 * vh 동적 처리 함수
 */
const adjustHeight = () => {
    const vh = window.innerHeight * 0.01;   // 현재 뷰포트의 실제 높이(px 단위)
    document.documentElement.style.setProperty('--vh', `${vh}px`);  // '--vh'라는 커스텀 속성 설정(동적으로 변하는 1vh의 실제 값)
}

/**
 * 해당 요소의 스크롤 이벤트 함수
 * @param {*} el 스크롤을 적용할 요소(Element)
 */
const scrollEvent = (el) => {
    let targetScrollTop = page * Math.max(window.innerHeight, minHeight);

    el.scrollTo({
        top: targetScrollTop, 
        behavior: "smooth",
    });
}

/**
 * 관찰 중인 섹션 인덱스 확인 후 page 저장 함수 (Intersection Observer API 사용) 
 */
const createObserver = () => {
    const sections = document.querySelectorAll('main > section');

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
        root: document.getElementById("wrapper"),
        threshold: 0.5 // 섹션이 50% 이상 보일 때
    });
    
    // Observer 시작
    sections.forEach((section) => observer.observe(section));
}