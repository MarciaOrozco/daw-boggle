"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /**
   * MENU RESPONSIVE
   *
   */
  var menuIcon = document.getElementById("menu-icon");
  var navbarLinks = document.querySelector(".navbar-links");
  menuIcon.addEventListener("click", () =>
    navbarLinks.classList.toggle("active")
  );
  var playerName = localStorage.getItem("playerName") || "Jugador";
  var playerNameSpan = document.querySelector("#player-name");
  playerNameSpan.textContent = playerName;
});
