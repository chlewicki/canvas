var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var rectangleNumber = 1;
var friction = 0.5;
var alpha = 0.01;

var colorArray = [
	'rgba(26, 31, 43, ',
	'rgba(48, 57, 92, ',
	'rgba(74, 100, 145, ',
	'rgba(133, 165, 204, ',
	'rgba(208, 228, 242, '
]
//getting mouse position
var mouse = {
	x: canvas.width/2,
	y: canvas.height/2
};

window.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener('mouseout', function(){
	mouse.x = canvas.width/2;
	mouse.y = canvas.height/2;
});

//RWD
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//----------------
//object creation
//----------------
function Rectangle(x, y, dx, dy, width, height){
	this.x = x;
	this.y = y;
	this.spawnx = this.x;
	this.spawny = this.y;
	this.dx = dx;
	this.dy = dy;
	this.width = width;
	this.height = height;
	this.alpha = 1;
	this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

	this.draw = function(){
		c.beginPath();
		c.rect(this.x, this.y, this.width, this.height);
		c.strokeStyle = this.color + this.alpha + ')';
		c.stroke();
	}
	this.update = function(){
		
		this.x += this.dx;
		this.y += this.dy;
		this.alpha -= alpha;
		if (this.x + this.width + this.dx > canvas.width || this.x + this.dx <= 0){
			this.dx = -this.dx * friction;
		} 
		if (this.y + this.height + this.dy > canvas.height || this.y + this.dy <= 0) {
			this.dy = -this.dy * friction;
		} 
		if (this.alpha <= 0){
			rectangleArray.splice(this, 1);
		}
		
		this.draw();
	}
}

//-----------------
//array of rectangles
//-----------------
var rectangleArray = [];

function init(){
	
	for (let i = 0; i < rectangleNumber; i++) {

		let width = randomIntFromRange(10, 50);
		let height = randomIntFromRange(10, 50);
		// let x = Math.random() * (canvas.width - width * 2) + width;
		// let y = Math.random() * (canvas.height - height * 2) + height;
		let dx = (Math.random() - 0.5) * 5;
		let dy = (Math.random() - 0.5) * 5;
		rectangleArray.push(new Rectangle(mouse.x, mouse.y, dx, dy, width, height));
	}

}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < rectangleArray.length; i++) {
		rectangleArray[i].update();
	}
	init();
}

animate();