/* 새로고침 시 스크롤 위치 복원 안함 */
history.scrollRestoration = "manual";

window.onload = () => {
    let page = 0;
    let animated = false;

    const nav = document.querySelectorAll('nav ul li');
    const main = document.querySelector('main');

    main.addEventListener('wheel', e => {
      e.preventDefault();
      
        if(!animated) {
            animated = true;
            setTimeout(() => {
                animated = false;
            }, 500);
        
            if(e.deltaY < 0) {
                if(page === 0)
                    return;
                page--;
            }
        
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
    });

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
}