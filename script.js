const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // calls the '2d' API

canvas.width = window.innerWidth; // this sets the canvas as the browser window fullscreen
canvas.height = window.innerHeight;
// console.log(canvas.width);

let score = 0; // SCORE
ctx.font = "50px Impact";

let timeToNextRaven = 0;
let ravenInterval = 3500;
let lastTime = 0; // hold value of timestamp of previous loop

const gravity = 0.15;

class Player {
  constructor() {
    this.x = 250;
    this.y = 250;
    this.width = 100;
    this.height = 100;
    this.velocity = {
      x: 0,
      y: 1,
    };
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.y += this.velocity.y;
    this.x += this.velocity.x;

    if (this.y + this.height + this.velocity.y <= canvas.height) {
      // here gravity function to pull it downwards
      this.velocity.y += gravity;
    }
    // else this.velocity.y = 0; // here so he doesnt FALL THRU FLOOR
  }
}

let player = new Player();
// FUNCTION RESET game for when player loses aka touches floor LOL @this solution

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
};

function pauseGame() {
  clearInterval();
  paused = true;
  ctx.globalAlpha = 0.5;
  ctx.font = "90px tahoma";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Paused", 400, 400);
}
let pauseBtn = document.querySelector("#pauseBtn");
let paused = false;
function togglePause() {
  console.log("pause button is clicked");
  if (!paused) {
    paused = false;
    pauseGame();
  } else if (paused) {
    paused = true;
  }
}
pauseBtn.addEventListener("click", togglePause);

class Platform {
  constructor() {
    this.x = 250;
    this.y = 500;
    this.width = 200;
    this.height = 20;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
const platform = new Platform();
platform.draw();

let ravens = []; // has to be "let" not "const" because we want to reassign raven array later in line 50
let images = [];

function randomWords() {
  // how to randomize the words that get loaded into the raven class
  image0 = new Image();
  image1 = new Image();
  image2 = new Image();
  image3 = new Image();
  image0.src = "word1_plagiarise.png";
  image1.src = "word2.png";
  image2.src = "word3.png";
  image3.src = "word4.png";
  images.push(image0);
  images.push(image1);
  images.push(image2);
  images.push(image3);
}
randomWords();
// console.log(images);

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4; // to randomize scale of ravens
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = 2;
    this.directionY = -(Math.random() * 4 - 1.5);
    this.markedForDeletion = false;
    // this.image0 = new Image();
    // this.image0.src = "word1_plagiarise.png";
    // this.image1 = new Image();
    // this.image1.src = "word2.png";
    this.image = images[Math.floor(Math.random() * images.length)];
    this.frame = 0; // TO ANIMATE THE SPRITE SHEETS SO IT LOOKS LIKE FLYING!! :O
    this.maxFrame = 4;
    this.counter = 0;
  }
  update() {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      // this to get it to bounce off the floor and the roof
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    if (this.frame > this.maxFrame) this.frame = 0;
    else if (this.counter == 20) {
      this.frame++;
      this.counter = 0;
    } else this.counter++;
  }
  draw() {
    ctx.strokeStyle = "blue";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

// function drawScoreTimer() {
//   ctx.fillStyle = "black";
//   ctx.fillText("Score: " + score, 50, 75);
//   ctx.fillText("Time to DIE: " + timestamp, 50, 125);
// }

function reset() {
  player = new Player();
}

function animate(timestamp) {
  // takes miliseconds
  ctx.clearRect(0, 0, canvas.width, canvas.height); // this cleans the currentFrame of oldFrame drawings
  // raven.update();
  // raven.draw();
  let currentTime = 30 - Math.floor(timestamp / 1000);

  function drawScoreTimer() {
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 50, 75);
    ctx.fillText("Time to DIE: " + currentTime, 50, 125);
  }

  let deltatime = timestamp - lastTime; // timestamp is the current timestamp, lasttime is the last timestamp
  lastTime = timestamp; // lastTime = the timestamp of the previous frame **** kinda confusing, but rightside timestamp then refers to the timestamp of the current frame
  //   console.log("AAA" + lastTime); // how come lastTime and (current) timestamp are the same? @least in log?
  //   console.log("BBB" + timestamp);
  //   console.log("CCC" + deltatime); // even tho deltatime logs as 16.something miliseconds
  timeToNextRaven += deltatime;

  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }

  [...ravens].forEach((object) => object.update()); // so even if we add other class' arrays, this can activate all their update() / draw() but only if those functions are also defined in those other classes, like class Enemies{} or class Bullets{}
  [...ravens].forEach((object) => object.draw());
  ravens = ravens.filter((object) => !object.markedForDeletion); // only print out into ravens array the objects that have markedForDeletion = false
  // this is where to see what ravens are on screen
  //   console.log(ravens);
  //   console.log(ravens.length);

  // WHERE TO GET RAVEN COORDINATES when they're all in frame
  //   if (ravens.length !== 0) {
  //     raven1x = ravens[0].x;
  //     raven1width = ravens[0].width;
  //     // console.log(raven1x);
  //     raven1y = ravens[0].y;
  //     // console.log(raven1y)
  //     raven1directiony = ravens[0].directionY;
  //     // console.log(raven1directiony)
  //   }
  //   console.log(ravens[0].x); // this doesnt work because when it starts @ 0, function calls on undefined ==> error

  // making the ravens into platforms :D
  //   ravens.forEach((raven) => {
  //     raven.draw();
  //   });

  // PLAYER animations
  drawScoreTimer();
  platform.draw();
  player.update();

  if (keys.right.pressed && player.x <= canvas.width - player.width) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.x >= 0) {
    player.velocity.x = -5;
  } else if (keys.up.pressed && player.y > 0) {
    player.velocity.y = -5;
  } else if (player.y <= 0) {
    player.velocity.y = 1;
    player.velocity.x = 0;
  } else player.velocity.x = 0;

  //   let ravXY = [...ravens].forEach((raven) => {
  //     raven.y;
  //     raven.x;
  //   });

  console.log(player.velocity.y);

  // collision in the animate function because this is where the properties get updated
  if (
    player.y + player.height <= platform.y &&
    player.y + player.height + player.velocity.y >= platform.y &&
    player.x + player.width >= platform.x &&
    player.x <= platform.x + platform.width
  ) {
    player.velocity.y = 0;
  }

  if (ravens.length !== 0) {
    // just use forEach to determine collision detection for all ravens in array instead
    ravens.forEach((raven) => {
      console.log(
        `adding up player y and raven y ${player.velocity.y + raven.directionY}`
      );
      console.log(`raven.directionY is ${raven.directionY}`);

      if (
        player.y + player.height <= raven.y &&
        player.y + player.height + player.velocity.y >= raven.y &&
        raven.directionY > 0 &&
        // why do they bounce off the top of the raven when the ravens change y-direction from +ve to -ve (aka they start going upwards)
        player.x + player.width >= raven.x &&
        player.x <= raven.x + raven.width
      ) {
        player.velocity.y = 0;
      } else if (
        player.y + player.height <= raven.y &&
        player.y + player.height + player.velocity.y >= raven.y &&
        raven.directionY <= 0 &&
        player.x + player.width >= raven.x &&
        player.x <= raven.x + raven.width
      ) {
        player.velocity.y += raven.directionY;
      }
    });
  }
  //   console.log(timestamp);

  // -score condition
  if (player.y >= canvas.height) {
    score -= 1;
    reset();
  }

  //win-lose condition
  if (score > 0 && currentTime > 0) {
    alert("You win!");
    score = 0;
    reset();
  } else if (score <= -3 || currentTime <= 0) {
    alert("You lose!");
    score = 0;
    timestamp = 0;
    reset();
  }

  requestAnimationFrame(animate); // this will create infinite loop, and also parse in 'timestamp' value;
}

animate(0); // important to parse in '0' so timestamp begins iterating from 0, otherwise will return NaN in console.log(deltatime) because timestamp starts as undefined

//event listeners for keyboard key presses ---> action
// get the keycode of the keys pressed
addEventListener("keydown", ({ keyCode }) => {
  // console.log(keyCode);
  switch (keyCode) {
    case 65:
      //   console.log("left");
      keys.left.pressed = true;
      break;
    case 83:
      //   console.log("down");
      break;
    case 68:
      //   console.log("right");
      // player.velocity.x += 5; // to stop it from just moving on infitely +5, we now need a KEYUP event
      keys.right.pressed = true;
      break;
    case 87:
      //   console.log("up");
      keys.up.pressed = true;
      break;
  }
});

//KEY UP
addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      //   console.log("left");
      keys.left.pressed = false;
      break;
    case 83:
      //   console.log("down");
      break;
    case 68:
      //   console.log("right");
      keys.right.pressed = false;
      // player.velocity.x = 0; // but this isnt such a good way to do, instead we're going to set constant keys up @ line 44
      break;
    case 87:
      //   console.log("up");
      keys.up.pressed = false;
      break;
  }
});
