var socket=io();


socket.on('updateCurrent',function(data){
	$('#map').usmap('trigger', ''+data.state,'currentMapUpdate',data)
})
