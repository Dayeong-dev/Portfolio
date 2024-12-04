/* 새로고침 시 스크롤 위치 복원 안함 */
history.scrollRestoration = "manual";

let page = 0;
let maxPage = 4;
let animated = false;
let startY = 0;

let minHeight = 640;    // 섹션의 최소 높이
let preHeight = 0;  // resize 이전의 뷰포트 높이

window.addEventListener('load', () => {
    const main = document.querySelector('main');
    const nav = document.querySelectorAll('nav ul li');

    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    if (isOnePageScrollEnabled()) {
        // 원 페이지 스크롤 적용
        enableOnePageScroll(main);
    } else {
        // 일반 스크롤 적용
        disableOnePageScroll(main);
    }

    // nav 메뉴 클릭 이벤트
    for(let i = 0; i < nav.length; i++) {
        let el = nav[i];

        el.addEventListener('click', e => {
            page = i + 1;
            scrollEvent(page, window.innerHeight);
        });
    }

    // 현재 브라우저 높이 저장 (minHeight 보다 작으면 minHeight 저장)
    // resize로 인해 일반 스크롤에서 원 페이지 스크롤로 변경 시 page 초기화를 위함
    preHeight = Math.max(window.innerHeight, minHeight);
});

let timer = null;
let initialHeight = window.innerHeight;

// 윈도우 높이 변경 시 해당 섹션으로 자동 스크롤
window.addEventListener('resize', function() {
    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    // 주소표시줄로 인한 resize 이벤트 무시
    const currentHeight = window.innerHeight;
    if(Math.abs(currentHeight - initialHeight) <= 100) {
        initialHeight = currentHeight; 
        return;
    }
    initialHeight = currentHeight;
    
    clearTimeout(timer);
	timer = setTimeout(() => {
        const main = document.querySelector('main');

        if (isOnePageScrollEnabled()) {
            // 원 페이지 스크롤 적용
            enableOnePageScroll(main);
        } else {
            // 일반 스크롤 적용
            disableOnePageScroll(main);
        }

        // resize로 인해 일반 스크롤에서 원 페이지 스크롤로 변경 시 해당 위치의 page 저장
        const currentScrollTop = document.documentElement.scrollTop;
        page = Math.round(currentScrollTop / preHeight);
        page = Math.max(0, Math.min(page, maxPage - 1));    // page 4는 footer이기 때문에 제외(maxPage - 1)

        // 현재 페이지에 맞게 스크롤
        scrollEvent(page, window.innerHeight);

        // 새 높이를 preHeight에 저장
        preHeight = Math.max(window.innerHeight, minHeight);
	}, 300);
});

/**
 * 윈도우 스크롤 이벤트 함수
 * @param {*} p page 
 * @param {*} h window.height
 */
const scrollEvent = (p, h) => {
    h = Math.max(h, minHeight);

    window.scrollTo({
        top: h* p, 
        behavior: "smooth",
    });
}

/**
 * vh 동적 처리 함수
 */
const adjustHeight = () => {
    const vh = window.innerHeight * 0.01;   // 현재 뷰포트의 실제 높이(px 단위)
    document.documentElement.style.setProperty('--vh', `${vh}px`);  // '--vh'라는 커스텀 속성 설정(동적으로 변하는 1vh의 실제 값)
}

/**
 * 원 페이지 스크롤 적용 여부 확인 함수
 * @returns 원 페이지 스크롤이 활성화되었으면 true, 아니면 false
 */
const isOnePageScrollEnabled = () => {
    const overflow = window.getComputedStyle(document.documentElement).overflow;    // 'html' 태그의 overflow 속성 값 
    return overflow !== 'auto';
};

/**
 * 원 페이지 스크롤 기능 적용
 * @param {*} main 원 페이지 스크롤을 적용할 Element - 현재 main 태그
 */
const enableOnePageScroll = (main) => {
    // PC
    main.addEventListener('wheel', handleWheel, {passive: false});

    // 모바일
    main.addEventListener('touchstart', handleTouchStart, {passive: false});
    main.addEventListener('touchmove', handleTouchMove, {passive: false});
}

/**
 * 원 페이지 스크롤 기능 제거
 * @param {*} main 원 페이지 스크롤을 제거할 Element - 현재 main 태그
 */
const disableOnePageScroll = (main) => {
    main.removeEventListener('wheel', handleWheel, {passive: false});
    main.removeEventListener('touchstart', handleTouchStart, {passive: false});
    main.removeEventListener('touchmove', handleTouchMove, {passive: false});
}

// wheel 이벤트 - 원페이지 스크롤 적용(PC)
const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();    // 버블링 중단
      
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
        
        scrollEvent(page, window.innerHeight);
    }
}

// touchstart 시 터치 슬라이드 방향 확인을 위한 터치 시작 지점 Y값 저장(모바일)
const handleTouchStart = (e) => {
    startY = e.touches[0].clientY; 
}

// touchmove 이벤트 - 원페이지 스크롤 적용(모바일)
const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();    // 버블링 중단

    // 0.5초 내에 일어난 touchmove 이벤트들은 한번으로 인정
    // touchstart 이벤트가 일어난 시점에서만 적용
    if(!animated && startY !== 0) {
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

        startY = 0;

        scrollEvent(page, window.innerHeight);
    }
}