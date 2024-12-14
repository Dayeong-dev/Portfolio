window.addEventListener('load', () => {
    const nav = document.querySelector("header nav");
    const menuIcon = document.querySelector("header .fa-bars");

    menuIcon.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
});