'use strict';

document.addEventListener('DOMContentLoaded', () => {
    /**
    * MENU RESPONSIVE
    * 
    */
    var menuIcon = document.getElementById('menu-icon');
    var navbarLinks = document.querySelector('.navbar-links');
    menuIcon.addEventListener('click', () => navbarLinks.classList.toggle('active'));
});