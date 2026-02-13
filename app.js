const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 15;
const tiles = canvas.width / size;

let snake;
let food;
let dir;
let loop;
let running = false;
let score = 0;

const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");

function resetGame(){
  snake = [{x:10,y:10}];
  dir = {x:0,y:0};
  food = randomFood();
  score = 0;
  scoreEl.textContent = score;
  statusEl.textContent = "Listo";
  draw();
}

function randomFood(){
  return {
    x: Math.floor(Math.random()*tiles),
    y: Math.floor(Math.random()*tiles)
  };
}

function start(){
  if(running) return;
  running = true;
  statusEl.textContent = "Jugando";
  loop = setInterval(update,120);
}

function pause(){
  running = false;
  clearInterval(loop);
  statusEl.textContent = "Pausado";
}

function update(){
  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  if(dir.x === 0 && dir.y === 0){
    draw();
    return;
  }

  if(
    head.x < 0 || head.y < 0 ||
    head.x >= tiles || head.y >= tiles ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ){
    pause();
    statusEl.textContent = "Game Over";
    return;
  }

  snake.unshift(head);

  if(head.x === food.x && head.y === food.y){
    food = randomFood();
    score++;
    scoreEl.textContent = score;
  }else{
    snake.pop();
  }

  draw();
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="red";
  ctx.fillRect(food.x*size,food.y*size,size,size);

  ctx.fillStyle="#2cff7a";
  snake.forEach(p=>{
    ctx.fillRect(p.x*size,p.y*size,size,size);
  });
}

function setDir(d){
  if(d==="up" && dir.y===0) dir={x:0,y:-1};
  if(d==="down" && dir.y===0) dir={x:0,y:1};
  if(d==="left" && dir.x===0) dir={x:-1,y:0};
  if(d==="right" && dir.x===0) dir={x:1,y:0};
}

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp") setDir("up");
  if(e.key==="ArrowDown") setDir("down");
  if(e.key==="ArrowLeft") setDir("left");
  if(e.key==="ArrowRight") setDir("right");
});

document.querySelectorAll(".mobile-controls button")
.forEach(b=>{
  b.addEventListener("click",()=>{
    setDir(b.dataset.dir);
  });
});

document.getElementById("startBtn").onclick=start;
document.getElementById("pauseBtn").onclick=pause;
document.getElementById("resetBtn").onclick=()=>{
  pause();
  resetGame();
};

resetGame();
