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
var numHerbivores = 0;//20;
var numCarnivores = 0;//10;
var maxSpeed = 10;
var maxSize = 50;
var PI = 3.141592;
var frameNumber=0;
var plantNumber = 0;
var areas = [];
var arr = [];
for(var a = 0; a < 4; a++){
	arr = [];
	areas.push(arr);
	for(var b = 0; b < 4; b++){
		arr=[];
		areas[a].push(arr);
	}
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
	if(lifeform.position.x + lifeform.traits.radius >= (3*width/2)){
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
		addPlantToArea(lifeform);
	}

	for(var i = 0; i < numHerbivores; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.health = 10000;
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

		lifeform.traits.health = 1000;
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
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveLifeForms(){
	var lifeform;
	for (var i = 0; i < herbivores.length; i++) {
		lifeform = herbivores[i];
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
	for(var g = 0; g < pollen.length; g++){
		gamete = pollen[g];
		console.log("X is "+Math.max(Math.floor(4*gamete.position.x/width),0));
		console.log("Y is "+Math.max(Math.floor(4*gamete.position.y/height),0));
		//console.log("The number of potential collisions is " + areas[Math.floor(4*gamete.position.x/width)][Math.floor(4*gamete.position.y/height)].length);
		for(var p = 0; p < areas[Math.min(Math.max(Math.floor(4*gamete.position.x/width),0),3)][Math.min(Math.max(Math.floor(4*gamete.position.y/height),0),3)].length; p++){
			if(producers[p].traits.age<=0){
				//console.log("P is " + p);
				producer = areas[Math.min(Math.max(Math.floor(4*gamete.position.x/width),0),3)][Math.min(Math.max(Math.floor(4*gamete.position.y/height),0),3)][p];
				var xDistance = producer.position.x - gamete.position.x;
				var yDistance = producer.position.y - gamete.position.y;
				distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
				if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize && Math.random()<producer.traits.reproductionRate){
					newProducer(producer, gamete);
					pollen.splice(g, 1);
				}
				else if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize){
					pollen.splice(g, 1);
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
	var preditor;
	var food;
	for(var p = 0; p < producers.length; p++){
		if(producers[p].traits.age<=0){
			producer = producers[p];
			for(var g = 0; g < pollen.length; g++){
				gamete = pollen[g];
				var xDistance = producer.position.x - gamete.position.x;
				var yDistance = producer.position.y - gamete.position.y;
				distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
				if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize && Math.random()<producer.traits.reproductionRate){
					newProducer(producer, gamete);
					pollen.splice(g, 1);
				}
				else if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize){
					pollen.splice(g, 1);
				}
			}
		}
	}
}

function move(){
	frameNumber++;
	moveLifeForms();
	movePollen();
	generatePollen();
	reproduce();
	//consume();
	console.log(plantNumber);
}

setup();
function main() {
	move();
	updateScreen();
	requestAnimationFrame(main);
};
requestAnimationFrame(main);
