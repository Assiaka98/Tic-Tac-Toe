const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function handleClick(e){
  const index = e.target.dataset.index;
  if(board[index]!= "" ||!gameActive) return;
  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  checkWinner();
}

function checkWinner(){
  let won = false;
  for(let cond of winConditions){
    let [a,b,c] = cond;
    if(board[a] && board[a]==board[b] && board[a]==board[c]){ won=true; break; }
  }
  if(won){ statusText.textContent = `Le joueur ${currentPlayer} a gagné!`; gameActive=false; return; }
  if(!board.includes("")){ statusText.textContent = "Match nul!"; gameActive=false; return; }
  currentPlayer = currentPlayer=="X"? "O" : "X";
  statusText.textContent = `Au tour de ${currentPlayer}`;
}

function restart(){
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer="X"; gameActive=true;
  statusText.textContent=`Au tour de ${currentPlayer}`;
  cells.forEach(c=>c.textContent="");
}

cells.forEach(c=>c.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restart);