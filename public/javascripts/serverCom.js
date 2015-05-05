var socket=io();


socket.on('updateCurrent',function(data){
	$('#map').usmap('trigger', ''+data.state,'currentMapUpdate',data)
});

socket.on('updateTodayActualRainForecast',function(data){
	//this data will have keys: state & rain
	$('#ourForecastMap').usmap('trigger',''+data.state,'currentMapUpdate',data);
});
