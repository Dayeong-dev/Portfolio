import { themeElements } from "../dom/domElements.js";

const handleTheme = () => {
    const theme_toggle = themeElements.theme_toggle;
    const tooltip = themeElements.tooltip;
    const isDarkMode = document.body.classList.contains("dark_mode");

    document.body.classList.toggle("dark_mode");

    if(isDarkMode) {
        theme_toggle.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");
        tooltip.setAttribute("data-before", "Nox");
    }
    else {
        theme_toggle.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");
        tooltip.setAttribute("data-before", "Lumos");
    }
}

const setTheme = () => {
    const theme_toggle = themeElements.theme_toggle;
    const tooltip = themeElements.tooltip;
    const theme = localStorage.getItem("theme");
    
    if(theme === "dark") {
        document.body.classList.add("dark_mode");
        theme_toggle.classList.replace("fa-moon", "fa-sun");
        tooltip.setAttribute("data-before", "Lumos");
    }

    document.body.style.visibility = "visible";
}

const initializeTheme = () => {
    const theme_toggle = themeElements.theme_toggle;

    setTheme();
    window.addEventListener('storage', handleTheme, false);

    theme_toggle.addEventListener('click', handleTheme);
}

export {initializeTheme};