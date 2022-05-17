let xSpacing = 50;
let ySpacing = xSpacing;
let numOfParticles = 2000;

let particles = [];
let deletedParticles = [];
let xBound = 0;
let yBound = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	xBound = width*0.5/xSpacing;
	yBound = height*0.5/xSpacing;
	for (let i = 0; i < numOfParticles; i++){
		particles.push(new Particle(random(xBound*2)-xBound, random(yBound*2)-yBound));
	}
	//set the maximum framerate to 60fps
	frameRate(60);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	xBound = width*0.5/xSpacing;
	yBound = height*0.5/xSpacing;
}

function constantBackground() {
	//general background
	push();
	stroke(220);
	strokeWeight(3);
	//line(width/2, 0, width/2, height);
	//line(0, height/2, width, height/2);
	pop();

	//grid
	push();
	translate(width/2, height/2);
	push();
	stroke(220,40);
	strokeWeight(1);
	for (let i = 0; i < width/2; i += xSpacing) {
		line(i, -height/2, i, height);
		line(-i, -height/2, -i, height/2);
	}
	
	for (let i = 0; i < height/2; i += ySpacing) {
		line(-width/2, i, width, i);
		line(-width/2, -i, width/2, -i);
	}
	
	push();
	stroke(220);
	for (let i = 0; i < width/2; i += xSpacing) {
		line(i, -6, i, 6);
		line(-i, -6, -i, 6);
	}
	
	for (let i = 0; i < height/2; i += ySpacing) {
		line(-6, i, 6, i);
		line(-6, -i, 6, -i);
	}
	pop();
	pop();
	drawArrorField();
	
}

function drawArrow(base, vec) {
	push();
	translate(base.x, base.y);
	line(0, 0, vec.x, vec.y);
	rotate(vec.heading());
	let arrowSize = 7;
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
}

function draw() {
	push();
	background(20);
	constantBackground();
	pop();
	
	particles.forEach(element => {
		element.applyForce(vectorField(element.pos.x, element.pos.y).normalize());
		element.update();
		element.display();
	});
	//use the deletedParticles array to delete the particles that have been deleted
	let i = 0;
	textSize(20);
	stroke(0,0);
	fill(255)
	//display the fps in the top left corner
	text(floor(frameRate()), 10, 20);
	//text("Mouse: " + (mouseX-width/2)/xSpacing + ", " + (-mouseY + height/2)/ySpacing, 10, 40);

	//remove particles that are off the screen and add new ones
	particles = particles.filter(element => {
		if (element.deathTime > 0) {
		return element.pos.x > -width/2/xSpacing && element.pos.x < width/2/xSpacing && element.pos.y/ySpacing > -height/2 && element.pos.y < height/2/ySpacing;
		}
	});
	while (particles.length < numOfParticles){
		particles.push(new Particle(random(width/xSpacing)-width/xSpacing/2, random(height/ySpacing)-height/ySpacing/2));
	}
}

function mouseDragged() {
	prtcl = new Particle((mouseX-width/2)/xSpacing, (mouseY - height/2)/-ySpacing);
	prtcl.deathTime = 100;
	particles.push(prtcl);
}

function drawArrorField() {
	stroke(120,200,200);
	fill(120,200,200);

	for (let x = 0; x < xBound; x++) {
		for (let y = 0; y < yBound; y++) {
			if (x == 0 && y == 0) {
				continue;
			}
			let source = createVector(x*xSpacing, - y*ySpacing); //top right quadrant
			let vec = vectorField(x, y);
			vec.y = -vec.y; //y direction is flipped
			if (vec.mag() > 0){ //only draw the arrow if the vector is non zero
				vec.normalize();
				drawArrow(source.sub(vec.mult(10)), vec.mult(2));
			}
		}
		for (let y = -1; y > -height/2/ySpacing; y--) {
			if (x == 0 && y == 0) {
				continue;
			}
			let source = createVector(x*xSpacing, - y*ySpacing); //bottom right quadrant
			let vec = vectorField(x, y);
			vec.y = -vec.y; //y direction is flipped
			if (vec.mag() > 0){ //only draw the arrow if the vector is non zero
				vec.normalize();
				drawArrow(source.sub(vec.mult(10)), vec.mult(2));
			}
		}
		
	}
	for (let x = -1; x > -xBound; x--) {
		for (let y = 0; y < yBound; y++) {
			if (x == 0 && y == 0) {
				continue;
			}
			let source = createVector(x*xSpacing, - y*ySpacing); //top right quadrant
			let vec = vectorField(x, y);
			vec.y = -vec.y; //y direction is flipped
			if (vec.mag() > 0){ //only draw the arrow if the vector is non zero
				vec.normalize();
				drawArrow(source.sub(vec.mult(10)), vec.mult(2));
			}
		}
		for (let y = -1; y > -height/2/ySpacing; y--) {
			if (x == 0 && y == 0) {
				continue;
			}
			let source = createVector(x*xSpacing, - y*ySpacing); //bottom right quadrant
			let vec = vectorField(x, y);
			vec.y = -vec.y; //y direction is flipped
			if (vec.mag() > 0){ //only draw the arrow if the vector is non zero
				vec.normalize();
				drawArrow(source.sub(vec.mult(10)), vec.mult(2));
			}
		}
		
	}
}

//this function returns a vector that is the the value of the vector field at the given point in the grid (x,y) 
function vectorField(x, y){
	//return createVector(-y,x);
	
	//return createVector((exp(x)/(pow(x,2) + pow(x,2)))*(x*sin(y)-y*cos(y)), (exp(x)/(pow(x,2) + pow(x,2)))*(y*sin(y)+x*cos(y)));
	
	//return createVector(sin(y),sin(exp(max((x+sin(x)),sqrt(x*x+y*y))))*x);

	//return createVector(y, max((sin(y)-x),(exp(y)-sin((x-y)))));
	
	//return createVector(-y/(x*x+y*y), x/(x*x+y*y));
	
	//return createVector(cos(x), sin(y));

	//return createVector(cos((cos(sqrt(x*x+y*y))-max(sqrt(x*x+y*y),sin(x)))),0);

	return createVector(y,min(sin(sqrt(x*x+y*y))*sin(x)/x,y*cos((y+abs(x)))));

	//return createVector((cos(sqrt(x*x+y*y))+y),sin(cos(min(y,x)))*cos(y));
	
	//return createVector(sin(sqrt(x*x+y*y)),min(sin(x),y));
}

//function interpalate between three colors based on the angle
function colorFromAngle(angle) {
	let part = map(angle, -PI, PI, 0, 3, true);
	if (part <= 1){
		return color(255*(1-part) + 60*part,0,85*(1-part) + 255*part);
	}
	if (part <= 2){
		return color(60*(2-part),255*(part-1),255*(2-part) + 106*(part-1));
	}
	else{
		return color(255*(part-2), 255*(3-part), 106*(3-part) + 85*(part-2	));
	}

	//return color(255, 255, 255);
}

function Particle(x, y) {
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.massRed = 0.1;
	this.trail = [];
	this.maxTrail = 3;
	this.deathTime = random(0, 8);
	for (let i = 0; i < this.maxTrail; i++) {
		this.trail.push(createVector(x, y));
	}

	this.applyForce = function(force) {
		this.vel.x = 0;
		this.vel.y = 0;
		this.vel.add(force).mult(this.massRed);
	}
	this.update = function() {
		this.pos.add(this.vel);
		this.trail.push(this.pos.copy());
		this.trail.shift();
	}
	this.display = function() {
		this.deathTime -= 1;
		push();
		try {
			stroke(colorFromAngle(this.vel.heading()), this.deathTime*51);
		} catch (error) {
			print(this.vel.heading());
		}
		noFill();
		translate(width/2, height/2);
		strokeWeight(1);
		beginShape();
		for (let i = 0; i < this.trail.length; i++) {
			vertex(this.trail[i].x*xSpacing, -this.trail[i].y*ySpacing);
		}
		endShape();
		pop();	
	}

	this.setDeathTime = function(time) {
		this.deathTime = time;
	}
}

//when the user presses "+" or "-" the number of particles will change by 1000 or -1000 respectively
function keyPressed() {
	if (keyCode == 107) {
		numOfParticles += 1000;
		print(numOfParticles);
	} else if (keyCode == 109) {
		numOfParticles -= 1000;
		print(numOfParticles);
	}
}