var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var score = 0;// 分數
var ctxColor = "#0095DD";// 顏色
var lives = 3;// 生命值

//球相關
var ballRadius = 10;// 球半徑
var x = canvas.width/2;// 球x座標
var y = canvas.height-30;// 球y座標
var dx = 2;// 球x移動量
var dy = -2;// 球y移動量

//球拍相關
var paddleHeight = 10;// 球拍高
var paddleWidth = 75;// 球拍寬
var paddleX = (canvas.width-paddleWidth)/2;// 球拍x位置
var paddleDX = 7;// 球拍偏移量
var rightPressed = false;// 球拍是否能往右
var leftPressed = false;// 球拍是否能往左

//磚塊相關
var brickRowCount = 5;// 磚塊列數
var brickColumnCount = 3;// 磚塊行數
var brickWidth = 75;// 磚塊寬
var brickHeight = 20;// 磚塊高
var brickPadding = 10;// 磚塊填充範圍
var brickOffsetTop = 30;// 磚塊頂部偏移量
var brickOffsetLeft = 30;// 磚塊底部偏移量
var bricks = [];//磚塊array
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//事件監聽器
document.addEventListener("keydown", keyDownHandler, false);//按下按鍵
document.addEventListener("keyup", keyUpHandler, false);//放開按鍵
document.addEventListener("mousemove",mouseMoveHander,false);//滑鼠監聽器

///事件監聽器的function
//按下按鍵
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
//放開按鍵
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
//鼠標移動
function mouseMoveHander(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }

}

//碰撞偵測
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          //若分數為磚塊的總數
          if(score == brickRowCount*brickColumnCount) {
            alert("您獲勝了，恭喜。");
            document.location.reload();
            clearInterval(interval); 
          }
        }
      }
    }
  }
}
//重啟遊戲(未結束)
function newGame(){
    lives--;
    if(!lives){
        alert(`遊戲結束`);
        document.location.reload;
        clearInterval(interval);
    }else{
        //重置
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
    }
}

// 繪製球
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ctxColor;
  ctx.fill();
  ctx.closePath();
}

// 繪製球拍
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = ctxColor;
  ctx.fill();
  ctx.closePath();
}

// 繪製磚塊
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = ctxColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 繪製分數
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = ctxColor;
  ctx.fillText("破壞磚塊數: "+score, 8, 20);
}

// 繪製生命值
function drawLive() {
    ctx.font = "16px Arial";
    ctx.fillStyle = ctxColor;
    ctx.fillText("生命: "+lives, canvas.width-65, 20);
  }

// 執行畫布繪製
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLive();
  collisionDetection();

  // 左右牆碰撞反彈
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // 上牆碰撞反彈 else if 下牆反彈相關
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) {
    // 球落在球拍內 else 球落在球拍外
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
        newGame();
    }
  }

  //球拍每次移動偏移
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += paddleDX;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= paddleDX;
  }
  x += dx;
  y += dy;
  //再次調用
  requestAnimationFrame(draw);
}

//開始進行繪製
draw();