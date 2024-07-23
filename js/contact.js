'use strict';

document.addEventListener('DOMContentLoaded', () => {
    /**
    * MENU RESPONSIVE
    * 
    */
    var menuIcon = document.getElementById('menu-icon');
    var navbarLinks = document.querySelector('.navbar-links');
    menuIcon.addEventListener('click', () => navbarLinks.classList.toggle('active'));

    /**
    * SECCION FORMULARIO
    * 
    */
    var form = document.getElementById('contactForm');
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        var isValid = true;

        if (!/^[a-zA-Z0-9]+$/.test(nameInput.value.trim())) {
            showError(nameInput, 'El nombre debe ser alfanumérico');
            isValid = false;
        } else {
            hideError(nameInput);
        }

        if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
            showError(emailInput, 'El email no es válido');
            isValid = false;
        } else {
            hideError(emailInput);
        }

        if (messageInput.value.trim().length < 5) {
            showError(messageInput, 'El mensaje debe tener al menos 5 caracteres');
            isValid = false;
        } else {
            hideError(messageInput);
        }

        if (isValid) {
            var mailtoLink = `mailto:?subject=Nuevo mensaje de contacto&body=Nombre: ${encodeURIComponent(
            nameInput.value.trim()
        )}%0DEmail: ${encodeURIComponent(
            emailInput.value.trim()
        )}%0AMensaje: ${encodeURIComponent(messageInput.value.trim())}`;
            window.location.href = mailtoLink;
        }
    });

    function showError(input, message) {
        var errorSpan = input.nextElementSibling;
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }

    function hideError(input) {
        var errorSpan = input.nextElementSibling;
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }

});