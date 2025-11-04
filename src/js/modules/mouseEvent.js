import { mouseEventElements } from "../dom/domElements.js";

const initializeMouseEvent = () => {
    // 마우스 움직임 이벤트
    const circles = mouseEventElements.circles;

    let mouseX = 0;
    let mouseY = 0;

    const arr = Array.from({
        length: circles.length
    }, () => ({x: 0, y: 0}));

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        arr[0].x += (mouseX - arr[0].x) * 0.15;
        arr[0].y += (mouseY - arr[0].y) * 0.15;

        for (let i = 1; i < arr.length; i++) {
            arr[i].x += (arr[i - 1].x - arr[i].x) * 0.15;
            arr[i].y += (arr[i - 1].y - arr[i].y) * 0.15;
        }

        circles.forEach((circle, i) => {
            circle.style.left = arr[i].x + 'px';
            circle.style.top = arr[i].y + 'px';
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

export {initializeMouseEvent};