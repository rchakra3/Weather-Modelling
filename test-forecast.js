var WeatherFunctions=require('openweathermap-plugin');

var WeatherModule=new WeatherFunctions();
var dict = WeatherModule.createStateDictionary();
for(var state in dict){
	console.log(state);
	var status = WeatherModule.getCurrentRainForecast(state);
	console.log(status);
}