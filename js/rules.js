"use strict";

document.addEventListener("DOMContentLoaded", () => {
    var menuIcon = document.getElementById('menu-icon');
    var navbarLinks = document.querySelector('.navbar-links');
    menuIcon.addEventListener('click', () => navbarLinks.classList.toggle('active'));
});