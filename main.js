var context = document.getElementById("canvas").getContext("2d");
var context2 = document.getElementById("canvas2").getContext("2d");

var startImg = new Image();
startImg.src = "images/start.png";

var ball = new Image();
ball.src = "images/ball.png";

var ballPosition = [];
var holePosition = [];
var boundariesPosition = [];
var sandPosition = [];
var waterPosition = [];
var wallPosition = [];
var arraySize1 = 2;
var arraySize2 = 4;

for (var x = 0; x<=4; x++){
    ballPosition[x]= new Array(arraySize1);
    holePosition[x]= new Array(arraySize1);
}

for (var x = 0; x<=4; x++){
    boundariesPosition[x]= new Array(arraySize2);
    wallPosition[x]= new Array(arraySize2);
}

//Levels coord     =      1               2                3                 4
ballPosition       = [[130,200]      ,[80,200]        ,[60,205]         ,[100,300]       ];
holePosition       = [[270,200]      ,[300,280]       ,[315,180]        ,[300,300]       ];
boundariesPosition = [[80,80,80,80]  ,[50,50,50,50]   ,[50,50,50,50]    ,[50,50,50,50]   ];
wallPosition       = [  //for each level
  //each wall
  [
    //position of individual wall - wall details
  [180,180,40,40], [180, 80, 30, 60], [180, 280, 30, 60], [220, 215, 50, 5], [270, 185, 50, 5]
  ],
  [[180,300,80,100], [70, 235, 210, 15], [120, 90, 15, 160], [280, 90, 15, 120], [295, 150, 30, 15], [320, 190, 30, 15], [180, 130, 80, 15], [70, 275, 15, 15], [70, 305, 15,15]
  ],
  [[80,80,20,20], [80,120,20,20], [80,160,20,20], [80,200,20,20], [80,240,20,20], [80,280,20,20], [80,320,20,20], [120,60,20,20], [120,100,20,20], [120,140,20,20], [120,180,20,20], [120,220,20,20], [120,260,20,20], [120,300,20,20], [120,340,20,20], [160,80,20,20], [160,120,20,20], [160,160,20,20], [160,200,20,20], [160,240,20,20], [160,280,20,20], [160,320,20,20], [200,60,20,20], [200,100,20,20], [200,140,20,20], [200,180,20,20], [200,220,20,20], [200,260,20,20], [200,300,20,20],[240,80,20,20], [240,120,20,20], [240,160,20,20], [240,200,20,20], [240,240,20,20], [240,280,20,20], [240,320,20,20], [280,60,20,20], [280,100,20,20], [280,140,20,20], [280,180,20,20], [280,220,20,20], [280,260,20,20], [280,300,20,20], [280,340,20,20]
  ],
  [[180,200,40,200], [100, 250, 100, 20], [50, 200, 75, 20], [200, 250, 75, 20], [250, 200, 75, 20]
  ]
];
// var wallX, wallY, width, height;
var level = 0;
var lastLevel = 5;

var ballInitialX, ballInitialY;
var ballWidth = 10;
var ballHeight = 10;

var strike = 0;

var ballStartX, ballStartY;
var ballNewPosX, ballNewPosY;

var mousePosX, mousePosY;

var holePosX, holePosY;
var holeRadius = 5;

var boundaryUpSize, boundaryRightSize, boundaryDownSize, boundaryLeftSize;
var boundaryRight, boundaryLeft, boundaryUp, boundaryDown;

var wallX, wallY, wallW, wallH;

var levelScore = 0;
var levelScoreArray = [];

var timesBounced = 0;



//Draw start screen
startImg.addEventListener("load", function(){
    context.drawImage(startImg,0,0);
});

//On click, draw score and start game
canvas.addEventListener("click", drawScore);
canvas.addEventListener("click", start);

//Draw levels score on canvas 2
function drawScore(){
    canvas.removeEventListener("click",drawScore);
    context2.clearRect(0,0,canvas2.width,canvas2.height);
    updatePower(0);
    updateScore(0);
    context2.font = "20px Arial";
    context2.fillText("Level",20,70);
    context2.fillText("1",90,70);
    context2.fillText("2",140,70);
    context2.fillText("3",190,70);
    context2.fillText("4",240,70);
    context2.fillText("Total",320,70);
    context2.fillText("Score",20,100);
    context2.fillText("-",90,100);
    context2.fillText("-",140,100);
    context2.fillText("-",190,100);
    context2.fillText("-",240,100);
    context2.fillText("-",330,100)
    context2.fillText("Times Bounced: " + timesBounced, 90, 120)
}

//Update position variables and draw
function start(){
    //Remove click event, clear canvas, update level and score
    canvas.removeEventListener("click",start);
    canvas2.removeEventListener("click",start);
    context2.clearRect(0,0,400,45)
    updatePower(0);
    updateScore(0);
    document.addEventListener("mousemove",trackLine);
    context.clearRect(0,0,canvas.width,canvas.height);
    level+= 1;
    levelScore = 0;

    //Get coordinates for the level from the arrays
    ballInitialX = ballPosition[level-1][0];
    ballInitialY = ballPosition[level-1][1];
    ballStartX = ballInitialX;
    ballStartY = ballInitialY;
    ballNewPosX = ballStartX;
    ballNewPosY = ballStartY;

    holePosX = holePosition[level-1][0];
    holePosY = holePosition[level-1][1];

    boundaryUpSize = boundariesPosition[level-1][0];
    boundaryRightSize = boundariesPosition[level-1][1];
    boundaryDownSize = boundariesPosition[level-1][2];
    boundaryLeftSize = boundariesPosition[level-1][3];

    boundaryRight = canvas.width-boundaryRightSize;
    boundaryLeft = boundaryLeftSize;
    boundaryUp = boundaryUpSize;
    boundaryDown = canvas.height-boundaryDownSize;


    // wallX = wallPosition[level-1][0];
    // wallY = wallPosition[level-1][1];
    // wallW = wallPosition[level-1][2];
    // wallH = wallPosition[level-1][3];
    //
    // //Draw objects and ball
    draw();
    drawBall();
}

//Draw the ball
function drawBall(){
    context.drawImage(ball, 0 * ballWidth, 0, ballWidth, ballHeight, ballStartX, ballStartY, ballWidth, ballHeight);
}

//Draw objects
function draw(){
    drawBoundaries(0,0,boundaryLeftSize,canvas.height);
    drawBoundaries(canvas.width-boundaryRightSize,0,boundaryRightSize,canvas.height);
    drawBoundaries(0,0,canvas.width,boundaryUpSize);
    drawBoundaries(0,canvas.height-boundaryDownSize,canvas.height,boundaryDownSize);
    drawHole();
    //drawSand(sandX,sandY,sandW,sandH);
    //drawWater(waterX,waterY,waterW,waterH);

var howManyWalls = wallPosition[level-1]["length"];
for (var i = 0; i < howManyWalls; i++){
  wallX = wallPosition[level-1][i][0];
  wallY = wallPosition[level-1][i][1];
  wallW = wallPosition[level-1][i][2];
  wallH = wallPosition[level-1][i][3];
  drawWall(wallX,wallY,wallW,wallH);
}
}

//Draw the boundaries
function drawBoundaries(xBon,yBon,w,h){
    context.beginPath();
    context.fillStyle="grey";
    context.fillRect(xBon,yBon,w,h);
    context.closePath()
    context.fill();
}

//Draw wall
function drawWall(wallX,wallY,wallW,wallH){
    context.beginPath();
    context.fillStyle="grey";
    context.fillRect(wallX,wallY,wallW,wallH);
    context.closePath();
    context.fill();
}

//Draw hole
function drawHole(){
    //hole border
    context.beginPath();
    context.arc(holePosX,holePosY,holeRadius+5,0,7);
    context.closePath();
    context.fillStyle = "#d6d6c2";
    context.fill();

    //hole
    context.beginPath();
    context.arc(holePosX,holePosY,holeRadius,0,7);
    context.closePath();
    context.fillStyle = "#004d00";
    context.fill();
}


//Draw Track Line
function trackLine() {
    mousePosX  = event.clientX;
    mousePosY = event.clientY;
    var trackLineSize = 40;

    //Triangle 1: use the mouse coord and ball pos to define a rect triangle, calculate sides using Pythagoras' theorem, calculate Sine
    var triangle1B = ballNewPosY - mousePosY;
    var triangle1C = mousePosX - ballNewPosX;
    var triangle1A = Math.round(Math.pow(Math.pow(triangle1B,2)+Math.pow(triangle1C,2),0.5),0);
    sine1 = triangle1B/triangle1A;

    //Based on the Sine and on trackLineSize (side A), calculate triangle 2 sides B and C
    var triangle2A = trackLineSize;
    var triangle2B = Math.round(sine1 * triangle2A,0);
    var triangle2C = Math.round(Math.pow(Math.pow(triangle2A,2)-Math.pow(triangle2B,2),0.5),0);

    //Use the triangle sides to define the line coordinates (lineX and lineY)
    if (mousePosX <= ballNewPosX){
        var lineX = ballNewPosX + triangle2C;
        var lineY = ballNewPosY + triangle2B;
    }
    if (mousePosX > ballNewPosX){
        var lineX = ballNewPosX - triangle2C;
        var lineY = ballNewPosY + triangle2B;
    }

    //Clear area around the ball
    context.clearRect(ballNewPosX-45,ballNewPosY-45,90,90);

    //Redraw objects, if not, the track line will clearRect them
    draw();

    //Draw one track line accordingly to the mouse position
    context.moveTo(ballNewPosX+ballWidth/2,ballNewPosY+ballHeight/2);
    context.lineTo(lineX,lineY);
    context.lineWidth = 3;
    context.strokeStyle = "orange";
    context.stroke();

    //Draw Ball
    drawBall();
}

//While spacebar is pressed, active wheel listener and excecute strikepower function
document.addEventListener("keydown", power);
function power(event){
    if (event.keyCode == 32) {
        document.addEventListener("wheel", strikePower);
    }
}

//Define power by counting how many "wheels" the user rolled, print to the screen
function strikePower (){
    strike += 1;
    updatePower(strike);
}

//When the spacebar is released, stop listening to wheel, count score, execute moveball function
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 32 && strike>0) {
        document.removeEventListener("wheel",strikePower);
        levelScore += 1;
        updateScore(levelScore);
        moveBall();
    }
})

//Show the strike power
function updatePower(strike){
    var powerbar = 0;
    context2.clearRect(0,1,230,40);
    context2.font = "20px Arial";
    context2.fillStyle = "black";
    context2.fillText("Power: ",20,30);
    context2.fillStyle = "blue";
    context2.strokeRect(100,10,99,25);
    powerbar = strike * 3;

    if (powerbar<=99){
        context2.fillRect(100,10,powerbar,25);
    }

    else{
        context2.fillRect(100,10,99,25);
    }

}

//Show the Score
function updateScore(levelScore){
    context2.clearRect(225,0,200,30);
    context2.fillStyle = "black";
    context2.font = "20px Arial";
    context2.fillText("Score: " + levelScore,300,30);
}

function updateBounceCount(bounceCount){
    context2.clearRect (90, 120, 100, 150);
    context2.fillStyle = "black";
    context2.font = "20px Arial";
    context2.fullText("Times Bounced: " + bounceCount, 90, 120);
}

//Move the ball from the start position to the new position
function moveBall(){
    //Define the start position before changing to the new position
    ballStartX = ballNewPosX;
    ballStartY = ballNewPosY;

    //Calculate the new position
    newPos();

    //Set the intermediate number to be added to the positions, to make the movement
    var intermediateX = (ballNewPosX-ballStartX+1)/6; //+1 is to avoid getting a 0 in the numerator
    var intermediateY = (ballNewPosY-ballStartY+1)/6; //+1 is to avoid getting a 0 in the numerator
    var intervalCount = 0;
    var cycle = 0;

    //Makes the movement of the ball
    var ballInterval = setInterval(function(){
        //Counter of the interval and Stop moving the ball after drawing the predefined amout of times
        intervalCount += 1;
        if (intervalCount == 6){
            clearInterval(ballInterval);
        }

        //Define new position of the ball
        ballStartX = ballStartX + intermediateX;
        ballStartY = ballStartY + intermediateY;

        //BOUNDARY: Bounce the ball if reaches RIGHT or LEFT boundary
        if (ballStartX>boundaryRight-ballWidth || ballStartX<boundaryLeft){
            //Set the X adjusted position after bouncing, adjust X direction
            ballNewPosX = ballStartX - (7 - intervalCount) * intermediateX;
            ballStartX = ballStartX - intermediateX;
            intermediateX = - intermediateX;
            timesBounced = timesBounced + 1;
        }

        //BOUNDARY: Bounce the ball if reaches UP or DOWN boundary
        if (ballStartY<boundaryUp || ballStartY>boundaryDown-ballHeight){
            //Set the Y adjusted position after bouncing, adjust Y irection
            ballNewPosY = ballStartY - (7 - intervalCount) * intermediateY;
            ballStartY = ballStartY - intermediateY;
            intermediateY = - intermediateY;
            timesBounced = timesBounced + 1;
        }

        var howManyWalls = wallPosition[level-1]["length"];
        for (var i = 0; i < howManyWalls; i++){
          wallX = wallPosition[level-1][i][0];
          wallY = wallPosition[level-1][i][1];
          wallW = wallPosition[level-1][i][2];
          wallH = wallPosition[level-1][i][3];
          if ((ballStartY > wallY - wallH/2)
          && (ballStartY < wallY + wallH/2)
          && (ballStartX < wallX + wallW/2)
          && (ballStartX > wallX - wallW/2)){
                        ballNewPosX = ballStartX - (7 - intervalCount) * intermediateX;
                        ballStartX = ballStartX - intermediateX;
                        intermediateX = - intermediateX;

                        ballNewPosY = ballStartY - (7 - intervalCount) * intermediateY;
                        ballStartY = ballStartY - intermediateY;
                        intermediateY = - intermediateY;
                        timesBounced = timesBounced + 1;
            console.log("Hit the wall");
          }
        }

       //WALL: Bounce the ball if hits walls
       console.log (wallX, ballStartX, wallW, ballWidth, ballStartY, wallY);
       if ((ballStartY > wallY - wallH/2)
       && (ballStartY < wallY + wallH/2)
       && (ballStartX < wallX + wallW/2)
       && (ballStartX > wallX - wallW/2)){
           console.log("Hit the wall");
         }
         //if the ball position = wall postion, then its over a wall

        if (ballStartX > wallX-ballWidth
          && ballStartX < wallX+wallW
          && ballStartY > wallY-ballHeight
           && ballStartY < wallY+wallH){


            // ballNewPosX = ballStartX - (7 - intervalCount) * intermediateX;
            // ballStartX = ballStartX - intermediateX;
            // intermediateX = - intermediateX;
            //
            // ballNewPosY = ballStartY - (7 - intervalCount) * intermediateY;
            // ballStartY = ballStartY - intermediateY;
            // intermediateY = - intermediateY;
            // timesBounced = timesBounced + 1;
        }
        // function contactWithWall (){
        //   if
        // }

        //Clear canvas and Draw objects
        context.clearRect(0,0,canvas.width,canvas.height);
        draw();

        //Draw the moving ball
        cycle = (cycle+1)%2;
        context.drawImage(ball, cycle * ballWidth, 0, ballWidth, ballHeight, ballStartX, ballStartY, ballWidth, ballHeight);

        //Define the area in which the ball will be considered in the hole, end game
        if ((ballNewPosX > holePosX-15 && ballNewPosX < holePosX+15) && (ballNewPosY > holePosY-15 && ballNewPosY < holePosY+15)){
            clearInterval(ballInterval);
            document.removeEventListener("mousemove",trackLine);
            nextLevel();
        }
    },50)
    //Reset the strike power to 0 for a new strike
    strike = 0;
}

//Calculate where the ball end position will be
function newPos(){
    //Triangle3: using triangle 1 sine, define triangle 3, side A will be the strike power (with correction)
    var triangle3A = strike * 6;
    var triangle3B = Math.round(sine1 * triangle3A,0);
    var triangle3C = Math.round(Math.pow(Math.pow(triangle3A,2)-Math.pow(triangle3B,2),0.5),0);

    //Define the new coordinates (newPosX and newPosY), depending on (if) which side mouse is pointing
    if (mousePosX > ballNewPosX){
        ballNewPosX = ballNewPosX - triangle3C - ballWidth/2;
        ballNewPosY = ballNewPosY + triangle3B - ballHeight/2;
    }
    if (mousePosX <= ballNewPosX){
        ballNewPosX = ballNewPosX + triangle3C - ballWidth/2;
        ballNewPosY = ballNewPosY + triangle3B - ballHeight/2;
    }
}

//Go to the next level
function nextLevel(){
    //Clear canvas, draw objects, draw ball inside the hole
    context.clearRect(0,0,canvas.width,canvas.height);
    draw();
    context.drawImage(ball, 0 * ballWidth, 0, ballWidth, ballHeight, holePosX-ballWidth/2, holePosY-ballHeight/2, ballWidth, ballHeight);

    //Update level score into the score array
    levelScoreArray[level-1] = levelScore;

    //Reset power and score to 0
    updatePower(0);
    updateScore(0);

    //Update Level score on canvas2
    context2.clearRect(90+50*(level-1),80,30,30);
    context2.fillText(levelScoreArray[level-1],90+50*(level-1),100);

    //If it is last level, game over, if not, start next
    if (level == lastLevel){
        gameover();
    }

    else {
        context2.clearRect(0,0,400,40);
        context2.fillStyle = "yellow";
        context2.fillRect(0,0,400,45);
        context2.fillStyle = "red";
        context2.fillText("CLICK HERE FOR NEXT LEVEL",50,30);
        context.font = "50px Arial";
        context.fillStyle = "red";
        context.fillText("WELL DONE!!!",30,200);
        canvas2.addEventListener("click", start);
    }
}

//Game over
function gameover(){
    document.removeEventListener("mousemove",trackLine);
    document.removeEventListener("keydown",power);

    //Sum total score, update, alert
    var total = 0;
    for (var i=0;i<=level-1;i++){
        total += levelScoreArray[i];
    }

    context2.clearRect(330,80,30,30);
    context2.fillText(total,330,100);
    gameoverAnimation();
    canvas2.addEventListener("click",playAgain);
}

function gameoverAnimation(){
    //Draw 4 balls animantion
    ballStartX=200;
    ballStartY=190;
    var moveX = 3;
    var moveY = 5;
    var ballStartX1 = 200;
    var ballStartY1 = 190;

    var gameoverInterval = setInterval(function(){
        context.drawImage(ball, 0 * ballWidth, 0, ballWidth, ballHeight, ballStartX, ballStartY, ballWidth, ballHeight);
        context.drawImage(ball, 0 * ballWidth, 0, ballWidth, ballHeight, ballStartX1, ballStartY, ballWidth, ballHeight);
        context.drawImage(ball, 0 * ballWidth, 0, ballWidth, ballHeight, ballStartX, ballStartY1, ballWidth, ballHeight);
        context.drawImage(ball, 0 * ballWidth, 0, ballWidth, ballHeight, ballStartX1, ballStartY1, ballWidth, ballHeight);
        ballStartX+=moveX;
        ballStartY+=moveY;
        ballStartX1+=-moveX;
        ballStartY1+=-moveY;

        //BOUNDARY: Bounce the ball if reaches RIGHT or LEFT boundary
        if (ballStartX>canvas.width-ballWidth || ballStartX<0){
            ballStartX = ballStartX - moveX;
            moveX = - moveX;
        }

        //BOUNDARY: Bounce the ball if reaches UP or DOWN boundary
        if (ballStartY<0 || ballStartY>canvas.height-ballHeight){
            ballStartY = ballStartY - moveY;
            moveY = -moveY;
        }

        //Stop animation when clicked
        canvas2.addEventListener("click",function(){
            clearInterval(gameoverInterval);
        })
    },20)

    //Draw on canvas2, game over, click to play again
    context2.clearRect(0,0,400,40);
    context2.fillStyle = "yellow";
    context2.fillRect(0,0,400,45);
    context2.fillStyle = "red";
    context2.fillText("GAME OVER",140,30);
    var interval2 = setInterval(function(){
            context2.clearRect(0,0,400,40);
            context2.fillStyle = "yellow";
            context2.fillRect(0,0,400,45);
            context2.fillStyle = "red";
            context2.fillText("CLICK HERE TO PLAY AGAIN",60,30);
        var interval3 = setTimeout(function(){
            context2.clearRect(0,0,400,40);
            context2.fillStyle = "yellow";
            context2.fillRect(0,0,400,45);
            context2.fillStyle = "red";
            context2.fillText("GAME OVER",140,30);
        },1000)

        canvas2.addEventListener("click",function(){
            clearInterval(interval3);
            clearInterval(interval2);
        })
    },2000)
}

function playAgain(){
    canvas2.removeEventListener("click",playAgain);
    document.addEventListener("mousemove",trackLine);
    document.addEventListener("keydown",power);
    drawScore();
    updatePower(0);
    updateScore(0);
    level = 0;
    start();
}
