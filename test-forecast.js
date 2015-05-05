var WeatherFunctions=require('openweathermap-plugin');

var WeatherModule=new WeatherFunctions();
WeatherModule.createStateDictionary();
var status = WeatherModule.getForecast("Washington");
console.log(status);