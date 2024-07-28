'use strict';

document.addEventListener('DOMContentLoaded', function () {
    /**
    * MENU RESPONSIVE
    * 
    */
    var menuIcon = document.querySelector('#menu-icon');
    var navbarLinks = document.querySelector('.navbar-links');
    menuIcon.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');
    });

    /**
    * SECCION DE TABLERO 
    * 
    */
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
        var lastIndex = selectedIndexes[selectedIndexes.length - 1];
    
        if (lastIndex === undefined) {
            letters.forEach(letter => letter.classList.remove('disabled'));
            return;
        }
    
        updateSelectableLetters(lastIndex, letters);
    }

    function updateSelectableLetters(lastIndex, letters) {
        var row = Math.floor(lastIndex / 4);
        var col = lastIndex % 4;
    
        letters.forEach(function(letter, i) {
            var buttonRow = Math.floor(i / 4);
            var buttonCol = i % 4;
            var isAdjacent = Math.abs(buttonRow - row) <= 1 && Math.abs(buttonCol - col) <= 1;
            var isSelected = selectedIndexes.indexOf(i) !== -1;
    
            letter.classList.toggle('disabled', !isAdjacent && !isSelected);
        });
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

        if (timeLeft === 10) {
            lowTimeAlert();
        }

        if (timeLeft === 0) {
            isGameStarted = false;
            stopTimer();
            stopGameAndSendData();
        } else {
            timeLeft--;
        }
    }

    function lowTimeAlert() {
        var timerElement = document.querySelector('.timer-value');
        timerElement.style.color = '#ff7675';

        var isSoundEnabled = getSelectedSetting('sound');
        if (isSoundEnabled === 'true') {
            var alertSound = document.getElementById('alertSound');
            alertSound.play();
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
        if (event.target === modal) {
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
    var noWordMessageContainer = document.querySelector('.no-words-message');

    function startNewGame() {
        isGameStarted = true;
        prepareGameInterface();
        startTimer();
    }

    function prepareGameInterface() {
        stopGameButton.style.visibility = 'visible';
        validateButton.disabled = false;
        validateButton.classList.remove('button-disabled');
        startGameButton.classList.add('button-disabled');
        var buttons = document.querySelectorAll('.letter-button');
        buttons.forEach((button) => {
            button.classList.remove('button-disabled');
        });
    }

    function clearBoard() {
        var board = document.querySelector('.board');
        if (board) {
            board.remove();
        }
    }

    function stopGameAndSendData() {
        showErrorModal('Se termino el tiempo!');
        isGameStarted = false;
      
        resetGameInterface();
        saveGameScore();
        clearBoard();
        createBoard();
        initializeBoardState();
        stopTimer();
    }

    function resetGameInterface() {
        stopGameButton.style.visibility = 'hidden';
        noWordMessageContainer.style.display = 'block';
        startGameButton.classList.remove('button-disabled');
        document.querySelector('.timer-value').style.color = '#000000';
    }

    function clearGameBoard() {
        clearBoardSelection();
        wordInput.value = '';
        selectedWord = '';
        selectedIndexes = [];
        updateUI();
    }

    startGameButton.addEventListener('click', startNewGame);
    stopGameButton.addEventListener('click', stopGameAndSendData);
    validateButton.addEventListener('click', saveGameLetter);

    /**
    * SECCION DE VALIDAR/AGREGAR PALABRAS
    * 
    */
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
        if (!isGameStarted) return;
    
        var word = wordInput.value;
        var wordLength = word.length;
    
        if (wordLength < 3) {
            showErrorModal('No se aceptan palabras con menos de tres letras');
            clearBoardSelection();
            return;
        }
    
        var existingWords = Array.prototype.map.call(wordListContainer.querySelectorAll('.words-span'), function(item) {
            return item.textContent;
        });
    
        if (existingWords.indexOf(word) !== -1) {
            showErrorModal('Esta palabra ya fue utilizada');
            clearBoardSelection();
            return;
        }
    
        var isValid = await validateWord(word);
        var points = isValid ? calculatePoints(wordLength) : -1;
    
        toggleMessageFeedbackVisibility(isValid ? 'success' : 'error');
    
        var currentScore = parseInt(gameScoreElement.textContent, 10) + points;
        gameScoreElement.textContent = currentScore;
    
        if(isValid) {
            appendWordAndPointsToList(word, points);
        }
    
        clearGameBoard(); 
    }

    function appendWordAndPointsToList(word, points) {
        noWordMessageContainer.style.display = 'none';
        wordListContainer.style.display = 'block';
    
        var listItem = document.createElement('div');
        listItem.className = 'list-item list-word';
    
        var wordSpan = document.createElement('span');
        wordSpan.className = 'words-span';
        wordSpan.textContent = word;
        listItem.appendChild(wordSpan);
    
        var pointSpan = document.createElement('span');
        pointSpan.className = 'point-span';
        pointSpan.textContent = points + ' pts';
        listItem.appendChild(pointSpan);
    
        wordListContainer.appendChild(listItem);
    }

    function toggleMessageFeedbackVisibility(messageType) {
        var messageContainer = document.querySelector('.feedback-message-container');
        
        clearTimeout(messageContainer.timeoutId);
      
        var bgColor = messageType === 'success' ? '#20c997' : '#ff7675';
        var messageText = messageType === 'success' ? 'Palabra correcta' : 'Palabra incorrecta';
        messageContainer.style.backgroundColor = bgColor;
        messageContainer.textContent = messageText;
      
        messageContainer.style.visibility = 'visible';

        messageContainer.timeoutId = setTimeout(() => {
            messageContainer.style.visibility = 'hidden';
        }, 3000);  
    }

    async function validateWord(word) {
        var response = await fetch(
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

    /**
    * SECCION DE PUNTAJES
    * 
    */
    var savedGameScores = JSON.parse(localStorage.getItem('gameScorages')) || [];
    if (savedGameScores) {
        setSelectedSetting(localStorage.getItem('tableSortSetting') || 'point', 'sorted-table');
        updateTableGameScores();
    }

    document.querySelector('#sort-table-setting').addEventListener('change', function () {
        localStorage.setItem('tableSortSetting', getSelectedSetting('sorted-table'));
        updateTableGameScores();
    });

    function updateTableGameScores() {
        if (!savedGameScores) return;

        sortGameScoresByPreference();

        var listContainer = document.getElementById('scorers-list');
        listContainer.innerHTML = '';

        for (var i = 0; i < savedGameScores.length; i++) {
            addElementToGameScoreTable(savedGameScores[i]);
        }
    }

    function sortGameScoresByPreference() {
        var tableSortSetting = localStorage.getItem('tableSortSetting') || 'score';

        savedGameScores.sort(function (a, b) {
            if (tableSortSetting === 'name') return a.name.localeCompare(b.name);
            if (tableSortSetting === 'date') return new Date(b.date) - new Date(a.date);
            return b.score - a.score;
        });
    }

    function addElementToGameScoreTable(scoreEntry) {
        var scorerListContainer = document.querySelector('.list-container.scorers-list');
        var noScorerMessageContainer = document.querySelector('.no-scorers-message');
        var listItem = document.createElement('div');
        var playerNameSpan = document.createElement('span');
        var playerDateSpan = document.createElement('span');
        var playerScoreSpan = document.createElement('span');  
    
        listItem.classList.add('list-item');
        playerNameSpan.classList.add('player-name');
        playerDateSpan.classList.add('player-date');
        playerScoreSpan.classList.add('player-score');
    
        playerNameSpan.textContent = scoreEntry.name;
        playerDateSpan.textContent = formatDate(scoreEntry.date);
        playerScoreSpan.textContent = `${scoreEntry.score} pts`; 
    
        listItem.append(playerNameSpan, playerDateSpan, playerScoreSpan); 
        scorerListContainer.appendChild(listItem);
    
        noScorerMessageContainer.style.display = 'none';
        scorerListContainer.style.display = 'block';
    }

    function formatDate(dateISO) {
        var date = new Date(dateISO);

        var day = date.getDate().toString().padStart(2, '0');
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var year = date.getFullYear();
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    }


    function saveGameScore() {
        var points = document.getElementById('game-score').textContent;
        if (points < 0) {
            points = 0;
        }

        var storeGameResult = {
            name: playerNameSpan.textContent,
            score: points,
            date: new Date()
        };

        savedGameScores.push(storeGameResult);

        localStorage.setItem('gameScorages', JSON.stringify(savedGameScores));
        updateTableGameScores();
    }

    
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
        playerName = playerNameInput.value; 
        
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