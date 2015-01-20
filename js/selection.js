var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth-30;
canvas.height = window.innerHeight-50;
var ctx = canvas.getContext("2d");
var producers=[];
var herbivores=[];
var carnivores=[];
var pollen=[];
var width = canvas.width;
var height = canvas.height;
var numProducers = 100;
var numHerbivores = 30;
var numCarnivores = 8;
var maxSpeed = 3;
var maxSize = 70;
var maxPollenSize = 3;
var PI = 3.141592;
var frameNumber  = 0;
var plantNumber = 0;
var maxHealth = 5000;
var maxProducers = 1000;
var gridSize=40;
var areas = [];
var arr = [];
var data = [];
var logging = "";
var graph = false;
var debug = false;
var maxNutrients=100;
var maxDeplenishRate = 30;
for(var a = 0; a < gridSize; a++){
	arr = [];
	areas.push(arr);
	for(var b = 0; b < gridSize; b++){
		arr=[];
		areas[a].push(arr);
		areas[a][b]=new Object();
		areas[a][b].plants=[];
		areas[a][b].nutrients=maxNutrients;
		areas[a][b].oldNutrients = areas[a][b].nutrients;
	}
}

function addPlantToArea(lifeform){
	var possibleX = [];
	var possibleY = [];
	for(var x = 0; x < gridSize; x++){
		if(lifeform.position.x + lifeform.traits.radius + maxSize >= ((x)*width/gridSize) && (lifeform.position.x <= ((x+1)*width/gridSize) + lifeform.traits.radius + maxSize)){
			possibleX.push(x);
		}
	}
	for(var y = 0; y < gridSize; y++){
		if(lifeform.position.y + lifeform.traits.radius + maxSize >= ((y)*height/gridSize) && (lifeform.position.y <= ((y+1)*height/gridSize) + lifeform.traits.radius + maxSize)){
			possibleY.push(y);
		}
	}
	for(var x = 0; x < possibleX.length; x++){
		for(var y = 0; y < possibleY.length; y++){
			areas[possibleX[x]][possibleY[y]].plants.push(lifeform);
		}
	}
}
function getArea(obj){
	var x = Math.min(Math.max(Math.floor(gridSize*obj.position.x/width),0),gridSize-1);
	var y = Math.min(Math.max(Math.floor(gridSize*obj.position.y/height),0),gridSize-1);
	return areas[x][y];
}
function getPlants(obj){
	var x = Math.min(Math.max(Math.floor(gridSize*obj.position.x/width),0),gridSize-1);
	var y = Math.min(Math.max(Math.floor(gridSize*obj.position.y/height),0),gridSize-1);
	return areas[x][y].plants;
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
		lifeform.traits.pollenPeriod = Math.ceil(400*Math.random());
		lifeform.traits.pollenSize = (3*Math.random());
		lifeform.traits.reproductionRate = Math.random();
		lifeform.traits.germinationPeriod = Math.ceil(1200*Math.random());
		lifeform.traits.radius = (20*Math.random());
		lifeform.traits.age = 0;
		lifeform.traits.alive = true;
		lifeform.traits.nutrientDemand = Math.max(maxDeplenishRate * Math.random(),1);
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		var connected = true;
		var found = false;
		var nearby = getPlants(lifeform);
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
	}

	for(var i = 0; i < numHerbivores; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.age = 0;
		lifeform.traits.growthPeriod = Math.ceil(1600*Math.random());
		lifeform.traits.fullHealth = maxHealth*Math.random();
		lifeform.traits.health = lifeform.traits.fullHealth;
		lifeform.traits.reproductionRate = 0.75 + 0.25 * Math.random();
		lifeform.traits.radius = Math.ceil(30*Math.random());
		lifeform.traits.mass = Math.pow(lifeform.traits.radius,2);
		lifeform.traits.speed = Math.random()*maxSpeed;
		lifeform.traits.eaten = false;
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		angle = 2*PI*Math.random();
		lifeform.velocity.x = lifeform.traits.speed*Math.cos(angle);
		lifeform.velocity.y = lifeform.traits.speed*Math.sin(angle);
		herbivores.push(lifeform);
		lifeform.traits.index = plantNumber-1;
	}

	for(var i = 0; i < numCarnivores; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.age = 0;
		lifeform.traits.growthPeriod = Math.ceil(1000*Math.random());
		lifeform.traits.fullHealth = 2*maxHealth*Math.random();
		lifeform.traits.health = lifeform.traits.fullHealth;
		lifeform.traits.reproductionRate = Math.random()*0.5+0.5;
		lifeform.traits.radius = Math.ceil(40*Math.random());
		lifeform.traits.speed = Math.random()*maxSpeed/2;
		lifeform.traits.eaten = false;
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		angle = 2*PI*Math.random();
		lifeform.velocity.x = lifeform.traits.speed*Math.cos(angle);
		lifeform.velocity.y = lifeform.traits.speed*Math.sin(angle);
		carnivores.push(lifeform);
	}
}

function updateScreen(){
	ctx.fillStyle = "rgba(255,255,255,.2)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if(debug){
		for(var x = 0; x < areas.length; x++){
			for(var y = 0; y < areas[x].length; y++){
				ctx.beginPath();
				ctx.fillStyle = 'rgba(' + Math.floor(255-255*areas[x][y].nutrients/maxNutrients) + ',0,' + Math.floor(255*areas[x][y].nutrients/maxNutrients) + ',0.2)';
				ctx.rect(x*width/(gridSize), y*height/(gridSize), (x+1)*width/(gridSize), (y+1)*height/(gridSize));
				ctx.fill();
			}
		}
	}
	for (var i = 0; i < producers.length; i++) {
		particle = producers[i];
		if(!particle.traits.alive){
			producers.splice(i, 1);
			i--;
		}
		else{
			ctx.beginPath();
			var colorString = 'rgb(0,255,0)';
			ctx.strokeStyle = colorString;
			ctx.arc(particle.position.x, particle.position.y, particle.traits.radius, 0, 2 * PI);
			ctx.fill();
			ctx.stroke();
		}
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
		lifeform.traits.health--;
		if(lifeform.traits.age > 0){
			lifeform.traits.age--;
		}
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
		lifeform.traits.health--;
		if(lifeform.traits.age > 0){
			lifeform.traits.age--;
		}
		if(lifeform.traits.health<=0){
			carnivores.splice(i, 1);
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

function getNutrients(){
	for(var i = 0; i < producers.length; i++){
		var p = producers[i];
		var area = getArea(p);
		if(area.nutrients >= p.traits.nutrientDemand){
			area.nutrients-=p.traits.nutrientDemand;
		}
		else{
			plantNumber--;
			p.traits.alive=false;
			producers.splice(i, 1);
			for(var j=0; j < producers.length; j++){
				producers[j].traits.index=j;
			}
		}
	}
}

function replenishNutrients(){
	for(var x = 0; x < areas.length; x++){
		for(var y = 0; y < areas[x].length; y++){
			areas[x][y].oldNutrients = areas[x][y].nutrients;
			if(areas[x][y].nutrients<maxNutrients){
				areas[x][y].nutrients+=1;
			}
			if(x > 0 && x < areas.length-1 && y > 0 && y < areas[x].length-1){
				var avg = (areas[x][y].oldNutrients+areas[x+1][y].nutrients+areas[x-1][y].oldNutrients+areas[x][y-1].oldNutrients+areas[x][y+1].nutrients+areas[x+1][y+1].nutrients+areas[x-1][y+1].oldNutrients+areas[x+1][y-1].nutrients+areas[x-1][y-1].oldNutrients)/9;
				var dispRate = 2;
				areas[x][y].nutrients = (dispRate*areas[x][y].nutrients + avg)/(1+dispRate);
/*				areas[x][y+1].nutrients = (dispRate*areas[x][y+1].nutrients + avg)/(1+dispRate);
				areas[x][y-1].nutrients = (dispRate*areas[x][y-1].nutrients + avg)/(1+dispRate);
				areas[x+1][y].nutrients = (dispRate*areas[x+1][y].nutrients + avg)/(1+dispRate);
				areas[x+1][y+1].nutrients = (dispRate*areas[x+1][y+1].nutrients + avg)/(1+dispRate);
				areas[x+1][y-1].nutrients = (dispRate*areas[x+1][y-1].nutrients + avg)/(1+dispRate);
				areas[x-1][y].nutrients = (dispRate*areas[x-1][y].nutrients + avg)/(1+dispRate);
				areas[x-1][y+1].nutrients = (dispRate*areas[x-1][y+1].nutrients + avg)/(1+dispRate);
				areas[x-1][y-1].nutrients = (dispRate*areas[x-1][y-1].nutrients + avg)/(1+dispRate);
*/			}
		}
	}
}

function generatePollen(){
	var autotroph;
	for(var i = 0; i < producers.length; i++){
		autotroph = producers[i];
		if(autotroph.traits.age <= 0 && frameNumber%autotroph.traits.pollenPeriod==0){
			var gamete = new Object();
			gamete.position = new Object();
			gamete.velocity = new Object();
			gamete.traits = new Object();
			gamete.traits.pollenPeriod = autotroph.traits.pollenPeriod;
			gamete.traits.pollenSize = Math.max(autotroph.traits.pollenSize,0.01);
			gamete.traits.reproductionRate = autotroph.traits.reproductionRate;
			gamete.traits.germinationPeriod = autotroph.traits.germinationPeriod;
			gamete.traits.radius = autotroph.traits.radius;
			gamete.traits.id = autotroph.traits.id;
			gamete.traits.nutrientDemand = autotroph.traits.nutrientDemand;
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
	child.traits.pollenPeriod = Math.ceil(((mother.traits.pollenPeriod+father.traits.pollenPeriod)/2)+10*(Math.random()-0.5));
	child.traits.pollenSize = (((mother.traits.pollenSize+father.traits.pollenSize)/2)+2*(Math.random()-0.5));
	child.traits.reproductionRate = Math.max(Math.min(((mother.traits.reproductionRate+father.traits.reproductionRate)/2)+0.1*(Math.random()-0.5),1),0); //makes sure this value remains between zero and one
	child.traits.germinationPeriod = ((mother.traits.germinationPeriod+father.traits.germinationPeriod)/2)+10*(Math.random()-0.5);
	child.traits.age = child.traits.germinationPeriod;
	child.traits.radius = Math.max(Math.min(((mother.traits.radius+father.traits.radius)/2)+1*(Math.random()-0.5),maxSize),0.5); //makes sure that this value is reasonable
	child.traits.alive = true;
	child.traits.nutrientDemand = Math.max(Math.min(((mother.traits.nutrientDemand+father.traits.nutrientDemand)/2),maxDeplenishRate),1); 
	child.position.x = mother.position.x + 200*(Math.random()-0.5);
	child.position.y = mother.position.y + 200*(Math.random()-0.5);
	var connected = true;
	var found = false;
	var nearby = getPlants(child);
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
function newHerbivore(mother, father){
	var child = new Object();
	child.position = new Object();
	child.velocity = new Object();
	child.traits = new Object();
	child.traits.fullHealth = Math.ceil(((mother.traits.fullHealth+father.traits.fullHealth)/2)+100*(Math.random()-0.5));
	child.traits.health = child.traits.fullHealth;
	child.traits.reproductionRate = Math.max(Math.min(((mother.traits.reproductionRate+father.traits.reproductionRate)/2)+0.1*(Math.random()-0.5),1),0); //makes sure this value remains between zero and one
	child.traits.growthPeriod = ((mother.traits.growthPeriod+father.traits.growthPeriod)/2)+10*(Math.random()-0.5);
	child.traits.age = child.traits.growthPeriod;
	child.traits.radius = Math.max(Math.min(((mother.traits.radius+father.traits.radius)/2)+1*(Math.random()-0.5),maxSize),1); //makes sure that this value is reasonable
	child.traits.mass = Math.pow(child.traits.radius,2);
	child.position.x = (mother.position.x + father.position.x)/2;
	child.position.y = (mother.position.y + father.position.y)/2;
	child.traits.speed = Math.max(Math.min(mother.traits.speed+father.traits.speed+0.4*(Math.random()-0.5),maxSpeed),0.1);
	var angle = 2*PI*Math.random();
	child.velocity.x = child.traits.speed*Math.cos(angle);
	child.velocity.y = child.traits.speed*Math.sin(angle);
	herbivores.push(child);
}
function newCarnivore(mother, father){
	var child = new Object();
	child.position = new Object();
	child.velocity = new Object();
	child.traits = new Object();
	child.traits.fullHealth = Math.ceil(((mother.traits.fullHealth+father.traits.fullHealth)/2)+100*(Math.random()-0.5));
	child.traits.health = child.traits.fullHealth;
	child.traits.reproductionRate = Math.max(Math.min(((mother.traits.reproductionRate+father.traits.reproductionRate)/2)+0.1*(Math.random()-0.5),1),0); //makes sure this value remains between zero and one
	child.traits.growthPeriod = ((mother.traits.growthPeriod+father.traits.growthPeriod)/2)+10*(Math.random()-0.5);
	child.traits.age = child.traits.growthPeriod;
	child.traits.radius = Math.max(Math.min(((mother.traits.radius+father.traits.radius)/2)+1*(Math.random()-0.5),maxSize),1); //makes sure that this value is reasonable
	child.traits.mass = Math.pow(child.traits.radius,2);
	child.position.x = (mother.position.x + father.position.x)/2;
	child.position.y = (mother.position.y + father.position.y)/2;
	child.traits.speed = Math.max(Math.min(mother.traits.speed+father.traits.speed+0.4*(Math.random()-0.5),maxSpeed),0.1);
	var angle = 2*PI*Math.random();
	child.velocity.x = child.traits.speed*Math.cos(angle);
	child.velocity.y = child.traits.speed*Math.sin(angle);
	carnivores.push(child);
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
		area = getPlants(gamete);
		for(var p = 0; p < area.length; p++){
			producer = area[p];
			if(producer.traits.alive){
				var xDistance = producer.position.x - gamete.position.x;
				var yDistance = producer.position.y - gamete.position.y;
				distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
				if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize && Math.random()<producer.traits.reproductionRate){
					if(area[p].traits.age<=0 && maxProducers>=numProducers){
						newProducer(producer, gamete);
					}
					pollen.splice(g, 1);
					found = true;
				}
				else if(producer.traits.id != gamete.traits.id && distance<=producer.traits.radius+gamete.traits.pollenSize){	
					pollen.splice(g, 1);
					found = true;
				}
			}
			else{
				area.splice(p, 1);
			}
		}
	}
	var herbivore1;
	var herbivore2;
	for(var h1 = 0; h1 < herbivores.length; h1++){
		herbivore1=herbivores[h1];
		for(var h2 = h1+1; h2 < herbivores.length; h2++){
			herbivore2=herbivores[h2];
			var xDistance = herbivore1.position.x - herbivore2.position.x;
			var yDistance = herbivore1.position.y - herbivore2.position.y;
			distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
			if(distance<=herbivore1.traits.radius+herbivore2.traits.radius && Math.random()<(herbivore1.traits.reproductionRate+herbivore2.traits.reproductionRate)/2){
				if(herbivore1.traits.age <= 0 && herbivore2.traits.age <= 0 && herbivore1.traits.eaten && herbivore2.traits.eaten){
					var numChilds = Math.ceil(Math.random() * 6);
					for(var i = 0; i < numChilds; i++){
						newHerbivore(herbivore1, herbivore2);
					}
					herbivore1.traits.age = 2*herbivore1.traits.growthPeriod/3;
					herbivore2.traits.age = 2*herbivore2.traits.growthPeriod/3;
				}
			}
			else if(distance<=herbivore1.traits.radius+herbivore2.traits.radius && herbivore1.traits.age <= 0 && herbivore2.traits.age <= 0){
				herbivore1.traits.age = 2*herbivore1.traits.growthPeriod/3;
				herbivore2.traits.age = 2*herbivore2.traits.growthPeriod/3;
			}
		}
	}
	var carnivore1;
	var carnivore2;
	for(var h1 = 0; h1 < carnivores.length; h1++){
		carnivore1=carnivores[h1];
		for(var h2 = h1+1; h2 < carnivores.length; h2++){
			carnivore2=carnivores[h2];
			var xDistance = carnivore1.position.x - carnivore2.position.x;
			var yDistance = carnivore1.position.y - carnivore2.position.y;
			distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
			if(distance<=carnivore1.traits.radius+carnivore2.traits.radius && Math.random()<(carnivore1.traits.reproductionRate+carnivore2.traits.reproductionRate)/2){
				if(carnivore1.traits.age <= 0 && carnivore2.traits.age <= 0 && carnivore1.traits.eaten && carnivore2.traits.eaten){
					newCarnivore(carnivore1, carnivore2);
					carnivore1.traits.age = 2*carnivore1.traits.growthPeriod/3;
					carnivore2.traits.age = 2*carnivore2.traits.growthPeriod/3;
				}
			}
			else if(distance<=carnivore1.traits.radius+carnivore2.traits.radius && carnivore1.traits.age <= 0 && carnivore2.traits.age <= 0){
				carnivore1.traits.age = 2*carnivore1.traits.growthPeriod/3;
				carnivore2.traits.age = 2*carnivore2.traits.growthPeriod/3;
			}
		}
	}
}

function consume(){
	var xDistance = 0;
	var yDistance = 0;
	var distance = 0;
	var predator;
	var food;
	var area;
	var full;
	for(var p = 0; p < herbivores.length; p++){
		predator = herbivores[p];
		area = getPlants(predator);
		full = false;
		for(var f = 0; f < area.length && !full; f++){
			food = area[f];
			if(food.traits.alive){
				var xDistance = predator.position.x - food.position.x;
				var yDistance = predator.position.y - food.position.y;
				distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
				if(distance<=predator.traits.radius+food.traits.radius){
					predator.traits.health=Math.min(predator.traits.fullHealth, predator.traits.health+Math.pow(food.traits.radius,2));
					predator.traits.eaten=true;
					plantNumber--;
					food.traits.alive=false;
					producers.splice(food.traits.index, 1);
					area.splice(f, 1);
					full=true;
					for(var i=0; i < producers.length; i++){
						producers[i].traits.index=i;
					}
				}
			}
			else{
				area.splice(f, 1);
			}
		}
	}
	for(var p = 0; p < carnivores.length; p++){
		predator = carnivores[p];
		for(var f = 0; f < herbivores.length; f++){
			food = herbivores[f];
			var xDistance = predator.position.x - food.position.x;
			var yDistance = predator.position.y - food.position.y;
			distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
			if(distance<=predator.traits.radius+food.traits.radius){
				predator.traits.health=Math.min(predator.traits.fullHealth, predator.traits.health+Math.pow(food.traits.radius,2));
				predator.traits.eaten=true;
				plantNumber--;
				herbivores.splice(food.traits.index, 1);
				for(var i=0; i < herbivores.length; i++){
					herbivores[i].traits.index=i;
				}
			}
		}
	}
}

function logData(){
	if(logging=="Population sizes"){
		data.push(producers.length);
		data.push(herbivores.length);
		data.push(carnivores.length);
	}
	else if(logging=="Germination period"){
		var avgGermPeriod=0;
		for(var i = 0; i < producers.length; i++){
			avgGermPeriod+=producers[i].traits.germinationPeriod;
		}
		avgGermPeriod/=producers.length;
		data.push(avgGermPeriod);
	}
	else if(logging=="Pollen period"){
		var avgpollenPeriod=0;
		for(var i = 0; i < producers.length; i++){
			avgpollenPeriod+=producers[i].traits.pollenPeriod;
		}
		avgpollenPeriod/=producers.length;
		data.push(avgpollenPeriod);
	}
	else if(logging=="Nutrient demand"){
		var avgNutrientDemand=0;
		for(var i = 0; i < producers.length; i++){
			avgNutrientDemand+=producers[i].traits.nutrientDemand;
		}
		avgNutrientDemand/=producers.length;
		data.push(avgNutrientDemand);
	}
}

function move(){
	frameNumber++;
	replenishNutrients();
	getNutrients();
	reproduce();
	moveLifeForms();
	movePollen();
	generatePollen();
	consume();
	logData();
}

function makePopGraph(){
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	var maxY=0;
	for(var i = 0; i < data.length; i++){
		maxY=Math.max(maxY,data[i]);
	}
	var virtScale = height/maxY;
	var horScale = 3*width/data.length;
	for(var i = 3; i < data.length; i+=3){
		ctx.beginPath();
		var colorString = 'rgb(0,255,0)';
		ctx.strokeStyle = colorString;
		ctx.moveTo(horScale*Math.floor((i/3)-1),height-virtScale*data[i-3]);
		ctx.lineTo(horScale*Math.floor((i/3)),height-virtScale*data[i]);
		ctx.fill();
		ctx.stroke();
	}
	for(var i = 4; i < data.length; i+=3){
		ctx.beginPath();
		var colorString = 'rgb(0,0,255)';
		ctx.strokeStyle = colorString;
		ctx.moveTo(horScale*Math.floor((i/3)-1),height-virtScale*data[i-3]);
		ctx.lineTo(horScale*Math.floor((i/3)),height-virtScale*data[i]);
		ctx.fill();
		ctx.stroke();
	}
	for(var i = 5; i < data.length; i+=3){
		ctx.beginPath();
		var colorString = 'rgb(255,0,0)';
		ctx.strokeStyle = colorString;
		ctx.moveTo(horScale*Math.floor((i/3)-1),height-virtScale*data[i-3]);
		ctx.lineTo(horScale*Math.floor((i/3)),height-virtScale*data[i]);
		ctx.fill();
		ctx.stroke();
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};

function makeGraph(){
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	var maxY=0;
	var minY=data[0];
	for(var i = 0; i < data.length; i++){
		maxY=Math.max(maxY,data[i]);
		minY=Math.min(minY,data[i]);
	}
	var virtScale = height/(maxY-minY);
	var horScale = width/data.length;
	for(var i = 1; i < data.length; i++){
		ctx.beginPath();
		var colorString = 'rgb(0,0,0)';
		ctx.strokeStyle = colorString;
		ctx.moveTo(horScale*(i-1),height-virtScale*(data[i-1]-minY));
		ctx.lineTo(horScale*i,height-virtScale*(data[i]-minY));
		ctx.fill();
		ctx.stroke();
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	console.log(data);
};

$("#controls-log").click(function() {
	if(data.length>10){
		if (confirm('Are you sure you want to delete your data and start logging again?')) {
			logging = $("#Var option:selected").text();	
			data = [];
		}
	}
	else{
		logging = $("#Var option:selected").text();	
		data = [];
	}
});

$("#controls-graph").click(function() {
	graph=true;
});

setup();

function main() {
	if(!graph){
		move();
		updateScreen();
		requestAnimationFrame(main);
	}
	else if(logging=="Population sizes"){
		makePopGraph();
	}
	else{
		makeGraph();
	}
};
requestAnimationFrame(main);
