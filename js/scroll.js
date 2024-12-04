/* 새로고침 시 스크롤 위치 복원 안함 */
history.scrollRestoration = "manual";

let page = 0;
let maxPage = 4;
let animated = false;
let startY = 0;

let minHeight = 640;    // 섹션의 최소 높이

window.addEventListener('load', () => {
    const container = document.getElementById('container');
    const nav = document.querySelectorAll('nav ul li');

    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    // wheel 이벤트 - 원페이지 스크롤 적용(PC)
    window.addEventListener('wheel', e => {
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
            
            scrollEvent(container);
        }
    }, {passive: false});

    // touchstart 시 터치 슬라이드 방향 확인을 위한 터치 시작 지점 Y값 저장(모바일)
    window.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY; 
    }, {passive: false});

    // touchmove 이벤트 - 원페이지 스크롤 적용(모바일)
    window.addEventListener('touchmove', e => {
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
    
            scrollEvent(container);
        }
    }, {passive: false});

    // nav 메뉴 클릭 이벤트
    for(let i = 0; i < nav.length; i++) {
        let el = nav[i];

        el.addEventListener('click', e => {
            page = i + 1;
            scrollEvent(container);
        });
    }
});

let timer = null;
let initialHeight = window.innerHeight;

// 윈도우 높이 변경 시 해당 섹션으로 자동 스크롤
window.addEventListener('resize', function() { 
    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    clearTimeout(timer);
	timer = setTimeout(() => {
        const container = document.getElementById('container');

        // 현재 페이지에 맞게 스크롤
        scrollEvent(container);

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
 * 윈도우 스크롤 이벤트 함수
 * @param {*} el 스크롤 Element 
 */
const scrollEvent = (el) => {
    el.scrollTo({
        top: window.innerHeight * page, 
        behavior: "smooth",
    });
}