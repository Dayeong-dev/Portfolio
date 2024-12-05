/* 새로고침 시 스크롤 위치 복원 안함 */
history.scrollRestoration = "manual";

let page = 0;
let maxPage = 4;
let animated = false;
let startY = null;

let minHeight = 680;    // 섹션의 최소 높이
let isOnePageScroll = true;

window.addEventListener('load', () => {
    const wrapper = document.getElementById('wrapper');
    const nav = document.querySelectorAll('nav ul li');

    const overflowY = getComputedStyle(wrapper).overflowY;

    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    // 원 페이지 스크롤이 적용되는 환경인지 확인
    isOnePageScroll = (overflowY !== 'scroll');

    // wheel 이벤트 - 원페이지 스크롤 적용(PC)
    window.addEventListener('wheel', e => {
        // 일반 스크롤이 적용되는 환경
        if(!isOnePageScroll) return;

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
            
            scrollEvent(wrapper);
        }
    }, {passive: false});

    // touchstart 시 터치 슬라이드 방향 확인을 위한 터치 시작 지점 Y값 저장(모바일)
    window.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY; 
    }, {passive: false});

    // touchmove 이벤트 - 원페이지 스크롤 적용(모바일)
    window.addEventListener('touchmove', e => {
        // 일반 스크롤이 적용되는 환경
        if(!isOnePageScroll) return;

        e.preventDefault();
        e.stopPropagation();    // 버블링 중단
    
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

    wrapper.addEventListener('scroll', e => {
        // 뷰포트 높이 변경 시 이전 스크롤 위치에 해당되는 page 저장    // 일반 스크롤 시에만 해당
        let sectionHeight = Math.max(window.innerHeight, minHeight);
        let curr = Math.round(wrapper.scrollTop / sectionHeight);

        if(curr === page) return;
        if(curr < 0 || curr > maxPage - 1) return;  // 마지막 페이지인 footer는 section 높이보다 훨씬 작기 때문에 제외

        page = curr;
    })

    // nav 메뉴 클릭 이벤트
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

// 윈도우 높이 변경 시 해당 섹션으로 자동 스크롤
window.addEventListener('resize', () => { 
    // 모바일에서 주소 표시줄 유무 및 키보드 유무에 따라 100vh가 정확한 높이를 반영할 수 있도록 동적 처리
    adjustHeight();

    clearTimeout(timer);
	timer = setTimeout(() => {
        const wrapper = document.getElementById('wrapper');
        const overflowY = getComputedStyle(wrapper).overflowY;

        // 원 페이지 스크롤이 적용되는 환경인지 확인
        isOnePageScroll = (overflowY !== 'scroll');

        // 현재 페이지에 맞게 스크롤
        scrollEvent(wrapper);
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
    let targetScrollTop = page * Math.max(window.innerHeight, minHeight);

    el.scrollTo({
        top: targetScrollTop, 
        behavior: "smooth",
    });
}