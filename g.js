var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var gravity = 0.8;
var friction = 0.7;
var ballNumber = 120;

var colors = [
	'#FF6138',
	'#FFFF9D',
	'#BEEB9F',
	'#79BD8F',
	'#00A388'
];
//getting mouse position
var mouse = {
	x: undefined,
	y: undefined
};
window.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});

//RWD
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

window.addEventListener('click', function(){
	init();
});

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors){
	return colors[(Math.floor(Math.random() * colors.length))];
}

//----------------
//object creation
//----------------
function Ball(x, y, dx, dy, radius, color){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = color;

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		c.fillStyle = this.color;
		c.stroke();
		c.fill();

	}
	this.update = function(){
		
		if (this.y + this.radius + this.dy > canvas.height){
			this.dy = -this.dy * friction;
			this.dx = this.dx * friction;
		} else {
			this.dy += gravity;
		}
		if (this.x + this.radius + this.dx > canvas.width || this.x + this.dx < this.radius){
			this.dx = -this.dx;
		}
		
		this.y += this.dy;
		this.x += this.dx;

		this.draw();
	}
}

var ballArray = [];


function init(){
	ballArray = [];
	
	for (let i = 0; i < ballNumber; i++) {
		let radius = randomIntFromRange(5, 40);
		let x = randomIntFromRange(radius, canvas.width - radius);
		let y = randomIntFromRange(radius, canvas.height - radius);
		let dx = randomIntFromRange(-10, 10);
		let dy = randomIntFromRange(1, 5);
		ballArray.push(new Ball(x, y, dx, dy, radius, randomColor(colors)));
	}
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
	}
	
}

init();
animate();