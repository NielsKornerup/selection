var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth-30;
canvas.height = window.innerHeight-50;
var ctx = canvas.getContext("2d");

//Define variables
var width = canvas.width;
var height = canvas.height;
var producers=[];
var herbivores=[];
var carnivores=[];
var pollen=[];
var numProducers = 130;
var numHerbivores = 50;
var numCarnivores = 7;
var maxSpeed = 3;
var maxSize = 40;
var maxPollenSize = 3;
var PI = 3.141592;
var maxHealth = 2000;
var gridSize=40;
var areas = [];
var arr = [];
var plantNumber=0;
var frameNumber=0;
var data = [];
var logging = "Population sizes";
var graph = false;
var selfReproduction = false;
var maxNutrients=200;
var maxDeplenishRate = 30;
var minDeplenishRate = 5;
var replenishRate = 2;
var energyCost = 0.7;

//Setup the grid
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

//Puts a new plant into the coordinate system
function addPlantToArea(lifeform){
	var possibleX = [];
	var possibleY = [];
	for(var x = 0; x < gridSize; x++){
		if(lifeform.position.x + lifeform.traits.radius + maxSize/2 >= ((x)*width/gridSize) && (lifeform.position.x <= ((x+1)*width/gridSize) + lifeform.traits.radius + maxSize/2)){
			possibleX.push(x);
		}
	}
	for(var y = 0; y < gridSize; y++){
		if(lifeform.position.y + lifeform.traits.radius + maxSize/2 >= ((y)*height/gridSize) && (lifeform.position.y <= ((y+1)*height/gridSize) + lifeform.traits.radius + maxSize/2)){
			possibleY.push(y);
		}
	}
	for(var x = 0; x < possibleX.length; x++){
		for(var y = 0; y < possibleY.length; y++){
			areas[possibleX[x]][possibleY[y]].plants.push(lifeform);
		}
	}
}

//Gets the coordinates of an object in the grid
function getArea(obj){
	var x = Math.min(Math.max(Math.floor(gridSize*obj.position.x/width),0),gridSize-1);
	var y = Math.min(Math.max(Math.floor(gridSize*obj.position.y/height),0),gridSize-1);
	return areas[x][y];
}

//Gets all of the plants that could be colliding with the object
function getPlants(obj){
	var x = Math.min(Math.max(Math.floor(gridSize*obj.position.x/width),0),gridSize-1);
	var y = Math.min(Math.max(Math.floor(gridSize*obj.position.y/height),0),gridSize-1);
	var result = areas[x][y].plants;
	for(signx = -1; signx <=1; signx++){
		for(signy = -1; signy <=1; signy++){
			if(Math.min(Math.max(Math.floor(gridSize*(obj.position.x+(obj.traits.radius*signx))/width),0),gridSize-1) != x && Math.min(Math.max(Math.floor(gridSize*(obj.position.y+(obj.traits.radius*signy))/height),0),gridSize-1) !=y){
				result.concat(areas[Math.min(Math.max(Math.floor(gridSize*(obj.position.x+(obj.traits.radius*signx))/width),0),gridSize-1)][Math.min(Math.max(Math.floor(gridSize*(obj.position.y+(obj.traits.radius*signy))/height),0),gridSize-1)]);
			} 
		}
	}
	return result;
}

//Sets up all of the organisms 
function setup(){
	document.getElementById("resume").style.display="none";
	document.getElementById("restart").style.display="none";
	var lifeform;
	var angle = 0;
	for(var i = 0; i < numProducers; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.id=plantNumber;
		plantNumber++;
		lifeform.traits.pollenPeriod = Math.ceil(200*Math.random());
		lifeform.traits.pollenSize = (3*Math.random());
		lifeform.traits.reproductionRate = Math.random();
		lifeform.traits.germinationPeriod = Math.ceil(600*Math.random());
		lifeform.traits.radius = (maxSize*Math.random()/3);
		lifeform.traits.age = 0;
		lifeform.traits.alive = true;
		lifeform.traits.nutrientDemand = Math.max(maxDeplenishRate * Math.random(),minDeplenishRate);
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
		lifeform.traits.reproductionRate = Math.random();
		lifeform.traits.radius = Math.ceil(maxSize*Math.random()/2);
		lifeform.traits.mass = Math.pow(lifeform.traits.radius,2);
		lifeform.traits.speed = 1 + Math.random()*(maxSpeed-1);
		lifeform.traits.eaten = false;
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		angle = 2*PI*Math.random();
		lifeform.velocity.x = lifeform.traits.speed*Math.cos(angle);
		lifeform.velocity.y = lifeform.traits.speed*Math.sin(angle);
		herbivores.push(lifeform);
	}

	for(var i = 0; i < numCarnivores; i++){
		lifeform = new Object();
		lifeform.position = new Object();
		lifeform.velocity = new Object();
		lifeform.traits = new Object();

		lifeform.traits.age = 0;
		lifeform.traits.growthPeriod = Math.ceil(1000*Math.random());
		lifeform.traits.fullHealth = 4*maxHealth*Math.random()/5;
		lifeform.traits.health = lifeform.traits.fullHealth;
		lifeform.traits.reproductionRate = Math.random();
		lifeform.traits.radius = Math.ceil(maxSize*Math.random()/2)+maxSize/2;
		lifeform.traits.speed = 1 + Math.random()*(maxSpeed-1);
		lifeform.traits.eaten = false;
		lifeform.position.x = lifeform.traits.radius+(Math.random()*(width-lifeform.traits.radius));
		lifeform.position.y = lifeform.traits.radius+(Math.random()*(height-lifeform.traits.radius));
		angle = 2*PI*Math.random();
		lifeform.velocity.x = lifeform.traits.speed*Math.cos(angle);
		lifeform.velocity.y = lifeform.traits.speed*Math.sin(angle);
		carnivores.push(lifeform);
	}
}

//Draws the graphics when viewing the simulation using canvas
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

//Moves creatures using their x and y velocities
function moveLifeForms(){
	var lifeform;
	for (var i = 0; i < herbivores.length; i++) {
		lifeform = herbivores[i];
		lifeform.traits.health=lifeform.traits.health-energyCost;
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
		lifeform.traits.health=lifeform.traits.health-energyCost;
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

//Moves the pollen generated by plants
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

//Function for plants extracting nutrients from the grid
function getNutrients(){
	for(var i = 0; i < producers.length; i++){
		var p = producers[i];
		var area = getArea(p);
		if(area.nutrients >= p.traits.nutrientDemand){
			area.nutrients-=p.traits.nutrientDemand;
		}
		else{
			p.traits.alive=false;
			producers.splice(i, 1);
			for(var j=0; j < producers.length; j++){
				producers[j].traits.index=j;
			}
		}
	}
}

//Function for adding nutrients to the grid
function replenishNutrients(){
	for(var x = 0; x < areas.length; x++){
		for(var y = 0; y < areas[x].length; y++){
			areas[x][y].oldNutrients = areas[x][y].nutrients;
			if(areas[x][y].nutrients<maxNutrients){
				areas[x][y].nutrients+=replenishRate;
			}
			if(x > 0 && x < areas.length-1 && y > 0 && y < areas[x].length-1){
				var avg = (areas[x][y].oldNutrients+areas[x+1][y].nutrients+areas[x-1][y].oldNutrients+areas[x][y-1].oldNutrients+areas[x][y+1].nutrients+areas[x+1][y+1].nutrients+areas[x-1][y+1].oldNutrients+areas[x+1][y-1].nutrients+areas[x-1][y-1].oldNutrients)/9;
				var dispRate = 2;
				areas[x][y].nutrients = (dispRate*areas[x][y].nutrients + avg)/(1+dispRate);
			}
		}
	}
}

//Algorithm for creating new pollen
function generatePollen(){
	var autotroph;
	for(var i = 0; i < producers.length; i++){
		autotroph = producers[i];
		if(!autotroph.traits.alive){
			producers.splice(i, 1);
			i--;
		}
		else if(autotroph.traits.age <= 0 && frameNumber%autotroph.traits.pollenPeriod==0){
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

//Algorithm for making a new producer from the collision of pollen and a plant. Additional random term is used to simulate mutations
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
	child.traits.radius = Math.max(Math.min(((mother.traits.radius+father.traits.radius)/2)+2*(Math.random()-0.5),maxSize),0.5); //makes sure that this value is reasonable
	child.traits.alive = true;
	child.traits.nutrientDemand = Math.max(Math.min(((mother.traits.nutrientDemand+father.traits.nutrientDemand)/2),maxDeplenishRate),minDeplenishRate); 
	child.position.x = mother.position.x + 400*(Math.random()-0.5);
	child.position.y = mother.position.y + 400*(Math.random()-0.5);

	//This part of the function makes sure that new plants do not overlap with other plants
	var found = false;
	var nearby = getPlants(child);
	while(found){
		found = false;
		for(var p = 0; !found && p < nearby.length; p++){
			var xDistance = nearby[p].position.x - child.position.x;
			var yDistance = nearby[p].position.y - child.position.y;
			distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
			if(distance<=nearby[p].traits.radius+child.traits.radius){
				found = true;
				child.position.x = mother.position.x + 400*(Math.random()-0.5);
				child.position.y = mother.position.y + 400*(Math.random()-0.5);
			}
		}
	}
	child.traits.index = plantNumber;
	child.traits.id = plantNumber;
	plantNumber++;
	producers.push(child);
	addPlantToArea(child);
}

//Algorithm for making a new herbivore
function newHerbivore(mother, father){
	var child = new Object();
	child.position = new Object();
	child.velocity = new Object();
	child.traits = new Object();
	child.traits.fullHealth = Math.ceil(((mother.traits.fullHealth+father.traits.fullHealth)/2)+100*(Math.random()-0.5));
	child.traits.health = child.traits.fullHealth/2;
	child.traits.reproductionRate = Math.max(Math.min(((mother.traits.reproductionRate+father.traits.reproductionRate)/2)+0.1*(Math.random()-0.5),1),0); //makes sure this value remains between zero and one
	child.traits.growthPeriod = ((mother.traits.growthPeriod+father.traits.growthPeriod)/2)+10*(Math.random()-0.5);
	child.traits.age = child.traits.growthPeriod;
	child.traits.radius = Math.max(Math.min(((mother.traits.radius+father.traits.radius)/2)+1*(Math.random()-0.5),maxSize),1); //makes sure that this value is reasonable
	child.traits.mass = Math.pow(child.traits.radius,2);
	child.traits.eaten=false;
	child.position.x = (mother.position.x + father.position.x)/2;
	child.position.y = (mother.position.y + father.position.y)/2;
	child.traits.speed = Math.max(Math.min((mother.traits.speed+father.traits.speed)/2+0.4*(Math.random()-0.5),maxSpeed),0.1);
	var angle = 2*PI*Math.random();
	child.velocity.x = child.traits.speed*Math.cos(angle);
	child.velocity.y = child.traits.speed*Math.sin(angle);
	herbivores.push(child);
}

//Algorithm for making a new carnivore 
function newCarnivore(mother, father){
	var child = new Object();
	child.position = new Object();
	child.velocity = new Object();
	child.traits = new Object();
	child.traits.fullHealth = Math.ceil(((mother.traits.fullHealth+father.traits.fullHealth)/2)+100*(Math.random()-0.5));
	child.traits.health = child.traits.fullHealth/2;
	child.traits.reproductionRate = Math.max(Math.min(((mother.traits.reproductionRate+father.traits.reproductionRate)/2)+0.1*(Math.random()-0.5),1),0); //makes sure this value remains between zero and one
	child.traits.growthPeriod = ((mother.traits.growthPeriod+father.traits.growthPeriod)/2)+10*(Math.random()-0.5);
	child.traits.age = child.traits.growthPeriod;
	child.traits.radius = Math.max(Math.min(((mother.traits.radius+father.traits.radius)/2)+1*(Math.random()-0.5),maxSize),1); //makes sure that this value is reasonable
	child.traits.mass = Math.pow(child.traits.radius,2);
	child.traits.eaten=false;
	child.position.x = (mother.position.x + father.position.x)/2;
	child.position.y = (mother.position.y + father.position.y)/2;
	child.traits.speed = Math.max(Math.min(mother.traits.speed+father.traits.speed+0.4*(Math.random()-0.5),maxSpeed),0.1);
	var angle = 2*PI*Math.random();
	child.velocity.x = child.traits.speed*Math.cos(angle);
	child.velocity.y = child.traits.speed*Math.sin(angle);
	carnivores.push(child);
}

//Function that determines whether any new organisms are born
function reproduce(){
	var xDistance = 0;
	var yDistance = 0;
	var distance = 0;
	var producer = new Object();
	var gamete;
	var area;
	var found;
	//Self reproduction was a tool used to artificially prevent extinction. This is turned off by default because it is not scientifically accurate
	if(selfReproduction){
		if(producers.length==1){
			newProducer(producers[0], producers[0]); 
		}
		if(herbivores.length==1){
			newHerbivore(herbivores[0], herbivores[0]);
		}
		if(carnivores.length==1){
			newCarnivore(carnivores[0], carnivores[0]);
		}
	}
	//Producer reproduction
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
					if(area[p].traits.age<=0){
						var num = Math.ceil(Math.random()*5);
						for(i = 0; i < num; i++){
							newProducer(producer, gamete);
						}
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
	//Herbivore reproduction
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
				if(herbivore1.traits.age <= 0 && herbivore2.traits.age <= 0 && herbivore1.traits.eaten && herbivore2.traits.eaten && herbivore1.traits.health/herbivore1.traits.fullHealth >=0.25 && herbivore2.traits.health/herbivore2.traits.fullHealth>=0.25){
					var numChilds = Math.ceil(Math.random() * 4);
					for(var i = 0; i < numChilds; i++){
						newHerbivore(herbivore1, herbivore2);
					}
					herbivore1.traits.age = 2*herbivore1.traits.growthPeriod/3;
					herbivore2.traits.age = 2*herbivore2.traits.growthPeriod/3;
					herbivore1.traits.health=3*herbivore1.traits.health/4;
					herbivore2.traits.health=3*herbivore2.traits.health/4;
				}
			}
			else if(distance<=herbivore1.traits.radius+herbivore2.traits.radius && herbivore1.traits.age <= 0 && herbivore2.traits.age <= 0){
				herbivore1.traits.age = 2*herbivore1.traits.growthPeriod/3;
				herbivore2.traits.age = 2*herbivore2.traits.growthPeriod/3;
			}
		}
	}
	//Carnivore reproduction
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
				if(carnivore1.traits.age <= 0 && carnivore2.traits.age <= 0 && carnivore1.traits.eaten && carnivore2.traits.eaten && carnivore1.traits.health/carnivore1.traits.fullHealth >=0.25 && carnivore2.traits.health/carnivore2.traits.fullHealth>=0.25){
					newCarnivore(carnivore1, carnivore2);
					carnivore1.traits.age = 2*carnivore1.traits.growthPeriod/3;
					carnivore2.traits.age = 2*carnivore2.traits.growthPeriod/3;
					carnivore1.traits.health=3*carnivore1.traits.health/4;
					carnivore2.traits.health=3*carnivore2.traits.health/4;
				}
			}
			else if(distance<=carnivore1.traits.radius+carnivore2.traits.radius && carnivore1.traits.age <= 0 && carnivore2.traits.age <= 0){
				carnivore1.traits.age = 2*carnivore1.traits.growthPeriod/3;
				carnivore2.traits.age = 2*carnivore2.traits.growthPeriod/3;
			}
		}
	}
}

//Function to see if anything eats anything else
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
				if(distance<=predator.traits.radius+food.traits.radius && (!predator.traits.eaten||(predator.traits.fullHealth-predator.traits.health)>Math.pow(food.traits.radius,2))){
					predator.traits.health=Math.min(predator.traits.fullHealth, predator.traits.health+Math.pow(food.traits.radius,2));
					predator.traits.eaten=true;
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
			if(distance<=predator.traits.radius+food.traits.radius && (!predator.traits.eaten||(predator.traits.fullHealth-predator.traits.health)>food.traits.health)){
				predator.traits.health=Math.min(predator.traits.fullHealth, predator.traits.health+food.traits.health);
				predator.traits.eaten=true;
				herbivores.splice(food.traits.index, 1);
				for(var i=0; i < herbivores.length; i++){
					herbivores[i].traits.index=i;
				}
			}
		}
	}
}

//Records data for graphing
function logData(){
	if(logging=="Population sizes"){
		data.push(producers.length);
		data.push(herbivores.length);
		data.push(carnivores.length);
	}
	else if(logging=="Germination period"){
		var avgGermPeriod=0;
		if(producers.length!=0){
			for(var i = 0; i < producers.length; i++){
				avgGermPeriod+=producers[i].traits.germinationPeriod;
			}
			avgGermPeriod/=producers.length;
		}
		else if (data.length!=0){
			avgGermPeriod = data[data.length-1];
		}
		data.push(avgGermPeriod);
	}
	else if(logging=="Pollen period"){
		var avgpollenPeriod=0;
		if(producers.length!=0){
			for(var i = 0; i < producers.length; i++){
				avgpollenPeriod+=producers[i].traits.pollenPeriod;
			}
			avgpollenPeriod/=producers.length;
		}
		else if (data.length!=0){
			avgpollenPeriod = data[data.length-1];
		}
		data.push(avgpollenPeriod);
	}
	else if(logging=="Nutrient demand"){
		var avgNutrientDemand=0;
		if(producers.length!=0){
			for(var i = 0; i < producers.length; i++){
				avgNutrientDemand+=producers[i].traits.nutrientDemand;
			}
			avgNutrientDemand/=producers.length;
		}
		else if (data.length!=0){
			avgNutrientDemand = data[data.length-1];
		}
		data.push(avgNutrientDemand);
	}
	else if(logging=="Full health"){
		var avgFullHealth=0;
		if(herbivores.length!=0){
			for(var i = 0; i < herbivores.length; i++){
				avgFullHealth+=herbivores[i].traits.fullHealth;
			}
			avgFullHealth/=herbivores.length;
		}
		else if (data.length>1){
			avgFullHealth = data[data.length-2];
		}
		data.push(avgFullHealth);
		
		avgFullHealth=0;
		if(carnivores.length!=0){
			for(var i = 0; i < carnivores.length; i++){
				avgFullHealth+=carnivores[i].traits.fullHealth;
			}
			avgFullHealth/=carnivores.length;
		}
		else if (data.length>1){
			avgFullHealth = data[data.length-2];
		}
		data.push(avgFullHealth);
	}
	else if(logging=="Radius"){
		var avgRadius=0;
		if(producers.length!=0){
			for(var i = 0; i < producers.length; i++){
				avgRadius+=producers[i].traits.radius;
			}
			avgRadius/=producers.length;
		}
		else if (data.length>2){
			avgRadius = data[data.length-3];
		}
		data.push(avgRadius);
		
		avgRadius=0;
		if(herbivores.length!=0){
			for(var i = 0; i < herbivores.length; i++){
				avgRadius+=herbivores[i].traits.radius;
			}
			avgRadius/=herbivores.length;
		}
		else if (data.length>2){
			avgRadius = data[data.length-3];
		}
		data.push(avgRadius);
		
		avgRadius=0;
		if(carnivores.length!=0){
			for(var i = 0; i < carnivores.length; i++){
				avgRadius+=carnivores[i].traits.radius;
			}
			avgRadius/=carnivores.length;
		}
		else if (data.length>2){
			avgRadius = data[data.length-3];
		}
		data.push(avgRadius);
	}
	else if(logging=="Reproduction rate"){
		var avgRate=0;
		if(producers.length!=0){
			for(var i = 0; i < producers.length; i++){
				avgRate+=producers[i].traits.reproductionRate;
			}
			avgRate/=producers.length;
		}
		else if (data.length>2){
			avgRate = data[data.length-3];
		}
		data.push(avgRate);
		
		avgRate=0;
		if(herbivores.length!=0){
			for(var i = 0; i < herbivores.length; i++){
				avgRate+=herbivores[i].traits.reproductionRate;
			}
			avgRate/=herbivores.length;
		}
		else if (data.length>2){
			avgRate = data[data.length-3];
		}
		data.push(avgRate);
		
		avgRadius=0;
		if(carnivores.length!=0){
			for(var i = 0; i < carnivores.length; i++){
				avgRate+=carnivores[i].traits.reproductionRate;
			}
			avgRate/=carnivores.length;
		}
		else if (data.length>2){
			avgRate = data[data.length-3];
		}
		data.push(avgRate);
	}
}

//The function that runs all calculations for the simulation
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

//Creates a population size graph that is scaled to fill the entire screen. I invented this algorithm. This function is also used to graph radius. 
//Todo: add axis on the graphs.
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

//Graphs max health
function makeHealthGraph(){
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	var maxY=0;
	for(var i = 0; i < data.length; i++){
		maxY=Math.max(maxY,data[i]);
	}
	var virtScale = height/maxY;
	var horScale = 2*width/data.length;
	for(var i = 2; i < data.length; i+=2){
		ctx.beginPath();
		var colorString = 'rgb(0,0,255)';
		ctx.strokeStyle = colorString;
		ctx.moveTo(horScale*Math.floor((i/2)-1),height-virtScale*data[i-2]);
		ctx.lineTo(horScale*Math.floor((i/2)),height-virtScale*data[i]);
		ctx.fill();
		ctx.stroke();

	}
	for(var i = 3; i < data.length; i+=2){
		ctx.beginPath();
		var colorString = 'rgb(255,0,0)';
		ctx.strokeStyle = colorString;
		ctx.moveTo(horScale*Math.floor((i/2)-1),height-virtScale*data[i-2]);
		ctx.lineTo(horScale*Math.floor((i/2)),height-virtScale*data[i]);
		ctx.fill();
		ctx.stroke();
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};

//Graphs any other quantity. All of these quantities can be graphed with a single function, as these quantities only apply to one organism type.
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
};

//JQuery: Interactive features such as toggling graph, restarting simulation, and picking quantity to log.

//Restart the simulation logging a new quantity.
$("#controls-log").click(function() {
	if (confirm('Are you sure you want to restart the simulation and log ' + $("#Var option:selected").text() + '?')) {
		logging = $("#Var option:selected").text();	
		graph=false;
		ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
		producers=[];
		herbivores=[];
		carnivores=[];
		pollen=[];
		areas = [];
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
		data = [];
		frameNumber  = 0;
		plantNumber = 0;
		document.getElementById("controls-graph").style.display="initial";

		setup();
	}
});

//Switch to view graph
$("#controls-graph").click(function() {
	graph=true;
	document.getElementById("controls-graph").style.display="none";
	document.getElementById("resume").style.display="initial";
	document.getElementById("restart").style.display="initial";
});

//Switch to view simulation
$("#resume").click(function(){
	graph=false;
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	document.getElementById("controls-graph").style.display="initial";
	document.getElementById("resume").style.display="none";
	document.getElementById("restart").style.display="none";
});

//Restarts the simulation
$("#restart").click(function(){
	graph=false;
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	producers=[];
	herbivores=[];
	carnivores=[];
	pollen=[];
	areas = [];
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

	data = [];
	frameNumber  = 0;
	plantNumber = 0;
	
	document.getElementById("controls-graph").style.display="initial";
	
	setup();	
});

function main() {
	move();
	if(!graph){
		updateScreen();
	}
	else if(logging=="Population sizes" || logging=="Radius" || logging=="Reproduction rate"){
		makePopGraph();
	}
	else if(logging=="Full health"){
		makeHealthGraph();
	}
	else{
		makeGraph();
	}
	requestAnimationFrame(main);
};

//Code that launches simulator
setup();
requestAnimationFrame(main);
