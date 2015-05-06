var ss = require('simple-statistics');
var fs= require('fs');

/*Methods to create, train and get estimates from Bayesian classifiers using the simple-statistics module*/

function BayesianNets(){
	this.bayesNets={};
};

BayesianNets.prototype={

	//returns a new bayesian classifier
	getNewBayesNet: function(){
		var bayes = ss.bayesian();
		return bayes;
	},

	//generates multiple classifiers-one for each network
	generateAllNets: function(stateListObject){
		
		
		var citynum=0;
		for (var property in stateListObject) {
		    if (stateListObject.hasOwnProperty(property)) {
		        if(property!='' && citynum<50){
		        	this.bayesNets[property]=this.getNewBayesNet();
		        	//read in a history file into an array
		        	//console.log('Training bayes net of '+property+' with file:'+'./history/final/city_'+citynum+'.txt');
		        	this.bayesNets[property]=this.trainBayes(this.bayesNets[property],'./history/final/city_'+citynum+'.txt');
		        	citynum++;
		        }
		    }
		}
	},

	getAllNets: function(){
		return this.bayesNets;
	},
	//function to train the bayes classifier with the corresponding weather history for this city
	trainBayes: function (bayes,fileName){
		var array = fs.readFileSync(fileName).toString().split("\n");
		array.shift();
			
		for(i in array){
			var params = array[i].split(",");
			if(params.length>1){
				var trainObj=this.createObject(params[1],params[2],params[3]);
				bayes.train(trainObj,params[4]);
			}
		}	
		return bayes;
	},

	createObject:function (temperature,humidity,windSpeed){

		return {temp:temperature,humidity:humidity,windSpeed:windSpeed};
	},
}

module.exports=BayesianNets;