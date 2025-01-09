import { themeElements } from "../dom/domElements.js";

const changeTheme = () => {
    const theme_toggle = themeElements.theme_toggle;
    const isDarkMode = document.body.classList.contains("dark_mode");

    document.body.classList.toggle("dark_mode");

    if(isDarkMode) {
        theme_toggle.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");
    }
    else {
        theme_toggle.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");
    }
}

const setTheme = () => {
    const theme = localStorage.getItem("theme");
    const theme_toggle = themeElements.theme_toggle;
    
    if(theme === "dark") {
        document.body.classList.add("dark_mode");
        theme_toggle.classList.replace("fa-moon", "fa-sun");
    }

    document.body.style.visibility = "visible";
}

const initializeTheme = () => {
    const theme_toggle = themeElements.theme_toggle;

    setTheme();
    window.addEventListener('storage', setTheme, false);

    theme_toggle.addEventListener('click', changeTheme);
}

export {initializeTheme};