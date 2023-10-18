const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");
const paddlewidth = 150;
const paddleh = 20;
const paddlemargin = 50;
const ballrd = 9;
const background = new Image;
background.src = "./i4.jpg";
// background.src = "./bg.jpg";

// const background = document.getElementById("scream");
// ctx.drawImage(img, 10, 10);


let leftarrow = false
let rightarrow = false
let life = 3;
let SCORE = 0;
let highSCORE

// localStorage.setItem('score', '0');
let scoreadd = 10;
let level = 1;
let max = 3;
let over = false;


// Line width
ctx.lineWidth = 3;

const paddle = {
    x: cvs.width / 2 - paddlewidth / 2,
    y: cvs.height - paddlemargin - paddleh,
    width: paddlewidth,
    height: paddleh,
    dx: 5
}

function drawpaddle() {
    ctx.fillStyle = "gray";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "black";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        leftarrow = true;
    } else if (event.key === "ArrowRight") {
        rightarrow = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        leftarrow = false;
    } else if (event.key === "ArrowRight") {
        rightarrow = false;
    }
});

function movepaddle() {
    if (rightarrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftarrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

const ball = {
    x: cvs.width / 2,
    y: paddle.y - ballrd,
    radius: ballrd,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

function drawball() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.strokeStyle = "orange";
    ctx.stroke();

    ctx.closePath();

}

function moveball() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballwallcollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;

    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;

    }
    if (ball.y + ball.radius > cvs.height) {
        life--;
        resetBall();
    }
}

function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - ballrd;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

function ballpaddlecollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y < paddle.y + paddle.height && ball.y > paddle.y) {

        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        collidePoint = collidePoint / (paddle.width / 2);

        let angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);

    }
}

const brick = {
    row: 1,
    column: 18,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "olive",
    strokeColor: "black"
}

let bricks = [];

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}


createBricks();

function drawbricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}


function ballbrickcollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = false;
                    SCORE += scoreadd;

                }
            }
        }
    }
}

function points(text, textX, textY) {
    ctx.fillStyle = "orange";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);

}

function gameover() {
    if (life < 0) {
        over = true;
        points("Game Over", cvs.width / 2 - 40, cvs.height / 2);
        points("Your Score" + "=" + SCORE, cvs.width / 2 - 40, cvs.height / 2 + 30);
        points("Refresh to Play Again!", cvs.width / 2 - 100, cvs.height / 2 + 60);
    }
}

function levelup() {
    let done = true;

    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            done = done && !bricks[r][c].status;
        }
    }

    if (done) {
        if (level >= max) {
            over = true;

            points("Win Win !", cvs.width / 2 - 45, cvs.height / 2);
            points("High Score" + localStorage.getItem(SCORE), cvs.width / 2 - 45, cvs.height / 2);
            // localStorage.getItem("mytime");
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        level++;
    }
}

function draw() {
    drawpaddle();
    drawball();
    drawbricks();
    points("Score:" + SCORE, 35, 25);
    points("High Score:" + localStorage.getItem('high score'), 295, 25);

    // console.log(SCORE)
    highSCORE = SCORE;
    localStorage.setItem('high score', highSCORE);
    points("Life:" + life, cvs.width - 190, 25);
    points("Level:" + level, cvs.width / 2 - 40, 25);
}

function update() {
    movepaddle();
    moveball();
    ballwallcollision();
    ballpaddlecollision();
    ballbrickcollision();
    gameover();
    levelup();
}

function loop() {
    ctx.drawImage(background, 0, 0, background.width = 1380, background.height = 626);
    draw();
    update();
    if (!over) {
        requestAnimationFrame(loop);
    }
}

loop()