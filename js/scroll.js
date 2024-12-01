/* 새로고침 시 스크롤 위치 복원 안함 */
history.scrollRestoration = "manual";

let page = 0;
let maxPage = 4;
let animated = false;
let lastY = 0;

window.addEventListener('load', () => {
    const nav = document.querySelectorAll('nav ul li');
    const main = document.querySelector('main');

    // vh 동적 처리
    adjustHeight();

    /* PC 스크롤 */
    main.addEventListener('wheel', e => {
        e.preventDefault();
          
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
    }, {passive: false});

    /* 모바일 스크롤 */
    main.addEventListener('touchstart', e => {
        e.preventDefault();
        lastY = e.touches[0].clientY; 
    }, {passive: false});

    main.addEventListener('touchmove', e => {
        e.preventDefault();

        // 0.5초 내에 일어난 touchmove 이벤트들은 한번으로 인정
        if(!animated) {
            animated = true;
            setTimeout(() => {
                animated = false;
            }, 500);

            let curr = e.touches[0].clientY;
            
            if(lastY < curr) {
                if(page === 0)
                    return;
                page--;
            }

            if(lastY > curr) {
                if(page === maxPage)
                    return;
                page++;
            }

            scrollEvent(page, window.innerHeight);
        }
    }, {passive: false});

    // nav 메뉴 클릭 이벤트
    for(let i = 0; i < nav.length; i++) {
        let el = nav[i];

        el.addEventListener('click', e => {
            page = i + 1;
            window.scroll({
                top: window.innerHeight * page,
                behavior: "smooth",
            });
        });
    }
});

let timer = null;

// 윈도우 높이 변경 시 해당 섹션으로 자동 스크롤
window.addEventListener('resize', function() {
	clearTimeout(timer);
	timer = setTimeout(() => {
        scrollEvent(page, window.innerHeight);
	}, 300);

    //vh 동적 처리
    adjustHeight();
});

/**
 * 윈도우 스크롤 이벤트
 * @param {*} p page 
 * @param {*} h window.height
 */
const scrollEvent = (p, h) => {
    window.scroll({
        top: h* p, 
        behavior: "smooth",
    });
}

/* vh 동적 처리 */
const adjustHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}