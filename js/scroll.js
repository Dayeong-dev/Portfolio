/* 새로고침 시 스크롤 위치 복원 안함 */
history.scrollRestoration = "manual";

let page = 0;
let animated = false;

window.addEventListener('load', () => {
    const nav = document.querySelectorAll('nav ul li');
    const main = document.querySelector('main');

    main.addEventListener('wheel', e => {
        e.preventDefault();
      
        // 0.5초 내에 일어난 스크롤은 스크롤 한번으로 인정
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
                if(page === 4)
                    return;
                page++;
            }
        
            window.scroll({
                top: window.innerHeight * page, 
                behavior: "smooth",
            });
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
		window.scroll({
            top: window.innerHeight * page, 
            behavior: "smooth",
        });
	}, 300);
});