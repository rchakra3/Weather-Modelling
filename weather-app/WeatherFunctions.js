var stateMap = {};
var fs = require("fs");
var fileName = "capitals.txt";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//module.exports = {

function mapStates(){
	var array = fs.readFileSync('capitals.txt').toString().split("\n");
	for(i in array) {
    var splitArray = array[i].split(",");
    stateMap[splitArray[0]] = splitArray[1];
	}

}

function GetJSON(data){
	var jsonReq = new XMLHttpRequest();// a new request
	jsonReq.open("GET",data,false);
	jsonReq.send(null);
	return jsonReq.responseText;          
}

function getTemperature(stateName){

	var json_obj = JSON.parse(GetJSON("http://api.openweathermap.org/data/2.5/weather?q=" + stateMap[stateName]));
	return json_obj.main.temp;
}

function getHumidity(stateName){

	var json_obj = JSON.parse(GetJSON("http://api.openweathermap.org/data/2.5/weather?q=" + stateMap[stateName]));
	return json_obj.main.humidity;
}

function getWind(stateName){

	var json_obj = JSON.parse(GetJSON("http://api.openweathermap.org/data/2.5/weather?q=" + stateMap[stateName]));
	return json_obj.wind.speed;
}
//}

