var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var circleNumber = 75;
var friction = 0.5;

var colorArray = [
	'#2E0927',
	'#D90000',
	'#FF2D00',
	'#FF8C00',
	'#04756F'
]
//getting mouse position
var mouse = {
	x: undefined,
	y: undefined
}
window.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});

var clicknumber = 0;
window.addEventListener('click', function(){
	
	if(clicknumber < 3){
		clicknumber++;
		init();
	} else{
		clicknumber = 0;
		circleArray = [];
		init();
		clicknumber++;
	}
});

//RWD
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//----------------
//object creation
//----------------
function Circle(x, y, dx, dy, radius){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		c.strokeStyle = this.color;
		c.stroke();
	}
	this.update = function(){
		if (this.x + this.radius + this.dx > canvas.width || this.x + this.dx < this.radius){
			this.dx = -this.dx * friction;
		} 
		if (this.y + this.radius + this.dy > canvas.height || this.y + this.dy < this.radius) {
			this.dy = -this.dy * friction;
		} 
		this.x += this.dx;
		this.y += this.dy;
		
		
		
		this.draw();
	}
}

//-----------------
//array of circles
//-----------------
var circleArray = [];

function init(){


	for (let i = 0; i < circleNumber; i++) {
		
		let radius = randomIntFromRange(5, 30);
		let x = Math.random() * (canvas.width - radius * 2) + radius;
		let y = Math.random() * (canvas.height - radius * 2) + radius;
		let dx = (Math.random() - 0.5) * 15;
		let dy = (Math.random() - 0.5) * 15;

		circleArray.push(new Circle(mouse.x, mouse.y, dx, dy, radius));
	}
}
init();

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	for (let i = 0; i < circleArray.length; i++) {
		
		circleArray[i].update();
		
	}
}

animate();