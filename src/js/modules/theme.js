import { themeElements } from "../dom/domElements.js";

const changeTheme = () => {
    const theme_toggle = themeElements.theme_toggle;
    const isDarkMode = document.body.classList.contains("dark_mode");

    document.body.classList.toggle("dark_mode");

    if(isDarkMode) 
        theme_toggle.classList.replace("fa-sun", "fa-moon");
    else
        theme_toggle.classList.replace("fa-moon", "fa-sun");
}

const initializeTheme = () => {
    const theme_toggle = themeElements.theme_toggle;

    theme_toggle.addEventListener('click', changeTheme);
}

export {initializeTheme};