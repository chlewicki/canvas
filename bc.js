var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var circleNumber = 100;
//focus speed
var chaseSpeedy = 12;
var chaseSpeedx = 24;
//delay settings
var friction = 0.5;
//launch power
var launch = 40;
//flags
var flag = true;
var flag2 = false;
//colors
var colorArray = [
	'#705B35',
	'#C7B07B',
	'#E8D9AC',
	'#FFF6D9',
	'#570026'
]
//getting mouse position
var mouse = {
	x: undefined,
	y: undefined
};

window.addEventListener('mousedown', function(event){
	mouse.x = event.x;
	mouse.y = event.y;
	flag = true;
	flag2 = true;
});

window.addEventListener('mouseup', function(){
	mouse.x = undefined;
	mouse.y = undefined;
	flag = false;
	flag2 = false;
});

window.addEventListener('mousemove', function(event){
	if(flag2 == true){
		mouse.x = event.x;
		mouse.y = event.y;
	}
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
	this.launchx = randomIntFromRange(-launch, launch);
	this.launchy = randomIntFromRange(-launch, launch);
	this.templaunchx = this.launchx;
	this.templaunchy = this.launchy;
	this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		c.stroke();
		c.fillStyle = this.color;
		c.fill();
	}
	this.update = function(){
		if(flag2 == true){
			this.launchx = this.templaunchx;
			this.launchy = this.templaunchy;
			}

		if (mouse.x != undefined && mouse.y != undefined){
			if (this.x + chaseSpeedx < mouse.x){
				this.x += chaseSpeedx;	
			} else if (this.x - chaseSpeedx > mouse.x) {
				this.x -= chaseSpeedx;
			}
			if (this.y + chaseSpeedy < mouse.y){
				this.y += chaseSpeedy;	
			} else if (this.y - chaseSpeedy > mouse.y) {
				this.y -= chaseSpeedy;
			}
		} else {
			if (flag == false){
				
				if (this.x + this.radius + this.launchx > canvas.width || this.x + this.launchx < this.radius){
				this.launchx = -this.launchx * friction;
				} 
				if (this.y + this.radius + this.launchy > canvas.height || this.y + this.launchy < this.radius) {
					this.launchy = -this.launchy * friction;
				}  
				this.x += this.launchx;
				this.y += this.launchy;
			} else{
			if (this.x + this.radius + this.dx > canvas.width || this.x + this.dx < this.radius){
				this.dx = -this.dx;
			} 
			if (this.y + this.radius + this.dy > canvas.height || this.y + this.dy <this.radius) {
				this.dy = -this.dy;
			}  
			this.x += this.dx;
			this.y += this.dy;
			}
			
			
		}
		
		this.draw();
	}
}
function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}
//-----------------
//array of circles
//-----------------
var circleArray = [];

function init(){
	circleArray = [];

	for (let i = 0; i < circleNumber; i++) {

		let radius = randomIntFromRange(10, 50);
		let x = randomIntFromRange(radius, canvas.width - radius);
		let y = randomIntFromRange(radius, canvas.height - radius);
		let dx = (Math.random() - 0.5);
		let dy = (Math.random() - 0.5);
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