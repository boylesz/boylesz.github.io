let menuIcon = document.querySelector('.menu-icon');
let nav = document.querySelector('.overlay-menu');

menuIcon.addEventListener('click', () => {
    if (nav.style.transform != 'translateX(0%)') {
        nav.style.transform = 'translateX(0%)';
        nav.style.transition = 'transform 0.2s ease-out';
    }
    else { 
        nav.style.transform = 'translateX(-100%)';
        nav.style.transition = 'transform 0.2s ease-out';
    }
});

nav.addEventListener('click', () => {
    nav.style.transform = 'translateX(-100%)';
    nav.style.transition = 'transform 0.2s ease-out';
    toggleMenuIcon();
});

let toggleIcon = document.querySelector('.menu-icon');

toggleIcon.addEventListener('click', toggleMenuIcon);

function toggleMenuIcon() {
    if (toggleIcon.className != 'menuIcon toggle') {
        toggleIcon.className += ' toggle';
    } else {
        toggleIcon.className = 'menuIcon';
    }
}