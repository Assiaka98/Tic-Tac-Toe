const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const resetScoreBtn = document.getElementById('reset-score');
const modePvpBtn = document.getElementById('mode-pvp');
const modeCpuBtn = document.getElementById('mode-cpu');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp"; // pvp ou cpu
let scores = { X: 0, O: 0, draw: 0 };

const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function handleClick(e){
  const index = e.target.dataset.index;
  if(board[index]!= "" ||!gameActive) return;
  // En mode vs Ordi, tu es toujours X, tu ne peux pas jouer quand c'est au tour de O
  if(gameMode === "cpu" && currentPlayer === "O") return;

  makeMove(index, currentPlayer);
}

function makeMove(index, player){
  board[index] = player;
  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());

  if(checkWinner()){
    return;
  }

  // Changement de joueur
  currentPlayer = currentPlayer === "X"? "O" : "X";
  statusText.textContent = `Au tour de ${currentPlayer}`;

  // Si vs Ordi et c'est à O de jouer
  if(gameMode === "cpu" && currentPlayer === "O" && gameActive){
    statusText.textContent = "L'ordi réfléchit...";
    setTimeout(cpuMove, 600);
  }
}

function cpuMove(){
  // IA simple: 1. essaie de gagner 2. essaie de bloquer 3. joue au hasard
  let move = findBestMove();
  makeMove(move, "O");
}

function findBestMove(){
  let empty = board.map((v,i) => v === ""? i : null).filter(v => v!== null);

  // Peut-il gagner?
  for(let i of empty){
    board[i] = "O";
    if(isWinning("O")){ board[i] = ""; return i; }
    board[i] = "";
  }
  // Doit-il bloquer X?
  for(let i of empty){
    board[i] = "X";
    if(isWinning("X")){ board[i] = ""; return i; }
    board[i] = "";
  }
  // Sinon hasard
  return empty[Math.floor(Math.random() * empty.length)];
}

function isWinning(player){
  return winConditions.some(([a,b,c]) => board[a]===player && board[b]===player && board[c]===player);
}

function checkWinner(){
  for(let [a,b,c] of winConditions){
    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      // On colore les 3 cases gagnantes
      document.querySelector(`[data-index="${a}"]`).classList.add('winner');
      document.querySelector(`[data-index="${b}"]`).classList.add('winner');
      document.querySelector(`[data-index="${c}"]`).classList.add('winner');

      statusText.textContent = `Le joueur ${board[a]} a gagné! 🎉`;
      scores[board[a]]++;
      updateScores();
      gameActive = false;
      return true;
    }
  }
  if(!board.includes("")){
    statusText.textContent = "Match nul! 🤝";
    scores.draw++;
    updateScores();
    gameActive = false;
    return true;
  }
  return false;
}

function updateScores(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.draw;
}

function restart(){
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Au tour de ${currentPlayer}`;
  cells.forEach(c => { c.textContent=""; c.className="cell"; });
}

function resetScores(){
  scores = { X: 0, O: 0, draw: 0 };
  updateScores();
  restart();
}

// Listeners
cells.forEach(c => c.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restart);
resetScoreBtn.addEventListener('click', resetScores);

modePvpBtn.addEventListener('click', () => {
  gameMode = "pvp";
  modePvpBtn.classList.add('active');
  modeCpuBtn.classList.remove('active');
  restart();
});
modeCpuBtn.addEventListener('click', () => {
  gameMode = "cpu";
  modeCpuBtn.classList.add('active');
  modePvpBtn.classList.remove('active');
  restart();
});