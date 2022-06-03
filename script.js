const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // calls the '2d' API

canvas.width = window.innerWidth; // this sets the canvas as the browser window fullscreen
canvas.height = window.innerHeight;

let score = 0; // SCORE
ctx.font = "50px Impact";

let timeToNextRaven = 0;
let ravenInterval = 3500;
let lastTime = 0; // hold value of timestamp of previous loop

let ravens = []; // has to be "let" not "const" because we want to reassign raven array later in line 50

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
    } else this.velocity.y = 0; // here so he doesnt fall thru floor
  }
}
const player = new Player();
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

class Platform {
  constructor() {
    this.x = 500;
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

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4; // to randomize scale of ravens
    this.width = 271; // this.spriteWidth * this.sizeModifier;
    this.height = 194; // this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = 1;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "raven.png";
    this.frame = 0; // TO ANIMATE THE SPRITE SHEETS SO IT LOOKS LIKE FLYING!! :O
    this.maxFrame = 4;
  }
  update() {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      // this to get it to bounce off the floor and the roof
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y -= this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    if (this.frame > this.maxFrame) this.frame = 0;
    else this.frame++;
  }
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
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

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
}

let raven1x = 0;
let raven1y = 0;

function animate(timestamp) {
  // takes miliseconds
  ctx.clearRect(0, 0, canvas.width, canvas.height); // this cleans the currentFrame of oldFrame drawings
  // raven.update();
  // raven.draw();
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
  drawScore();
  [...ravens].forEach((object) => object.update()); // so even if we add other class' arrays, this can activate all their update() / draw() but only if those functions are also defined in those other classes, like class Enemies{} or class Bullets{}
  [...ravens].forEach((object) => object.draw());
  ravens = ravens.filter((object) => !object.markedForDeletion); // only print out into ravens array the objects that have markedForDeletion = false
  // this is where to see what ravens are on screen
  console.log(ravens);
  console.log(ravens.length);

  if (ravens.length !== 0) {
    raven1x = ravens[0].x + ravens[0].width;
    console.log(raven1x);
    raven1y = ravens[0].y + ravens[0].height;
  }
  //   console.log(ravens[0].x); // this doesnt work because when it starts @ 0, function calls on undefined ==> error

  // making the ravens into platforms :D
  //   ravens.forEach((raven) => {
  //     raven.draw();
  //   });

  // PLAYER animations
  player.update();
  platform.draw();

  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else if (keys.left.pressed) {
    player.velocity.x = -5;
  } else if (keys.up.pressed) {
    player.velocity.y = -5;
  } else player.velocity.x = 0;

  //   let ravXY = [...ravens].forEach((raven) => {
  //     raven.y;
  //     raven.x;
  //   });

  // collision in the animate function because this is where the properties get updated
  if (
    player.y + player.height <= platform.y &&
    player.y + player.height + player.velocity.y >= platform.y &&
    player.x + player.width >= platform.x &&
    player.x <= platform.x + platform.width
  ) {
    player.velocity.y = 0;
  }

  if (
    player.y + player.height <= raven1y &&
    player.y + player.height + player.velocity.y >= raven1y &&
    player.x + player.width >= raven1x &&
    player.x <= raven1x
  ) {
    player.velocity.y = 0;
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
      console.log("left");
      keys.left.pressed = true;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      // player.velocity.x += 5; // to stop it from just moving on infitely +5, we now need a KEYUP event
      keys.right.pressed = true;
      break;
    case 87:
      console.log("up");
      keys.up.pressed = true;
      break;
  }
});

//KEY UP
addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = false;
      // player.velocity.x = 0; // but this isnt such a good way to do, instead we're going to set constant keys up @ line 44
      break;
    case 87:
      console.log("up");
      keys.up.pressed = false;
      break;
  }
});
