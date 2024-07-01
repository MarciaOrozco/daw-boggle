'use strict';

document.addEventListener('DOMContentLoaded', function () {
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
    var answerInput = document.querySelector('#boggle-add-word');
    var selectedWord = '';
    var selectedIndexes = [];
    var validateButton = document.getElementById('validate-button');
    var wordListContainer = document.querySelector('.list-container.words-list');
    var gameScoreElement = document.getElementById('game-score');
    var wordInput = document.getElementById('boggle-add-word');

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

        if (letter.classList.contains('disabled')) return;

        if (letter.classList.contains('letter-button-selected')) {
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
        letter.classList.add('letter-button-selected');
    }

    function deselectLetter(letter) {
        selectedWord = selectedWord.slice(0, -1);
        selectedIndexes.pop();
        letter.classList.remove('letter-button-selected');
    }

    function updateUI() {
        answerInput.value = selectedWord;
        updateLastSelectedLetter();
        updateEnabledLetters();
    }

    function updateLastSelectedLetter() {
        var buttons = document.querySelectorAll('.letter-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('letter-button-last-selected');
        }
        if (selectedIndexes.length > 0) {
            var lastSelectedIndex = selectedIndexes[selectedIndexes.length - 1];
            document.querySelectorAll('.letter-button')[lastSelectedIndex].classList.add('letter-button-last-selected');
        }
    }

    function updateEnabledLetters() {
        var letters = document.querySelectorAll('.letter-button');
        if (selectedIndexes.length === 0) {
            for (var i = 0; i < letters.length; i++) {
                letters[i].classList.remove('disabled');
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

            letters[i].classList.toggle('disabled', !isAdjacent && !isSelected);
        }
    }

    function initializeBoardState() {
        var buttons = document.querySelectorAll('.letter-button');
        buttons.forEach((button) => {
          button.classList.add('button-disabled');
          button.classList.remove('letter-button-selected');
          button.classList.remove('letter-button-last-selected');
        });
        validateButton.disabled = true;
        validateButton.classList.add('button-disabled');
        wordInput.value = '';
        selectedWord = '';
        selectedIndexes = [];
        wordListContainer.innerHTML = '';
        gameScoreElement.textContent = 0;
      }

    createBoard();
    initializeBoardState();

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
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds;
    
        document.querySelector('#timer-value').textContent = formattedTime;
    
        if (timeLeft === 0) {
            stopTimer();
            isGameStarted = false;
            stopGameAndSendData();
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
    * MODAL
    * 
    */

    var modal = document.getElementById('error-modal');
    var span = document.getElementsByClassName('close')[0];
    var modalMessage = document.getElementById('modal-message');


    function showErrorModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
    }
}

    /**
    * SECCION DE EMPEZAR/DETENER EL JUEGO
    * 
    */
    var startGameButton = document.getElementById('start-game-btn');
    var stopGameButton = document.getElementById('stop-game-btn');
    var isGameStarted = false;

    function startNewGame() {
        if (isGameStarted) {
            stopGame();
        }
        isGameStarted = true;
        stopGameButton.style.visibility = 'visible';
        validateButton.disabled = false;
        validateButton.classList.remove('button-disabled');
        startGameButton.classList.add('button-disabled');
        var buttons = document.querySelectorAll('.letter-button');
        buttons.forEach((button) => {
        button.classList.remove('button-disabled');
        });
        startTimer();
    }

    function stopGame() {
        stopGameButton.style.visibility = 'hidden';
        isGameStarted = false;
        initializeBoardState();
        stopTimer();
    }

    function clearBoard() {
        var board = document.querySelector('.board');
        if (board) {
            board.remove();
        }
    }

    function saveGameScore() {
        var puntuacion = document.getElementById('game-score').textContent;
        if (puntuacion < 0) {
            puntuacion = 0;
        }
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

    function stopGameAndSendData() {
        stopGameButton.style.visibility = 'hidden';
        isGameStarted = false;
        startGameButton.classList.remove('button-disabled');
        saveGameScore();
        clearBoard();
        createBoard();
        initializeBoardState();
        stopTimer();
    }

    function calculatePoints(wordLength) {
        if (wordLength === 3 || wordLength === 4) {
            return 3;
        } else if (wordLength === 5) {
            return 4;
        } else if (wordLength === 6) {
            return 5;
        } else if (wordLength === 7) {
            return 6;
        } else if (wordLength >= 8) {
            return 11;
        }
        return 0;
    }

    async function saveGameLetter() {
        if (isGameStarted) {
            var noWordMessageContainer = document.querySelector('.no-words-message');
            var listaContainer = document.querySelector('.list-container.words-list');
            var word = wordInput.value;

            if (word.length < 3) {
                showErrorModal('No se aceptan palabras con menos de tres letras');
                clearBoardSelection();
                return;
            }

            var existingWords = Array.from(listaContainer.querySelectorAll('.list-item')).map(item => item.textContent);
            if (existingWords.includes(word)) {
                showErrorModal('Esta palabra ya fue encontrada');
                clearBoardSelection();
                return;
            }

            if (word) {
                var isValid = await validateWord(word);
                if (isValid) {
                    noWordMessageContainer.style.display = 'none';  
                var listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.textContent = word;
        
                listaContainer.style.display = 'block';
                listaContainer.appendChild(listItem);
                
                var currentScore = parseInt(gameScoreElement.textContent, 10);

                var points = calculatePoints(word.length);
                gameScoreElement.textContent = currentScore + points;
          
                clearBoardSelection();
    
                wordInput.value = '';
                selectedWord = '';
                selectedIndexes = [];
                updateUI();
                } else {
                    var currentScore = parseInt(gameScoreElement.textContent, 10);
                    gameScoreElement.textContent = currentScore - 1;
                    clearBoardSelection();
                }
              } 
        }
    }

    async function validateWord(word) {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        return response.ok;
      }
    
      function clearBoardSelection() {
        var letters = document.querySelectorAll('.letter-button');
        letters.forEach((letter) => {
          letter.classList.remove('letter-button-selected');
          letter.classList.remove('letter-button-last-selected');
          letter.classList.remove('disabled');
        });
        selectedWord = '';
        selectedIndexes = [];
        updateUI();
      }

    startGameButton.addEventListener('click', startNewGame);
    stopGameButton.addEventListener('click', stopGameAndSendData);
    validateButton.addEventListener('click', saveGameLetter);

    
    /**
    * SECCION DE INGRESO NOMBRE DE USUARIO 
    * 
    */
    var playerName = localStorage.getItem('playerName') || 'Jugador';
    var playerNameSpan = document.querySelector('#player-name');
    var playerNameInput = document.querySelector('#input-player-name');
    var nameError = document.querySelector('#name-error');

    playerNameInput.value = playerName;
    playerNameSpan.textContent = playerName;

    function handleInputPlayerNameChange() {
        var playerName = playerNameInput.value; 
        
        if (playerName.length == 0) {
            nameError.textContent = 'Debes completar con tu nombre para comenzar la partida.'; 
            nameError.style.display = 'block';
            startGameButton.classList.add('button-disabled');
            return;
        }
        
        if (playerName.length < 3) {
            nameError.textContent = 'El nombre debe tener al menos 3 caracteres.'; 
            nameError.style.display = 'block';
            startGameButton.classList.add('button-disabled');
            return;
        }

        startGameButton.classList.remove('button-disabled');
        nameError.style.display = 'none';
        localStorage.setItem('playerName', playerName);
        playerNameSpan.textContent = playerName;

        //detectar que esta escribiendo 
    }

    playerNameInput.addEventListener('blur', handleInputPlayerNameChange);
    playerNameInput.addEventListener('change', handleInputPlayerNameChange);
    playerNameInput.addEventListener('keydown', handleInputPlayerNameChange);

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