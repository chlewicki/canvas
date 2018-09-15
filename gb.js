var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var maxRadius = 50;
var circleNumber = 200;

var colorArray = [
	'#6B0C22',
	'#D9042B',
	'#F4CB89',
	'#588C8C',
	'#011C26'
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
function Circle(x, y, dx, dy, radius){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;
	this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		c.fillStyle = this.color;
		c.fill();
	}
	this.update = function(){
		if (this.x + this.radius > canvas.width || this.x < this.radius){
			this.dx = -this.dx;
		} 
		if (this.y + this.radius > canvas.height || this.y < this.radius) {
			this.dy = -this.dy;
		} 
		this.x += this.dx;
		this.y += this.dy;
		
		if (mouse.x - this.x < 80 && mouse.x - this.x > -80 
			&& mouse.y - this.y < 80 && mouse.y - this.y > -80){
			if (this.radius < maxRadius){
				this.radius += 2;
			}
		} else if (this.radius > this.minRadius) {
			this.radius -= 2;
		}
		
		this.draw();
	}
}

//-----------------
//array of circles
//-----------------
var circleArray = [];

function init(){
	circleArray = [];

	for (let i = 0; i < circleNumber; i++) {

		let radius = Math.random() * 7 + 2;
		let x = Math.random() * (canvas.width - radius * 2) + radius;
		let y = Math.random() * (canvas.height - radius * 2) + radius;
		let dx = (Math.random() - 0.5) * 2;
		let dy = (Math.random() - 0.5) * 2;

		circleArray.push(new Circle(x, y, dx, dy, radius));
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