var socket=io();


socket.on('updateColor',function(data){
	$('#map').usmap('trigger', ''+data.state,'colorChange',data)
})
