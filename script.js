const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
}

function handleClick(event) {
    const index = event.target.dataset.index;

    if (gameState[index] || currentPlayer === 'O' || checkWinner()) return;

    gameState[index] = currentPlayer;
    event.target.classList.add(currentPlayer.toLowerCase());
    event.target.textContent = currentPlayer;

    if (checkWinner()) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 100);
        return;
    }

    currentPlayer = 'O';
    setTimeout(computerPlay, 500); // Add delay to simulate thinking
}

function computerPlay() {
    let move = bestMove();
    gameState[move] = 'O';
    document.querySelector(`.cell[data-index='${move}']`).classList.add('o');
    document.querySelector(`.cell[data-index='${move}']`).textContent = 'O';

    if (checkWinner()) {
        setTimeout(() => alert('O wins!'), 100);
        return;
    }

    currentPlayer = 'X';
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    const winner = checkGameState(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(cell => cell !== '')) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkGameState(board) {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return '';
}

function checkWinner() {
    return checkGameState(gameState);
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
    });
}

resetButton.addEventListener('click', resetGame);

createBoard();
