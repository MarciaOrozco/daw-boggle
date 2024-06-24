"use strict";

document.addEventListener("DOMContentLoaded", function () {
    /**
    * SECCION DE TABLERO 
    * 
    */
    var menuIcon = document.querySelector('#menu-icon');
    var navbarLinks = document.querySelector('.navbar-links');
    menuIcon.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');
    });

    var BOARD_SIZE = 16;
    var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var boggleContainer = document.querySelector('#boggle');
    var answerInput = document.querySelector("#boggle-add-word");
    var selectedWord = "";
    var selectedIndexes = [];

    function createBoard() {
        var board = document.createElement('div');
        board.className = 'board';

        for (var i = 0; i < BOARD_SIZE; i++) {
            var cube = document.createElement('div');
            cube.className = 'letter-button';
            cube.textContent = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
            cube.addEventListener('click', handleLetterClick);
            board.appendChild(cube);
        }

        boggleContainer.appendChild(board);
    }

    function handleLetterClick(event) {
        var letter = event.target;
        var index = Array.prototype.indexOf.call(letter.parentNode.children, letter);

        if (letter.classList.contains("disabled")) return;

        if (letter.classList.contains("letter-button-selected")) {
            if (index === selectedIndexes[selectedIndexes.length - 1]) {
                deselectLetter(letter, index);
            }
        } else {
            selectLetter(letter, index);
        }

        updateUI();
    }

    function selectLetter(letter, index) {
        selectedWord += letter.textContent;
        selectedIndexes.push(index);
        letter.classList.add("letter-button-selected");
    }

    function deselectLetter(letter) {
        selectedWord = selectedWord.slice(0, -1);
        selectedIndexes.pop();
        letter.classList.remove("letter-button-selected");
    }

    function updateUI() {
        answerInput.value = selectedWord;
        updateLastSelectedLetter();
        updateEnabledLetters();
    }

    function updateLastSelectedLetter() {
        var buttons = document.querySelectorAll('.letter-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("letter-button-last-selected");
        }
        if (selectedIndexes.length > 0) {
            var lastSelectedIndex = selectedIndexes[selectedIndexes.length - 1];
            document.querySelectorAll('.letter-button')[lastSelectedIndex].classList.add("letter-button-last-selected");
        }
    }

    function updateEnabledLetters() {
        var letters = document.querySelectorAll('.letter-button');
        if (selectedIndexes.length === 0) {
            for (var i = 0; i < letters.length; i++) {
                letters[i].classList.remove("disabled");
            }
            return;
        }

        var lastIndex = selectedIndexes[selectedIndexes.length - 1];
        var row = Math.floor(lastIndex / 4);
        var col = lastIndex % 4;

        for (var i = 0; i < letters.length; i++) {
            var buttonRow = Math.floor(i / 4);
            var buttonCol = i % 4;

            var isAdjacent = Math.abs(buttonRow - row) <= 1 && Math.abs(buttonCol - col) <= 1;
            var isSelected = selectedIndexes.indexOf(i) !== -1;

            letters[i].classList.toggle("disabled", !isAdjacent && !isSelected);
        }
    }

    createBoard();

    /**
    * SECCION DE INGRESO NOMBRE DE USUARIO 
    * 
    */
    var playerName = localStorage.getItem('playerName') || 'Jugador';
    var playerNameSpan = document.querySelector('#player-name');
    var playerNameInput = document.querySelector('#input-player-name');

    playerNameInput.value = playerName;
    playerNameSpan.textContent = playerName;

    function handleInputPlayerNameChange() {
        var playerName = playerNameInput.value;
        localStorage.setItem('playerName', playerName);
        playerNameSpan.textContent = playerName;
    }

    playerNameInput.addEventListener('blur', handleInputPlayerNameChange);
    playerNameInput.addEventListener('change', handleInputPlayerNameChange);

    /**
    * SECCION DE TEMPORIZADOR 
    * 
    */
    var timerInterval;
    var timeLeft = getSelectedSetting('time'); 
    var timerRunning = false;

    function updateTimer() {
        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;
        var formattedTime =
            (minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds;

        document.querySelector('#timer-value').textContent = formattedTime;

        if (timeLeft === 0) {
            stopTimer();
            isGameStarted = false;
            saveGameScorage();
        } else {
            timeLeft--;
        }
    }

    function startTimer() {
        if (!timerRunning) {
            clearInterval(timerInterval);
            timeLeft = getSelectedSetting('time');
            updateTimer();
            timerInterval = setInterval(updateTimer, 1000);
            timerRunning = true;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerRunning = false;
        timeLeft = getSelectedSetting('time');
        updateTimer();
    }

    /**
    * SECCION DE EMPEZAR/DETENER EL JUEGO
    * 
    */
    var startGameButton = document.getElementById('start-game-btn');
    var stopGameButton = document.getElementById('stop-game-btn');
    var validateButton = document.getElementById('validate-button');
    var isGameStarted = false;

    function startNewGame() {
        if (isGameStarted) {
            stopGame();
        }
        isGameStarted = true;
        stopGameButton.style.visibility = 'visible';
        startTimer();
    }

    function stopGame() {
        stopGameButton.style.visibility = 'hidden';
        isGameStarted = false;
        stopTimer();
    }

    function stopGameAndSendData() {
        stopGame();
        saveGameScore();
    }

    function saveGameScore() {
        var puntuacion = document.getElementById('game-score').textContent;
        var listaContainer = document.querySelector('.list-container.scorers-list');
        var noScorerMessageContainer = document.querySelector('.no-scorers-message');

        var listItem = document.createElement('div');
        listItem.className = 'list-item';

        var playerNameSpan = document.createElement('span');
        playerNameSpan.className = 'player-name';
        playerNameSpan.textContent = playerName;
        listItem.appendChild(playerNameSpan);

        var playerScore = document.createElement('span');
        playerScore.className = 'player-score top-score';
        playerScore.textContent = puntuacion + ' pts';
        listItem.appendChild(playerScore);

        listaContainer.appendChild(listItem);

        noScorerMessageContainer.style.display = 'none';
        listaContainer.style.display = 'block';
    }

    function saveGameLetter() {
        if (isGameStarted) {
            var noWordMessageContainer = document.querySelector('.no-words-message');
            var listaContainer = document.querySelector('.list-container.words-list');
            var wordInput = document.getElementById('boggle-add-word');

            noWordMessageContainer.style.display = 'none';

            var listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.textContent = wordInput.value;

            listaContainer.style.display = 'block';
            listaContainer.appendChild(listItem);
        }
    }

    startGameButton.addEventListener('click', startNewGame);
    stopGameButton.addEventListener('click', stopGameAndSendData);
    validateButton.addEventListener('click', saveGameLetter);

    /**
    * SECCION DE SELECCIONAR CONFIGURACION DEL JUEGO
    * 
    */
    function getSelectedSetting(name) {
        var selectedRadio = document.querySelector('input[name="' + name + '"]:checked');
        return selectedRadio ? selectedRadio.value : null;
    }
    
    function setSelectedSetting(value, name) {
        var radioButton = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
        if (radioButton) {
            radioButton.click();
        }
    }
    
    document.querySelector('#time-option').addEventListener('change', function() {
        if (!isGameStarted) {
            timeLeft = getSelectedSetting('time');
            localStorage.setItem('timeSetting', timeLeft)
            updateTimer();
        }
    });
    
    document.querySelector('#sound-setting').addEventListener('change', function() {
        localStorage.setItem('soundSetting', getSelectedSetting('sound'))
    });
    
    setSelectedSetting(localStorage.getItem('timeSetting') || '120', 'time');
    setSelectedSetting(localStorage.getItem('soundSetting') || 'false', 'sound');
});