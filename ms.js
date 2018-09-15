var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var ballsnumber = 100;
var colorArray = [
	'#010D00',
	'#092601',
	'#174004',
	'#3B7314',
	'#58A621'
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

//functions
function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor(color){
	return color[Math.floor(Math.random() * color.length)];
}

//----------------
//object creation
//----------------
function Ball(x, y, radius){
	this.color = randomColor(colorArray);
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.radians = Math.random() * Math.PI *2;
	this.velocity = Math.random() * 0.1;
	this.range = randomIntFromRange(30, 100);
	this.lastMouse = {x: x, y: y};

	this.draw = function(lastPoint){
		c.beginPath();
		c.strokeStyle = this.color;
		c.lineWidth = this.radius;
		c.lineHeight = this.radius;
		c.moveTo(lastPoint.x, lastPoint.y);
		c.lineTo(this.x, this.y);
		c.stroke();
		c.closePath();
	}
	this.update = function(){
		var lastPoint = {
			x: this.x,
			y: this.y
		};
		//move points over time
		this.radians += this.velocity;

		//drag effect
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.07;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.07;

		//Circular motion
		this.x = this.lastMouse.x + Math.cos(this.radians) * this.range;
		this.y = this.lastMouse.y + Math.sin(this.radians) * this.range;
	
		this.draw(lastPoint);
	}
}


//array of balls
var ballsarray;

function init(){
	ballsarray = [];

	for (let i = 0; i < ballsnumber; i++) {
		let radius = (Math.random() * 2) + 1;
		let x = canvas.width/2;
		let y = canvas.height/2;
		ballsarray.push(new Ball(mouse.x, mouse.y, radius));
	}
}

function animate(){
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(255, 255, 255, 0.3)';
	c.fillRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < ballsarray.length; i++) {
		ballsarray[i].update();
	}
}

init();
animate();