var socket=io();


socket.on('updateColor',function(data){
	$('#map').usmap('trigger', 'CA','colorChange',data)
})
