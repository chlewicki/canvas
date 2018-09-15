var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var ballnumber = 200;
var alpha = 0.3;
var colorarray = [
	'#010D00',
	'#092601',
	'#174004',
	'#3B7314',
	'#58A621'
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
function Particle(x, y, radius){
	this.color = randomColor(colorarray);
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.radians = Math.random() * Math.PI * 2;
	
	this.range = randomIntFromRange(20, canvas.width);

	this.draw = function(lastPoint){
		c.beginPath();
		c.fillStyle = this.color;
		c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		c.fill();
		c.closePath();
	}
	this.update = function(){
		let lastPoint = {
			x: this.x,
			y: this.y
		};
		if (mouse.x == undefined) {
			this.velocity = 0.001;
			if (alpha < 0.3){
				alpha += 0.000005;
			}
		} else {
			this.velocity = (mouse.x/2) * 0.00001;
		}
		//move points over time
		this.radians += this.velocity;

		//Circular motion
		this.x = x + Math.sin(this.radians) * this.range;
		this.y = y + Math.cos(this.radians) * this.range;
		if (mouse.x > canvas.width/2 && alpha > 0.001){
			alpha -= 0.000005;
		} else if (alpha < 0.3) {
			alpha += 0.000005;
		}
		this.draw(lastPoint);
	}
}


//array of balls
ballrray = [];

function init(){
	ballarray = [];

	for (let i = 0; i < ballnumber; i++) {
		let radius = (Math.random() * 2) + 1;
		ballarray.push(new Particle(canvas.width/2, canvas.height/2, radius));
	}
	
}

function animate(){
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
	c.fillRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < ballarray.length; i++) {
		ballarray[i].update();
	}
}

init();
animate();