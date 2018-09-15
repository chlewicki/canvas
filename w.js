var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var rectsnumber = 100;

var colorArray = [
	'#002F32',
	'#42826C',
	'#A5C77F',
	'#FFC861',
	'#C84663'
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

window.addEventListener('click', function(){
	if(rectsnumber < 300){
		rectsnumber += 100;
		init();
	} else{
		rectsnumber = 100;
		init();
	}
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
function Rectangle(x, y, width, height){
	this.color = randomColor(colorArray);
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.gravity = Math.random() * 0.1;
	this.velocity = (Math.random() * 2) + 1;
	this.range = randomIntFromRange(canvas.height/4, canvas.height/2);

	this.draw = function(){
		c.beginPath();
		c.rect(this.x, this.y, this.width, this.height);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}
	this.update = function(){
		
		if(this.height > 1 || this.height < -this.range){
			this.velocity = -this.velocity;	
		} else{
			this.velocity += this.gravity;
		}
		
		this.height -= this.velocity;
		this.draw();
		//console.log(this.height);
	}
}


//array of balls
let rectsarray;

function init(){
	rectsarray = [];

	for (let i = 0; i < rectsnumber; i++) {

		let width = canvas.width/rectsnumber;
		let height = 1;
		let x = 0;
		let y = canvas.height;

		if (i != 0){
			x = rectsarray[i-1].x + rectsarray[i-1].width;
		
		}
		rectsarray.push(new Rectangle(x, y, width, height));
	}
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < rectsarray.length; i++) {
		rectsarray[i].update();

	}
}

init();
animate();