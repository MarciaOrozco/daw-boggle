"use strict";

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    let isValid = true;

    // Name validation (alphanumeric)
    if (!/^[a-zA-Z0-9]+$/.test(nameInput.value.trim())) {
        showError(nameInput, "El nombre debe ser alfanumérico");
        isValid = false;
    } else {
        hideError(nameInput);
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
        showError(emailInput, "El email no es válido");
        isValid = false;
    } else {
        hideError(emailInput);
    }

    // Message validation (minimum 5 characters)
    if (messageInput.value.trim().length < 5) {
        showError(messageInput, "El mensaje debe tener al menos 5 caracteres");
        isValid = false;
    } else {
        hideError(messageInput);
    }

    if (isValid) {
        // Construct mailto link with URL encoding
        const mailtoLink = `mailto:?subject=Nuevo mensaje de contacto&body=Nombre: ${encodeURIComponent(
            nameInput.value.trim()
        )}%0DEmail: ${encodeURIComponent(
            emailInput.value.trim()
        )}%0AMensaje: ${encodeURIComponent(messageInput.value.trim())}`;
        window.location.href = mailtoLink;
    }
});

function showError(input, message) {
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
}

function hideError(input) {
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
}
