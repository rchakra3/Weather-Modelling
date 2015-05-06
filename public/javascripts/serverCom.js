var socket=io();

//receive an update to the map showing the current weather
socket.on('updateCurrent',function(data){
	$('#map').usmap('trigger', ''+data.state,'currentMapUpdate',data)
	$('#InitializationHeader1').hide();
	$('#InitializationHeader2').hide();
});

//receive an update to the map showing our prediction for precipitation today
socket.on('updateTodaySelfRainForecast',function(data){
	//this data will have keys: state & rain
	$('#ourForecastMap').usmap('trigger',''+data.state,'currentMapUpdate',data);
});

socket.on('updateTodayActualRainForecast',function(data){
	//this data will have keys: state & rain
	$('#actualForecastMap').usmap('trigger',''+data.state,'currentMapUpdate',data);
})

socket.on('accuracyUpdate',function(data){
	$('#accuracyText').text(data.accuracy+'%');
	$('#precisionText').text(data.precision+'%');
})
