"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var board = document.getElementById("boggle-board");
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var letterButton = [];
  var selectedWord = "";
  var selectedIndexes = [];
  var answerInput = document.getElementById("boggle-add-word");

  // Crear tablero
  for (var i = 0; i < 4; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < 4; j++) {
      var cell = document.createElement("td");
      cell.textContent = letters.charAt(
        Math.floor(Math.random() * letters.length)
      );
      cell.classList.add("letter-button");
      row.appendChild(cell);
      letterButton.push(cell);
    }
    board.appendChild(row);
  }

  // Manejar la selección de letras en el tablero
  function userAnswer() {
    letterButton.forEach((letter, index) => {
      letter.addEventListener("click", (e) => {
        if (letter.classList.contains("disabled")) {
          return;
        }

        if (letter.classList.contains("letter-button-selected")) {
          if (
            letter.innerText == selectedWord.charAt(selectedWord.length - 1)
          ) {
            selectedWord = selectedWord.slice(0, -1);
            selectedIndexes.pop();
            letter.classList.remove("letter-button-selected");
            letter.classList.add("letter-button");
          }
        } else {
          const selectedChoice = e.target;
          let selectedLetter = selectedChoice.innerText;
          selectedWord = selectedWord + selectedLetter;
          selectedIndexes.push(index);

          letter.classList.remove("letter-button");
          letter.classList.add("letter-button-selected");
        }

        answerInput.value = selectedWord;

        let idx = selectedIndexes[selectedIndexes.length - 1];
        let row = Math.floor(idx / 4);
        let col = idx % 4;
        let enabled = [];

        for (let k = -1; k <= 1; ++k) {
          for (let l = -1; l <= 1; ++l) {
            let enabledRow = row + k,
              enabledCol = col + l;

            if (
              enabledRow < 0 ||
              enabledCol < 0 ||
              enabledRow >= 4 ||
              enabledCol >= 4
            )
              continue;
            if (row == enabledRow && col == enabledCol) continue;

            enabled.push(4 * enabledRow + enabledCol);
          }
        }

        letterButton.forEach((button, idx) => {
          if (selectedIndexes.length > 0 && !enabled.includes(idx)) {
            if (
              !button.classList.contains("disabled") &&
              !button.classList.contains("letter-button-selected")
            ) {
              button.classList.add("disabled");
              button.classList.remove("letter-button");
            }
          } else {
            button.classList.remove("disabled");
            if (!button.classList.contains("letter-button"))
              button.classList.add("letter-button");
          }
        });
      });
    });
  }

  userAnswer();
});
