var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth-30;
canvas.height = window.innerHeight-30;
var ctx = canvas.getContext("2d");
var producers=[];
var herbivores=[];
var carnivores=[];
var pollen=[];
var width = canvas.width;
var height = canvas.height;
var numProducers = 50;
var numHerbivores = 20;//20;
var numCarnivores = 0;//10;
var maxSpeed = 10;
var maxSize = 50;
var PI = 3.141592;
var frameNumber  = 0;
var plantNumber = 0;
var maxHealth = 10000;
var areas = [];
var arr = [];
var debug=false;
for(var a = 0; a < 4; a++){
	arr = [];
	areas.push(arr);
	for(var b = 0; b < 4; b++){
		arr=[];
		areas[a].push(arr);
	}
}

if(debug){
	var player = new Object();
	player.position = new Object();
	player.position.x = 50;
	player.position.y = 50;
	player.traits = new Object();
	player.traits.radius=10;
	rightDown = false;
	leftDown = false;
	upDown = false;
	downDown = false;
}

function onKeyDown(evt) {
	if (evt.keyCode == 39) rightDown = true;
	else if (evt.keyCode == 37) leftDown = true;
	else if (evt.keyCode == 38) upDown = true;
	else if (evt.keyCode == 40) downDown = true;
}

function onKeyUp(evt) {
	if (evt.keyCode == 39) rightDown = false;
	else if (evt.keyCode == 37) leftDown = false;
	else if (evt.keyCode == 38) upDown = false;
	else if (evt.keyCode == 40) downDown = false;
}

if(debug){
	$(document).keydown(onKeyDown);
	$(document).keyup(onKeyUp);
}

function addPlantToArea(lifeform){
	if(lifeform.position.x <= (width/4)+lifeform.traits.radius){
		if(lifeform.position.y <= (height/4)+lifeform.traits.radius){
			areas[0][0].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/4)) && (lifeform.position.y <=(height/2)+lifeform.traits.radius)){
			areas[0][1].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/2)) && (lifeform.position.y <=(3*height/4)+lifeform.traits.radius)){
			areas[0][2].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (3*height/4))){
			areas[0][3].push(lifeform);
		}
	}
	if(lifeform.position.x + lifeform.traits.radius >= (width/4) && (lifeform.position.x <= (width/2)+lifeform.traits.radius)){
		if(lifeform.position.y<= (height/4)+lifeform.traits.radius){
			areas[1][0].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/4)) && (lifeform.position.y <=(height/2)+lifeform.traits.radius)){
			areas[1][1].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/2)) && (lifeform.position.y <=(3*height/4)+lifeform.traits.radius)){
			areas[1][2].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (3*height/4))){
			areas[1][3].push(lifeform);
		}
	}
	if(lifeform.position.x + lifeform.traits.radius >= (width/2) && (lifeform.position.x <= (3*width/4)+lifeform.traits.radius)){
		if(lifeform.position.y <= (height/4)+lifeform.traits.radius){
			areas[2][0].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/4)) && (lifeform.position.y <=(height/2)+lifeform.traits.radius)){
			areas[2][1].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/2)) && (lifeform.position.y <=(3*height/4)+lifeform.traits.radius)){
			areas[2][2].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (3*height/4))){
			areas[2][3].push(lifeform);
		}
	}
	if(lifeform.position.x + lifeform.traits.radius >= (3*width/4)){
		if(lifeform.position.y <= (height/4)+lifeform.traits.radius){
			areas[3][0].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/4)) && (lifeform.position.y <=(height/2)+lifeform.traits.radius)){
			areas[3][1].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (height/2)) && (lifeform.position.y <=(3*height/4)+lifeform.traits.radius)){
			areas[3][2].push(lifeform);
		}
		if((lifeform.position.y + lifeform.traits.radius >= (3*height/4))){
			areas[3][3].push(lifeform);
		}
	}
	if(debug){
		for(var i = 0; i < areas.length; i ++){
			for(var q = 0; q < areas.length; q ++){
				if(areas[i][q].length!=0){
					console.log("Plant in " + i + ", " + q);
				}
			}
		}
	}
}

function setup(){
	var lifeform;
	var angle = 0;
	for(var i = 0; i < numProducers; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.id=plantNumber;
		plantNumber++;
		lifeform.traits.pollenRate = Math.ceil(580*Math.random())+20;
		lifeform.traits.pollenSize = (3*Math.random());
		lifeform.traits.reproductionRate = Math.random();
		lifeform.traits.germinationPeriod = Math.ceil(1000*Math.random());
		lifeform.traits.radius = (20*Math.random());
		lifeform.traits.age = 0;
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		var connected = true;
		var found = false;
		var nearby = areas[Math.min(Math.max(Math.floor(4*lifeform.position.x/width),0),3)][Math.min(Math.max(Math.floor(4*lifeform.position.y/height),0),3)];
		while(connected){
			found = false;
			for(var p = 0; !found && p < nearby.length; p++){
				var xDistance = nearby[p].position.x - lifeform.position.x;
				var yDistance = nearby[p].position.y - lifeform.position.y;
				distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
				if(distance<=nearby[p].traits.radius+lifeform.traits.radius){
					found = true;
					lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
					lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
				}
			}
			if(!found){
				connected = false;
			}
		}
		producers.push(lifeform);
		lifeform.traits.index = plantNumber-1;
		addPlantToArea(lifeform);
		console.log("Object " + i + " has id " + producers[i].traits.id);  
	}

	for(var i = 0; i < numHerbivores; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.fullHealth = maxHealth*Math.random();
		lifeform.traits.health = lifeform.traits.fullHealth;
		lifeform.traits.reproductionRate = Math.random();
		lifeform.traits.radius = Math.ceil(30*Math.random());
		lifeform.traits.speed = Math.random()*maxSpeed;
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		angle = 2*PI*Math.random();
		lifeform.velocity.x = Math.cos(angle);
		lifeform.velocity.y = Math.sin(angle);
		herbivores.push(lifeform);
	}

	for(var i = 0; i < numCarnivores; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.fullHealth = maxHealth*Math.random();
		lifeform.traits.health = lifeform.traits.fullHealth;
		lifeform.traits.reproductionRate = Math.random();
		lifeform.traits.radius = Math.ceil(40*Math.random());
		lifeform.traits.speed = Math.random()*maxSpeed;
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		angle = 2*PI*Math.random();
		lifeform.velocity.x = Math.cos(angle);
		lifeform.velocity.y = Math.sin(angle);
		carnivores.push(lifeform);
	}
}

function updateScreen(){
	ctx.fillStyle = "rgba(255,255,255,.2)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if(debug){
		ctx.beginPath();
		ctx.moveTo(width/4,0);
		ctx.lineTo((width/4),(height));
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(width/2,0);
		ctx.lineTo((width/2),(height));
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(3*width/4,0);
		ctx.lineTo((3*width/4),(height));
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0,height/4);
		ctx.lineTo((width),(height/4));
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0,height/2);
		ctx.lineTo((width),(height/2));
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0,3*height/4);
		ctx.lineTo((width),(3*height/4));
		ctx.fill();
		ctx.stroke();
	}
	for (var i = 0; i < producers.length; i++) {
		particle = producers[i];
		ctx.beginPath();
		var colorString = 'rgb(0,255,0)';
		ctx.strokeStyle = colorString;
		ctx.arc(particle.position.x, particle.position.y, particle.traits.radius, 0, 2 * PI);
		ctx.fill();
		ctx.stroke();
	}
	for (var i = 0; i < herbivores.length; i++) {
		particle = herbivores[i];
		ctx.beginPath();
		var colorString = 'rgb(0,0,255)';
		ctx.strokeStyle = colorString;
		ctx.arc(particle.position.x, particle.position.y, particle.traits.radius, 0, 2 * PI);
		ctx.fill();
		ctx.stroke();
	}
	for (var i = 0; i < carnivores.length; i++) {
		particle = carnivores[i];
		ctx.beginPath();
		var colorString = 'rgb(255,0,0)';
		ctx.strokeStyle = colorString;
		ctx.arc(particle.position.x, particle.position.y, particle.traits.radius, 0, 2 * PI);
		ctx.fill();
		ctx.stroke();
	}
	for (var i = 0; i < pollen.length; i++) {
		particle = pollen[i];
		ctx.beginPath();
		var colorString = 'rgb(0,0,0)';
		ctx.strokeStyle = colorString;
		ctx.arc(particle.position.x, particle.position.y, particle.traits.pollenSize, 0, 2 * PI);
		ctx.fill();
		ctx.stroke();
	}
	if(debug){
		ctx.beginPath();
		var colorString = 'rgb(0,255,255)';
		ctx.strokeStyle = colorString;
		ctx.arc(player.position.x, player.position.y, 10, 0, 2 * PI);
		//console.log(player.position.x+" "+player.position.y);
		ctx.fill();
		ctx.stroke();
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveLifeForms(){
	if(debug){
		if(rightDown){
			player.position.x += 5;
		}
		if(leftDown){
			player.position.x -= 5;
		}
		if(upDown){
			player.position.y -= 5;
		}
		if(downDown){
			player.position.y += 5;
		}
	}
	var lifeform;
	for (var i = 0; i < herbivores.length; i++) {
		lifeform = herbivores[i];
		lifeform.traits.health--;
		if(lifeform.traits.health<=0){
			herbivores.splice(i, 1);
		}
		else{
			if(lifeform.position.x+lifeform.traits.radius>width){
				lifeform.velocity.x = -Math.abs(lifeform.velocity.x);
			}
			else if(lifeform.position.x-lifeform.traits.radius<0){
				lifeform.velocity.x = Math.abs(lifeform.velocity.x);
			}
			if(lifeform.position.y+lifeform.traits.radius>height){
				lifeform.velocity.y = -Math.abs(lifeform.velocity.y);
			}
			else if(lifeform.position.y-lifeform.traits.radius<0){
				lifeform.velocity.y = Math.abs(lifeform.velocity.y);
			}
			lifeform.position.x += lifeform.velocity.x;
			lifeform.position.y += lifeform.velocity.y;
		}
	}
	for (var i = 0; i < carnivores.length; i++) {
		lifeform = carnivores[i];
		if(lifeform.position.x+lifeform.traits.radius>width){
			lifeform.velocity.x = -Math.abs(lifeform.velocity.x);
		}
		else if(lifeform.position.x-lifeform.traits.radius<0){
			lifeform.velocity.x = Math.abs(lifeform.velocity.x);
		}
		if(lifeform.position.y+lifeform.traits.radius>height){
			lifeform.velocity.y = -Math.abs(lifeform.velocity.y);
		}
		else if(lifeform.position.y-lifeform.traits.radius<0){
			lifeform.velocity.y = Math.abs(lifeform.velocity.y);
		}
		lifeform.position.x += lifeform.velocity.x;
		lifeform.position.y += lifeform.velocity.y;
	}
}

function movePollen(){
	var gamete;
	for(var i = 0; i < pollen.length; i++){
		gamete = pollen[i];
		if(gamete.position.x+gamete.traits.pollenSize>width){
			pollen.splice(i, 1);
		}
		else if(gamete.position.x-gamete.traits.pollenSize<0){
			pollen.splice(i, 1);
		}
		else if(gamete.position.y+gamete.traits.pollenSize>height){
			pollen.splice(i, 1);
		}
		else if(gamete.position.y-gamete.traits.pollenSize<0){
			pollen.splice(i, 1);
		}
		else{
			gamete.position.x += gamete.velocity.x;
			gamete.position.y += gamete.velocity.y;
		}
	}
}

function generatePollen(){
	var autotroph;
	for(var i = 0; i < producers.length; i++){
		autotroph = producers[i];
		console.log(i + " " + autotroph.traits.index)
		if(autotroph.traits.age <= 0 && frameNumber%autotroph.traits.pollenRate==0){
			var gamete = new Object();
			gamete.position = new Object();
			gamete.velocity = new Object();
			gamete.traits = new Object();
			gamete.traits.pollenRate = autotroph.traits.pollenRate;
			gamete.traits.pollenSize = Math.max(autotroph.traits.pollenSize,0.01);
			gamete.traits.reproductionRate = autotroph.traits.reproductionRate;
			gamete.traits.germinationPeriod = autotroph.traits.germinationPeriod;
			gamete.traits.radius = autotroph.traits.radius;
			gamete.traits.id = autotroph.traits.id;
			gamete.position.x = autotroph.position.x;
			gamete.position.y = autotroph.position.y;
			gamete.velocity.x = 2 * (0.5-Math.random());
			gamete.velocity.y = 2 * (0.5-Math.random());
			pollen.push(gamete);
		}
		else if(autotroph.traits.age > 0){
			autotroph.traits.age--;
		}
	}
}

function newProducer(mother, father){
	var child = new Object();
	child.position = new Object();
	child.velocity = new Object();
	child.traits = new Object();
	child.traits.pollenRate = Math.ceil(((mother.traits.pollenRate+father.traits.pollenRate)/2)+2*(Math.random()-0.5));
	child.traits.pollenSize = (((mother.traits.pollenSize+father.traits.pollenSize)/2)+2*(Math.random()-0.5));
	child.traits.reproductionRate = Math.max(Math.min(((mother.traits.reproductionRate+father.traits.reproductionRate)/2)+0.01*(Math.random()-0.5),1),0); //makes sure this value remains between zero and one
	child.traits.germinationPeriod = ((mother.traits.germinationPeriod+father.traits.germinationPeriod)/2)+6*(Math.random()-0.5);
	child.traits.age = child.traits.germinationPeriod;
	child.traits.radius = Math.max(Math.min(((mother.traits.radius+father.traits.radius)/2)+0.6*(Math.random()-0.5),maxSize),0.5); //makes sure that this value is reasonable
	child.position.x = mother.position.x + 200*(Math.random()-0.5);
	child.position.y = mother.position.y + 200*(Math.random()-0.5);
	var connected = true;
	var found = false;
	var nearby = areas[Math.min(Math.max(Math.floor(4*child.position.x/width),0),3)][Math.min(Math.max(Math.floor(4*child.position.y/height),0),3)];
	while(connected){
		found = false;
		for(var p = 0; !found && p < nearby.length; p++){
			var xDistance = nearby[p].position.x - child.position.x;
			var yDistance = nearby[p].position.y - child.position.y;
			distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
			if(distance<=nearby[p].traits.radius+child.traits.radius){
				found = true;
				child.position.x = mother.position.x + 200*(Math.random()-0.5);
				child.position.y = mother.position.y + 200*(Math.random()-0.5);
			}
		}
		if(!found){
			connected = false;
		}
	}
	child.traits.index = plantNumber;
	child.traits.id = plantNumber;
	plantNumber++;
	producers.push(child);
	addPlantToArea(child);
}

function reproduce(){
	var xDistance = 0;
	var yDistance = 0;
	var distance = 0;
	var producer = new Object();
	var gamete;
	var area;
	var found;
	for(var g = 0; g < pollen.length; g++){
		gamete = pollen[g];
		found = false;
		//console.log("X is "+Math.max(Math.floor(4*gamete.position.x/width),0));
		//console.log("Y is "+Math.max(Math.floor(4*gamete.position.y/height),0));
		//console.log("The number of potential collisions is " + areas[Math.floor(4*gamete.position.x/width)][Math.floor(4*gamete.position.y/height)].length);
		area = areas[Math.min(Math.max(Math.floor(4*gamete.position.x/width),0),3)][Math.min(Math.max(Math.floor(4*gamete.position.y/height),0),3)];
		for(var p = 0; p < area.length; p++){
			if(area[p].traits.age<=0){
				//console.log("P is " + p);
				producer = area[p];
				var xDistance = producer.position.x - gamete.position.x;
				var yDistance = producer.position.y - gamete.position.y;
				distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
				if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize && Math.random()<producer.traits.reproductionRate){
					newProducer(producer, gamete);
					pollen.splice(g, 1);
					found = true;
				}
				else if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize){
					pollen.splice(g, 1);
					found = true;
				}
			}
		}
	}
	//Todo: herbivore and carnivore reproduction
}

function consume(){
	var xDistance = 0;
	var yDistance = 0;
	var distance = 0;
	var predator;
	var food;
	var area;
	for(var p = 0; p < herbivores.length; p++){
		predator = herbivores[p];
		area = areas[Math.min(Math.max(Math.floor(4*predator.position.x/width),0),3)][Math.min(Math.max(Math.floor(4*predator.position.y/height),0),3)];
		for(var f = 0; f < area.length; f++){
			food = area[f];
			var xDistance = predator.position.x - food.position.x;
			var yDistance = predator.position.y - food.position.y;
			distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
			if(distance<=predator.traits.radius+food.traits.radius){
				predator.traits.health=Math.min(predator.traits.fullHealth, predator.traits.health+Math.pow(food.traits.radius,2));
				plantNumber--;
				producers.splice(food.traits.index, 1);
				area.splice(f, 1);
				for(var i=0; i < producers.length; i++){
					producers[i].traits.index=i
				}
			}
		}
	}
	if(debug){
		area = areas[Math.min(Math.max(Math.floor(4*player.position.x/width),0),3)][Math.min(Math.max(Math.floor(4*player.position.y/height),0),3)];
		console.log("Player is in area " + Math.min(Math.max(Math.floor(4*player.position.x/width),0),3) + ", " + Math.min(Math.max(Math.floor(4*player.position.y/height),0),3));
		for(var f = 0; f < area.length; f++){
			food = area[f];
			var xDistance = player.position.x - food.position.x;
			var yDistance = player.position.y - food.position.y;
			distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
			if(distance<=player.traits.radius+food.traits.radius){
				plantNumber--;
				producers.splice(food.traits.index, 1);
				area.splice(f, 1);
				for(var i = 0; i < producers.length; i++){
					producers[i].traits.index=i
				}
			}
		}
	}
	//Todo: carnivore consumption
}

function move(){
	frameNumber++;
	moveLifeForms();
	movePollen();
	generatePollen();
	reproduce();
	consume();
	//console.log(plantNumber);
}

setup();
function main() {
	move();
	updateScreen();
	requestAnimationFrame(main);
};
requestAnimationFrame(main);
