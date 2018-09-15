var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var particlesnumber = 150;
var alpha = 0.03;
var minAlpha = 0;

var colorArray = [
	'rgba(45, 17, 44, ',
	'rgba(83, 0, 49, ',
	'rgba(130, 2, 51, ',
	'rgba(202, 41, 62, ',
	'rgba(239, 67, 57, '
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
function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function distance(x1, y1, x2, y2){
	let xDist = x2 - x1;
	let yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
function randomColor(color){
	return color[Math.floor(Math.random() * color.length)];
}
//----------------
//object creation
//----------------
function Particle(x, y, radius){
	this.x = x;
	this.y = y;
	this.velocity = {
		x: (Math.random() - 0.5)*3,
		y: (Math.random() - 0.5)*3
	}
	this.radius = radius;
	this.color = randomColor(colorArray);
	this.alpha = minAlpha;
	this.mass = 1;

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		c.strokeStyle = this.color + '1)';
		c.stroke();
		c.fillStyle = this.color + this.alpha + ')';
		c.fill();
		c.closePath();
	}
	this.update = function(particlesarray){
		this.draw();
		if (mouse.x - this.x < 120 && mouse.x - this.x > -120 
			&& mouse.y - this.y < 120 && mouse.y - this.y > -120 && this.alpha <= 0.7){
			this.alpha += alpha;
		} else if (this.alpha > minAlpha) {
			this.alpha -= alpha;
		}
		//collision detection
		for (let i = 0; i < particlesarray.length; i++) {
			if(this == particlesarray[i]) continue;
			if(distance(this.x, this.y, particlesarray[i].x, particlesarray[i].y) - (particlesarray[i].radius + this.radius) < 0){
				resolveCollision(this, particlesarray[i]);
			}
		}
		if (this.x + this.radius + this.velocity.x > canvas.width || this.x + this.velocity.x < this.radius){
			this.velocity.x = -this.velocity.x;
		} 
		if (this.y + this.radius + this.velocity.y > canvas.height || this.y + this.velocity.y < this.radius) {
			this.velocity.y = -this.velocity.y;
		}
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
}
//-----------------
//array of circles
//-----------------
let particlesarray;

function init(){
	particlesarray = [];

	for (let i = 0; i < particlesnumber; i++) {
		let radius = randomIntFromRange(5, 30);
		let x = randomIntFromRange(radius, canvas.width - radius);
		let y = randomIntFromRange(radius, canvas.height - radius);

		if(i!= 0){
			for (let j = 0; j < particlesarray.length; j++) {
				if(distance(x, y, particlesarray[j].x, particlesarray[j].y) - (particlesarray[j].radius + radius) < 0){
					radius = randomIntFromRange(5, 30);
					x = randomIntFromRange(radius, canvas.width - radius);
					y = randomIntFromRange(radius, canvas.height - radius);
			 		j = -1;
				}
			}
		}
		particlesarray.push(new Particle(x, y, radius));
	}
}
init();

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < particlesarray.length; i++) {
		particlesarray[i].update(particlesarray);
	}
}

animate();