
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const winImg = document.getElementById('winimg');
const winOverlay = document.getElementById('winOverlay');
const winClose = document.getElementById('winClose');

let board = Array(9).fill('');
let currentTurn = 'X';
let gameActive = true;

const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function paint(){
    boardEl.innerHTML = '';
    board.forEach((mark, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.id = i;
        cell.textContent = mark;
        cell.addEventListener('click', onCellClick);
        boardEl.appendChild(cell);
    });
    statusEl.textContent = `Player ${currentTurn}'s turn`;
}

function onCellClick(e){
    if(!gameActive) return;
    const i = Number(e.currentTarget.dataset.id);
    if(board[i]) return;
    board[i] = currentTurn;
    paint();
    checkResult();
}

function checkResult(){
    for(const [a,b,c] of wins){
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            gameActive = false;
            statusEl.textContent = `Player ${board[a]} wins!`;
            showWinImage();
            return;
        }
    }
    if(board.every(Boolean)){
        gameActive = false;
        statusEl.textContent = `It's a tie!`;
        return;
    }
    // switch turn
    currentTurn = currentTurn === 'X' ? 'O' : 'X';
    statusEl.textContent = `Player ${currentTurn}'s turn`;
}

async function showWinImage(){
    if(!winImg || !winOverlay) return;
    try{
        const res = await fetch('https://api.waifu.pics/sfw/waifu');
        if(!res.ok) throw new Error('network');
        const data = await res.json();
        winImg.src = data.url;
        winOverlay.classList.add('show');
        winOverlay.setAttribute('aria-hidden', 'false');
    }catch(err){
        console.warn('Could not fetch win image', err);
        winOverlay.classList.remove('show');
        winOverlay.setAttribute('aria-hidden', 'true');
    }
}

function hideOverlay(){
    if(!winOverlay) return;
    winOverlay.classList.remove('show');
    winOverlay.setAttribute('aria-hidden', 'true');
    if(winImg) winImg.src = '';
}

// allow clicking the dimmed backdrop to close overlay
if(winOverlay){
    winOverlay.addEventListener('click', (e) => {
        if(e.target === winOverlay) hideOverlay();
    });
}

// close button inside overlay
if(winClose){
    winClose.addEventListener('click', (e) => { e.stopPropagation(); hideOverlay(); });
}

// dismiss overlay with Escape key
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') hideOverlay();
});

function resetGame(){
    board = Array(9).fill('');
    currentTurn = 'X';
    gameActive = true;
    if(winImg){ winImg.src = ''; }
    if(winOverlay){ hideOverlay(); }
    statusEl.textContent = `Player ${currentTurn}'s turn`;
    paint();
}

resetBtn.addEventListener('click', resetGame);

paint();