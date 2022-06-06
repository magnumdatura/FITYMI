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
const gameSpeed = 6;

class Player {
  constructor() {
    this.x = 250;
    this.y = 250;
    this.spriteWidth = 193;
    this.spriteHeight = 175;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.image = new Image();
    this.image.src = "player.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.counter = 0;
  }

  draw() {
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth + 17.5,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
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
    if (this.frame > this.maxFrame) this.frame = 0;
    else if (this.counter == 6) {
      this.frame++;
      this.counter = 0;
    } else this.counter++;
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

// function pauseGame() {
//   clearInterval();
//   paused = true;
//   ctx.globalAlpha = 0.5;
//   ctx.font = "90px tahoma";
//   ctx.fillStyle = "white";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillText("Game Paused", 400, 400);
// }

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
    this.sizeModifier = Math.random() * 0.4 + 0.6; // to randomize scale of ravens
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = gameSpeed;
    this.directionY = -(Math.random() * 5 - 2.5);
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

// let fantasy = []; // has to be "let" not "const" because we want to reassign raven array later in line 50
// let fantasyImg = [];

// function randomFantasy() {
//   // how to randomize the words that get loaded into the raven class
//   image4 = new Image();
//   image5 = new Image();
//   // image2 = new Image();
//   // image3 = new Image();
//   image4.src = "ghost.png";
//   image5.src = "word2.png";
//   // image2.src = "word3.png";
//   // image3.src = "word4.png";
//   fantasyImg.push(image4);
//   fantasyImg.push(image1);
//   // images.push(image2);
//   // images.push(image3);
// }
// randomFantasy();
// // console.log(images);

// class Fantasy {
//   constructor() {
//     this.spriteWidth = 124;
//     this.spriteHeight = 194;
//     this.sizeModifier = Math.random() * 0.6 + 0.4; // to randomize scale of ravens
//     this.width = this.spriteWidth * this.sizeModifier;
//     this.height = this.spriteHeight * this.sizeModifier;
//     this.x = canvas.width;
//     this.y = Math.random() * (canvas.height - this.height);
//     this.directionX = 2;
//     this.directionY = -(Math.random() * 2 - 1.5);
//     this.markedForDeletion = false;
//     // this.image0 = new Image();
//     // this.image0.src = "word1_plagiarise.png";
//     // this.image1 = new Image();
//     // this.image1.src = "word2.png";
//     this.image = fantasyImg[Math.floor(Math.random() * images.length)];
//     this.frame = 0; // TO ANIMATE THE SPRITE SHEETS SO IT LOOKS LIKE FLYING!! :O
//     this.maxFrame = 10;
//     this.counter = 0;
//   }
//   update() {
//     if (this.y < 0 || this.y > canvas.height - this.height) {
//       // this to get it to bounce off the floor and the roof
//       this.directionY = this.directionY * -1;
//     }
//     this.x -= this.directionX;
//     this.y += this.directionY;
//     if (this.x < 0 - this.width) this.markedForDeletion = true;
//     if (this.frame > this.maxFrame) this.frame = 0;
//     else if (this.counter == 10) {
//       this.frame++;
//       this.counter = 0;
//     } else this.counter++;
//   }
//   draw() {
//     ctx.drawImage(
//       this.image,
//       this.frame * this.spriteWidth,
//       0,
//       this.spriteWidth,
//       this.spriteHeight,
//       this.x,
//       this.y,
//       this.width,
//       this.height
//     );
//   }
// }

// function drawScoreTimer() {
//   ctx.fillStyle = "black";
//   ctx.fillText("Score: " + score, 50, 75);
//   ctx.fillText("Time to DIE: " + timestamp, 50, 125);
// }

function reset() {
  player = new Player();
}

let storeTime = 30;
let currentTime = 0;
let pauseBtn = document.querySelector("#pauseBtn");
let playing = true;
function togglePause() {
  console.log("pause button is clicked");
  playing = !playing;

  // if (!playing) {
  //   console.log({ storeTime });
  //   storeTime = currentTime;
  // }

  // animate(15000);

  // if (!playing) {
  //   storeTime = currentTime;
  // } else if (playing) {
  //   animate((30-storeTime) * 1000);
  // };

  //   // currentTime = storeTime;
  //   storeTime = currentTime;
  // } else {
  //   animate(storeTime);
  // }
  // if (storeTime === null) {
  //   storeTime = currentTime;
  // } else {
  //   currentTime = storeTime;
  //   storeTime = null;
  // }
  // if (playing) {
  //   playing = false;
  // } else if (playing === false) {
  //   playing = true;
  // }
}
pauseBtn.addEventListener("click", togglePause);

let pauseTime = 0;

function animate(timestamp) {
  // console.log({ timestamp });

  if (!playing) {
    if (pauseTime === 0) {
      pauseTime = timestamp;
    } else {
      storeTime = 30 + Math.floor((timestamp - pauseTime) / 1000);
      // console.log(storeTime);
    }
  }

  if (playing === true) {
    pauseTime = 0;
    // takes miliseconds
    ctx.clearRect(0, 0, canvas.width, canvas.height); // this cleans the currentFrame of oldFrame drawings
    // raven.update();
    // raven.draw();

    currentTime = storeTime - Math.floor(timestamp / 1000);
    // currentTime = 30 - Math.floor(6000 / 1000);

    // currentTime = 30 - currentTime;

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
      // fantasy.push(new Fantasy())
      timeToNextRaven = 0;
    }

    // fantasy.forEach((object) => object.update());
    // fantasy.forEach((object) => object.draw());
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

    // console.log(player.velocity.y);

    // collision in the animate function because this is where the properties get updated
    if (
      player.y + player.height <= platform.y &&
      player.y + player.height + player.velocity.y >= platform.y &&
      player.x + player.width >= platform.x &&
      player.x <= platform.x + platform.width
    ) {
      player.velocity.y = 0;
    }

    console.log(ravens);
    if (ravens.length !== 0) {
      // just use forEach to determine collision detection for all ravens in array instead
      ravens.forEach((raven) => {
        // console.log(
        //   `adding up player y and raven y ${player.velocity.y + raven.directionY}`
        // );
        // console.log(`raven.directionY is ${raven.directionY}`);

        if (
          player.y + player.height <= raven.y &&
          player.y + player.height + player.velocity.y >= raven.y &&
          raven.directionY > 0 &&
          // why do they bounce off the top of the raven when the ravens change y-direction from +ve to -ve (aka they start going upwards)
          player.x + player.width >= raven.x &&
          player.x <= raven.x + raven.width
        ) {
          player.velocity.y = 0;
          score += 1;
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
    if (score >= 30 && currentTime > 0 && currentTime < 30) {
      alert("You win!");
      score = 0;
      reset();
    } else if (score <= -3 || currentTime <= 0) {
      alert("You lose!");
      score = 0;
      timestamp = 0;
      reset();
    }
  }

  // timestamp -= 1000;
  requestAnimationFrame(animate); // this will create infinite loop, and also parse in 'timestamp' value;

  // animate(timestamp);
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
