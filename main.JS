/**
 * ****************************************************************************
 * Name: Samer El-Murr*********************************************************
 * Date: 20/10/2020************************************************************
 * Course: Computer Graphics***************************************************
 * Intructor: Dr Danni Nini****************************************************
 * Project: GoblinSlayer*******************************************************
 * ****************************************************************************
 * This project is to make a game where you slay some goblins******************
 * ****************************************************************************
 */

// Create the canvas
var canvas = document.querySelector('#mainGame');
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
canvas.style = "position:absolute; margin-left: 30%; margin-right: 25%";
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "Assets/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = 'Assets/TheDarkKnight.png';

// Dragon image
var dragonReady = false;
var dragonImage = new Image();
dragonImage.onload = function () {
	dragonReady = true;
};
dragonImage.src = 'Assets/Dragon.png';

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "Assets/goblin.png";

// Game objects
var hero = { //hero character 
	x: 256, //default position of x on the canvas
	y: 240, //default position of y on the canvas
	width: 32, //width of sprite
	height: 48, //height of sprite
	frameX: 0, //frameX is the X position in the sprite image
	frameY: 0, //frameX is the y position in the sprite image
	speed: 5, // movement in pixels per second with respect to the player
	moving: false, //character movement 
};

var dragon = { //gragon character
	x: 10,
	y: 10,
	width: 96,
	height: 96,
	frameX: 0,
	frameY: 0,
	speed: 400,
	moving: false, 
};

//monster object
var monster = {};
var monstersCaught = 0; //initializing score 

// Reset the game when the player catches a monster
function reset() {

	//placing character in the middle of the canvas
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));

	// Throw the dragon somewhere on the screen randomly
	dragon.x = 32 + (Math.random() * (canvas.width - 64));
	dragon.y = 32 + (Math.random() * (canvas.height - 64));
};

// Handle keyboard controls
const keys = [];

//fuction used to draw the sprites
function drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

//event listeners for the keystrokes 
addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
    hero.moving = true;
}, false);

addEventListener("keyup", function (e) {
	delete keys[e.keyCode];
    hero.moving = false;
}, false);

//function to chasing and catching the player
function dragonCatchPlayer(){
	// subtract (= difference vector)
	var dx = hero.x - dragon.x;
	var dy = hero.y - dragon.y;

	// normalize (= direction vector)
	// (a direction vector has a length of 1)
	var length = Math.sqrt(dx * dx + dy * dy);
	if (length) {
	dx /= length;
	dy /= length;
	}

	var now = Date.now();
	var delta = now - then;
	then = now;
	
	let dX1 = dragon.x;
	let dY1 = dragon.y;

	// move
	// delta is the elapsed time in seconds
	// SPEED is the speed in units per second (UPS)
	dragon.x += dx * (delta/1000) * dragon.speed;
	dragon.y += dy * (delta/1000) * dragon.speed;

	//Dragon movment 
	if (dY1 > dragon.y) { // dragon holding up
		dragon.frameY = 3;
		dragon.moving = true;
	}
	if (dY1 < dragon.y) { // dragon holding down
		dragon.frameY = 0;
		dragon.moving = true;
	}
	if (dX1 > dragon.x) { // dragon holding left
		dragon.frameY = 1;
	}
	if (dX1 < dragon.X) { // dragon holding right
		dragon.frameY = 2;
		dragon.moving = true;
	}
}

// Update game objects
function update() {
	//player movment
    if (keys[38] && hero.y > 0) { // hero holding up
		hero.y -= hero.speed;
		hero.frameY = 3;
		hero.moving = true;
	}
	if (keys[40] && hero.y < canvas.height - hero.height) { // hero holding down
		hero.y += hero.speed;
		hero.frameY = 0;
		hero.moving = true;
	}
	if (keys[37] && hero.x > 0) { // hero holding left
		hero.x -= hero.speed;
		hero.frameY = 1;
	}
	if (keys[39] && hero.x < canvas.width - hero.width) { // hero holding right
		hero.x += hero.speed;
		hero.frameY = 2;
		hero.moving = true;
	}

	//calling function for dragon movment
	dragonCatchPlayer();

	//collision with moster
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}

	//collision with dragon
	if (
		hero.x <= (dragon.x + 64)
		&& dragon.x <= (hero.x + 64)
		&& hero.y <= (dragon.y + 64)
		&& dragon.y <= (hero.y + 64)
	) {
		monstersCaught = 0;
		reset();
	}
}

//function to progress through sprite frame to complete animation
function handleheroFrame() {
    if (hero.frameX < 3 && hero.moving) hero.frameX++;
    else hero.frameX = 0;
} 

function handleDragonFrame() {
    if (dragon.frameX < 3 && dragon.moving) dragon.frameX++;
    else dragon.frameX = 0;
} 

//variables for the gameloop
let fps, fpsInterval, startTime, now, then, elapsed;
 
//main loop
 function startAnimating(fps) {
     fpsInterval = 1000/fps;
     then = Date.now();
     startTime = then;
     animate();     
 }
 
 //animate function that contains everything to be drawn or animated 
 function animate() {
     requestAnimationFrame(animate);
     now = Date.now();
     elapsed = now - then;
     if (elapsed > fpsInterval) {
         then = now - (elapsed % fpsInterval);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			if (bgReady) {
				ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
			}
		
			if (heroReady) {
				drawImage(heroImage, hero.width * hero.frameX, 
					hero.height * hero.frameY, hero.width, hero.height,
					hero.x, hero.y, hero.width, hero.height);
			}

			if (dragonReady) {
				drawImage(dragonImage, dragon.width * dragon.frameX, 
					dragon.height * dragon.frameY, dragon.width, dragon.height,
					dragon.x, dragon.y, dragon.width, dragon.height);
			}
		
			if (monsterReady) {
				ctx.drawImage(monsterImage, monster.x, monster.y);
			}
		
			// Score for the player
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
		
		update();
		handleheroFrame();
		handleDragonFrame();
     }
 }

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame 
|| w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//starting the game
startAnimating(30);
reset();





