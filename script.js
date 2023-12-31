const image_folder = "images/";
const roomsData = [
    { name: 'Beach', image: `${image_folder}beach.jpg` },
    { name: 'Hospital', image: `${image_folder}hospital.jpg` },
    { name: 'School', image: `${image_folder}school.png` },
    { name: 'Space Station', image: `${image_folder}space.jpg` },
    { name: 'Bank', image: `${image_folder}bank.jpg` },
    { name: 'Circus', image: `${image_folder}circus.jpg` },
    { name: 'Cruise Ship', image: `${image_folder}ship.png` },
    { name: 'Abandoned House', image: `${image_folder}house.jpg` }
];

function displayRooms() {
    const roomsList = document.getElementById('rooms');
    roomsData.forEach(room => {
        const li = document.createElement('li');
        li.textContent = room.name;
        roomsList.appendChild(li);
    });
}

function addPlayer() {
    const playerNamesDiv = document.getElementById('playerNames');
    const numPlayers = playerNamesDiv.childElementCount / 3 + 1; // Increment based on current count

    const label = document.createElement('label');
    label.for = `player${numPlayers}`;
    label.textContent = `Player ${numPlayers}: `;
    playerNamesDiv.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `player${numPlayers}`;
    input.required = true;
    playerNamesDiv.appendChild(input);

    // Add line break for better spacing
    playerNamesDiv.appendChild(document.createElement('br'));
}

function removePlayer() {
    const playerNamesDiv = document.getElementById('playerNames');
    const numPlayers = playerNamesDiv.childElementCount / 3; // Calculate the current number of players

    if (numPlayers > 1) {
        // Remove the last player's label, input, and line break
        for (let i = 0; i < 3; i++) {
            playerNamesDiv.removeChild(playerNamesDiv.lastElementChild);
        }
    } else {
        alert("Cannot remove the last player.");
    }
}

function startGame() {
    const numSpiesInput = document.getElementById('numSpies');
    const numSpies = parseInt(numSpiesInput.value, 10);

    const playerNamesDiv = document.getElementById('playerNames');
    const numPlayers = playerNamesDiv.childElementCount / 3;

    if (numPlayers >= 3 && numSpies >= 1 && numSpies < numPlayers) {
        // Check that all player names are unique and contain at least one character
        const playerNames = [];
        let allValid = true;

        for (let i = 1; i <= numPlayers; i++) {
            const playerNameInput = document.getElementById(`player${i}`);
            const playerName = playerNameInput.value.trim();

            if (playerName.length === 0) {
                alert(`Player ${i} must have at least one character.`);
                allValid = false;
                break;
            }

            if (playerNames.includes(playerName)) {
                alert(`Player names must be unique. Player ${i} has the same name as another player.`);
                allValid = false;
                break;
            }

            playerNames.push(playerName);
        }

        if (allValid) {
            // Save the player names and number of spies to local storage
            localStorage.setItem('playerNames', JSON.stringify(playerNames));
            localStorage.setItem('numSpies', numSpies);

            // Continue with the game start logic
            const roomListDiv = document.getElementById('roomList');
            const gameBoardDiv = document.getElementById('gameBoard');
            const startGameButton = document.getElementById('startGame');

            // Hide player input and display game board
            document.getElementById('startPage').style.display = 'none';
            roomListDiv.style.display = 'block';
            gameBoardDiv.style.display = 'none'; // Display game board when the game starts

            // Add your logic to start the game here
            // For example, you can randomly select a room and display it
            const randomRoomIndex = Math.floor(Math.random() * roomsData.length);
            const selectedRoom = roomsData[randomRoomIndex];

            const gameBoard = document.getElementById('gameBoard');

            // Clear the game board content
            gameBoard.innerHTML = "";

            const roomImage = document.createElement('img');
            roomImage.src = selectedRoom.image;
            roomImage.alt = selectedRoom.name;
            roomImage.classList.add('game-image');
            gameBoard.appendChild(roomImage);

            gameBoard.innerHTML += `<p>Game Started! ${selectedRoom.name}</p>`;

            // Show the "Show Game" button
            const showGameButton = document.getElementById('showGame');
            showGameButton.style.display = 'block';

            // Hide the "Start Game" button
            startGameButton.style.display = 'none';

            // Save the selected room index to local storage
            localStorage.setItem('selectedRoomIndex', randomRoomIndex);
        }
    } else {
        alert("Please enter valid settings to start the game.");
    }
}

function pickRandomPlayer() {
    // Retrieve player names from local storage
    const playerNamesJSON = localStorage.getItem('playerNames');
    
    if (playerNamesJSON) {
        // Parse the JSON string to get the array of player names
        const playerNames = JSON.parse(playerNamesJSON);
        
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * playerNames.length);
        
        // Return the randomly selected player
        return playerNames[randomIndex];
    } else {
        console.error("Player names not found in local storage.");
        return null;
    }
}

function showGame() {
    const randomPlayer = pickRandomPlayer();
    localStorage.setItem('spyPlayer', randomPlayer);

    const roomListDiv = document.getElementById('roomList');
    const gameBoardDiv = document.getElementById('gameBoard');
    const showGameButton = document.getElementById('showGame');

    // Hide room list and display game board
    roomListDiv.style.display = 'none';
    gameBoardDiv.style.display = 'block';

    // Get the spy's name and the selected room
    const spyName = document.getElementById(`player${spyIndex}`).value;
    const selectedRoomIndex = parseInt(localStorage.getItem('selectedRoomIndex'), 10);
    const selectedRoom = roomsData[selectedRoomIndex];

    const gameBoard = document.getElementById('gameBoard');

    // Clear the game board content
    gameBoard.innerHTML = "";

    const roomImage = document.createElement('img');
    roomImage.src = selectedRoom.image;
    roomImage.alt = selectedRoom.name;
    roomImage.classList.add('game-image');
    gameBoard.appendChild(roomImage);

    // Display information based on whether the player is the spy or not
    if (spyIndex === 1) {
        gameBoard.innerHTML += `<p>You are the spy!</p>`;
    } else {
        gameBoard.innerHTML += `<p>${spyName} is the spy! Guess the location!</p>`;
    }

    // Show the "Show" button
    const showButton = document.getElementById('show');
    showButton.style.display = 'block';

    // Hide the "Show Game" button
    showGameButton.style.display = 'none';
}

function showLocation() {
    const selectedRoomIndex = parseInt(localStorage.getItem('selectedRoomIndex'), 10);

    const roomListDiv = document.getElementById('roomList');
    const gameBoardDiv = document.getElementById('gameBoard');

    // Hide room list and display game board
    roomListDiv.style.display = 'none';
    gameBoardDiv.style.display = 'block';

    const selectedRoom = roomsData[selectedRoomIndex];

    const gameBoard = document.getElementById('gameBoard');

    // Clear the game board content
    gameBoard.innerHTML = "";

    const roomImage = document.createElement('img');
    roomImage.src = selectedRoom.image;
    roomImage.alt = selectedRoom.name;
    roomImage.classList.add('game-image');
    gameBoard.appendChild(roomImage);

    gameBoard.innerHTML += `<p>The location is: ${selectedRoom.name}</p>`;
}

function resetGame() {
    const startPageDiv = document.getElementById('startPage');
    const roomListDiv = document.getElementById('roomList');
    const gameBoardDiv = document.getElementById('gameBoard');

    // Show the start page and hide the other sections
    startPageDiv.style.display = 'block';
    roomListDiv.style.display = 'none';
    gameBoardDiv.style.display = 'none';

    // Clear local storage
    localStorage.removeItem('playerNames');
    localStorage.removeItem('numSpies');
    localStorage.removeItem('selectedRoomIndex');
    localStorage.removeItem('spyIndex');
}


document.addEventListener('DOMContentLoaded', displayRooms);
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('resetGame').addEventListener('click', resetGame);
document.getElementById('addPlayer').addEventListener('click', addPlayer);
document.getElementById('removePlayer').addEventListener('click', removePlayer);
document.getElementById('showGame').addEventListener('click', showGame);
document.getElementById('show').addEventListener('click', showLocation);
