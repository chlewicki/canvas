var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var rectangleNumber = 100;
var alpha = 0.07;

var colorArray = [
	'rgba(79, 16, 37, ',
	'rgba(197, 0, 62, ',
	'rgba(217, 255, 91, ',
	'rgba(120, 170, 0, ',
	'rgba(21, 54, 45, '
]
//getting mouse position
var mouse = {
	x: undefined,
	y: undefined
};
window.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener('mouseout', function(){
	mouse.x = undefined;
	mouse.y = undefined;
});

//RWD
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

//----------------
//object creation
//----------------
function Rectangle(x, y, dx, dy, width, height){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.alpha = 1;
	this.width = width;
	this.height = height;
	this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

	this.draw = function(){
		c.beginPath();
		c.rect(this.x, this.y, this.width, this.height);
		c.strokeStyle = this.color + this.alpha + ')';
		c.stroke();
		c.fillStyle = this.color + this.alpha + ')';
		c.fill();
	}
	this.update = function(){

		if (this.x + this.width + this.dx > canvas.width || this.x + this.dx <= 0){
			this.dx = -this.dx;
		} 
		if (this.y + this.height + this.dy > canvas.height || this.y + this.dy <= 0) {
			this.dy = -this.dy;
		}  
		this.x += this.dx;
		this.y += this.dy;
		
		if (mouse.x - this.x < 100 && mouse.x - this.x > -100 
			&& mouse.y - this.y < 100 && mouse.y - this.y > -100 && this.alpha >= 0){
				this.alpha -= alpha;
		} else if (this.alpha < 1) {
			this.alpha += alpha;
		}
		
		this.draw();
	}
}

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//-----------------
//array of rectangles
//-----------------
var rectangleArray = [];

function init(){
	rectangleArray = [];

	for (let i = 0; i < rectangleNumber; i++) {

		let width = randomIntFromRange(10, 50);
		let height = randomIntFromRange(10, 50);
		let x = Math.random() * (canvas.width - width * 2) + width;
		let y = Math.random() * (canvas.height - height * 2) + height;
		let dx = (Math.random() - 0.5);
		let dy = (Math.random() - 0.5);
		rectangleArray.push(new Rectangle(x, y, dx, dy, width, height));
	}
}
init();

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	for (let i = 0; i < rectangleArray.length; i++) {
		rectangleArray[i].update();
	}
}

animate();