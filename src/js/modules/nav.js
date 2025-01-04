import { navbarElements } from "../dom/domElements.js";

const handleMenuIcon = () => {
    const nav = navbarElements.nav;
    nav.classList.toggle("active");
}

const initializeNav = () => {
    const menuIcon = navbarElements.menuIcon;
    menuIcon.addEventListener('click', handleMenuIcon);
}

export {initializeNav};