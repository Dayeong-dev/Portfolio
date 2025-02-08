import { navbarElements } from "../dom/domElements.js";

const handleMenuIcon = (e) => {
    const nav = navbarElements.nav;
    
    nav.classList.toggle("active");
    const isActive = nav.classList.contains("active");
    
    if(isActive) 
        e.target.classList.replace("fa-bars", "fa-xmark");
    else
        e.target.classList.replace("fa-xmark", "fa-bars");
}

const initializeNav = () => {
    const menuIcon = navbarElements.menuIcon;
    menuIcon.addEventListener('click', handleMenuIcon);
}

export {initializeNav};