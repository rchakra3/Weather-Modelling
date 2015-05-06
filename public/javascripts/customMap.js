$(document).ready(function() {
    $('#map').usmap({

    		showLabels: true,
    		useAllLabels: true,
    		labelTextStyles: {color:'#000000'},
    		//pop up a modal on the user clicking any state
    		click: function(event, data) {
			    $('#clicked-state').text('You clicked: '+data.name);
			    $('#openModal').click();
			    $('#myModalLabel').text('Current Weather-'+data.name)
			    $('#disp-temp').text('Temperature:'+$('#map-'+data.name).prop('data-temp')+'\xB0F');
			    $('#disp-humidity').text('Humidity: '+$('#map-'+data.name).prop('data-humidity'));
			    $('#disp-wind').text('Wind speed: '+$('#map-'+data.name).prop('data-wind')+'mph');
			  },
			 //update the current weather map
			currentMapUpdate: function(event,data){
				
				$('#map-'+data.name).css('fill',''+event.originalEvent.color);
				$('#map-'+data.name).prop('data-temp', event.originalEvent.temp);
				$('#map-'+data.name).prop('data-humidity', event.originalEvent.humidity);
				$('#map-'+data.name).prop('data-wind', event.originalEvent.wind);
				
			}

    	});
    $('#ourForecastMap').usmap({
    	//update our forecast map
    	currentMapUpdate: function(event,data){
					    		var color='#E3E3FF';
					    		if(event.originalEvent.rain==true)
					    			color='#0033CC';

								//console.log('Changed color of:'+data.name+' to:'+color);
								$('#ourForecastMap-'+data.name).css('fill',color);
		},
    });
    $('#actualForecastMap').usmap({
    	//update official forecast map
    	currentMapUpdate: function(event,data){
					    		var color='#E3E3FF';
					    		if(event.originalEvent.rain==true)
					    			color='#0033CC';

								//console.log('Changed color of:'+data.name+' to:'+color);
								$('#actualForecastMap-'+data.name).css('fill',color);
		},
    });
 }

 );

