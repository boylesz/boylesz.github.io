// Navigation
// Responsive Toggle Navigation
let menuIcon = document.querySelector('.menuIcon');
let nav = document.querySelector('.overlay-menu');
let navMenu = document.querySelector('.overlay-menu #menu');

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

navMenu.addEventListener('click', () => {
    nav.style.transform = 'translateX(-100%)';
    nav.style.transition = 'transform 0.2s ease-out';
    toggleMenuIcon();
});

// Toggle Menu Icon ========================================
let toggleIcon = document.querySelector('.menuIcon');

toggleIcon.addEventListener('click', toggleMenuIcon);

function toggleMenuIcon() {
    if (toggleIcon.className != 'menuIcon toggle') {
        toggleIcon.className += ' toggle';
    } else {
        toggleIcon.className = 'menuIcon';
    }
}