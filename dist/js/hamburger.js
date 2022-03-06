//* Hamburger menu
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('#mobile-menu');
const menuLabel = document.querySelector('#menu-label');
const facebookIcon = document.querySelector('.fa-facebook');
let toggle = false;
menuBtn.addEventListener('click', () => {
    menuToggle();
});

menuLabel.addEventListener('click', () => {
    menuToggle();
});

function menuToggle () {
    if(!toggle) {
        menuBtn.classList.add('open');
        mobileMenu.classList.add('open');
        menuLabel.classList.add('hidden');
        facebookIcon.classList.add('hidden');
        toggle = true;
    } else {
        menuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        menuLabel.classList.remove('hidden');
        facebookIcon.classList.remove('hidden');
        toggle = false;
    }
};