var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var density = 10;
var linenumber = (density * (density - 1)) * 2;
c.lineWidth = 10;
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
window.addEventListener('mouseout', function(){
	mouse.x = undefined;
	mouse.y = undefined;
})

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
function Line(x, y, defx, defy, dx, flag){
	this.color = randomColor(colorArray);
	this.x = x;
	this.y = y;
	this.defx = defx;
	this.defy = defy;
	this.flag = flag;
	this.dx = dx;

	this.firstx = x;
	this.firsty = y;
	this.firstdefx = defx;
	this.firstdefy = defy;

	this.midy = (defy + y)/2;
	this.midx = (defx + x)/2;
	this.radians = Math.random() * Math.PI * 2;
	this.velocity = Math.random() * 0.1;
	this.basicradians = this.radians;

	this.draw = function(){
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineTo(this.defx, this.defy);
		c.stroke();
		c.closePath();
	}
	this.update = function(){
		//vertical lines
		if (flag == false){
			if (((mouse.x - this.midx < 50 && mouse.x - this.midx > -50) || 
				(mouse.x - this.firstx < 50 && mouse.x - this.firstx > -50)  ||
				(mouse.x - this.firstdefx < 50 && mouse.x - this.firstdefx > -50))  
				&& ((mouse.y - this.midy < 50 && mouse.y - this.midy > -50) ||   
				(mouse.y - this.firsty < 50 && mouse.y - this.firsty > -50) ||
				(mouse.y - this.firstdefy < 50 && mouse.y - this.firstdefy > -50))){
					this.x += Math.cos(this.radians);
					this.y += this.dx;
					this.defx += Math.sin(this.radians);
					this.defy += this.dx;
					this.radians += this.velocity;
		 	} else if (this.y < this.firsty || this.y > this.firsty){	
					this.x -= Math.cos(this.radians);
					this.y -= this.dx;
					this.defx -= Math.sin(this.radians);
					this.defy -= this.dx;
					this.radians -= this.velocity;
					if (this.y == this.firsty && this.x == this.firstx){
						this.x = this.firstx;
						this.y = this.firsty;
						this.defx = this.firstdefx;
						this.defy = this.firstdefy;
						this.radians = this.basicradians;
						console.log('back');
					}
					
			}

			//horizontal lines
		} else{
			if (((mouse.x - this.midx < 50 && mouse.x - this.midx > -50) || 
				(mouse.x - this.firstx < 50 && mouse.x - this.firstx > -50)  ||
				(mouse.x - this.firstdefx < 50 && mouse.x - this.firstdefx > -50))  
				&& ((mouse.y - this.midy < 50 && mouse.y - this.midy > -50) ||   
				(mouse.y - this.firsty < 50 && mouse.y - this.firsty > -50) ||
				(mouse.y - this.firstdefy < 50 && mouse.y - this.firstdefy > -50))){
					this.x += this.dx;
					this.y += Math.cos(this.radians);
					this.defx += this.dx;
					this.defy += Math.sin(this.radians);
					this.radians += this.velocity;
			} else{
				if (this.x < this.firstx || this.x > this.firstx){
					this.x += -this.dx
					this.y += -Math.cos(this.radians);
					this.defx += -this.dx;
					this.defy += -Math.sin(this.radians);
					this.radians -= this.velocity;
				}
			}
		}
		//dirty bug killer
		if (((this.x < 0 || this.x > canvas.width) && (this.defx < 0 || this.defx > canvas.width))
					|| ((this.y < 0 || this.y > canvas.height) && (this.defy < 0 || this.defy > canvas.height))){
			this.x = this.firstx;
			this.y = this.firsty;
			this.defx = this.firstdefx;
			this.defy = this.firstdefy;
			this.radians = this.basicradians;
			console.log('hi');
		}

		this.draw();
	}
}


//array of objects
let linearray;

function init(){
	linearray = [];

	let x = canvas.width/density;
	let y = 0;
	let defx = x;
	let defy = canvas.height/density;
	let flag = false;
	let dx;
	let dy;

	for (let i = 0; i < linenumber; i++) {
		
		for(let i = 0; i < 1; i++){
			dx = (Math.random() - 0.5) * 5;
			dy = randomIntFromRange(1, 4);	
			if (dx == 0){
				i--;
			}
		}
		if (i != 0){
			//horizontal lines
			if (flag == true) {
				x = defx;
				defx = x + canvas.width/density;
					if (x >= canvas.width - c.lineWidth){
						x = 0;
						defx = x + canvas.width/density;
						y = defy + canvas.height/density;
						defy = y;
					}
			} else if (flag == false) {
				//vertical lines
				x = linearray[i-1].x + canvas.width/density;
				defx = x;
				if (x >= canvas.width - c.lineWidth){
					x = canvas.width/density;
					defx = x;
					y = defy;
					defy = y + canvas.height/density;
				}
				//horizontal lines start
				if (y >= canvas.height){
					x = 0;
					defx = x + canvas.width/density;
					y = canvas.height/density;
					defy = y;
					flag = true;
				}
		}

			
		}

		linearray.push(new Line(x, y, defx, defy, dx, flag));
	}
	console.log(linearray);
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < linearray.length; i++) {
		linearray[i].update();

	}
}

init();
animate();