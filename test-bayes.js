var fs=require('fs');
var WeatherFunctions=require('openweathermap-plugin');

var WeatherModule=new WeatherFunctions();

WeatherModule.createStateDictionary();
WeatherModule.getHistoricDataForState();




function trainBayes(bayes){
	var array = fs.readFileSync("./new.txt").toString().split("\n");
	var labels = array.shift();
		
	for(i in array){
		var params = array[i].split(",");
		if(params.length>1){
			console.log(params);
			var trainObj=createObject(params[1],params[2],params[3]);
			bayes.train(trainObj,params[4]);
		}
	}	
}

var ss = require('simple-statistics');
var bayes = ss.bayesian();
trainBayes(bayes);

console.log('**TESTING OUTPUT***');

var testObj=createObject(6,7,3);
console.log(bayes.score(testObj));