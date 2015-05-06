$(document).ready(function() {
    $('#map').usmap({

    		showLabels: true,

    		click: function(event, data) {
			    $('#clicked-state').text('You clicked: '+data.name);
			    $('#openModal').click();
			    $('#disp-temp').text($('#map-'+data.name).prop('data-temp'));
			  },

			currentMapUpdate: function(event,data){
				
				$('#map-'+data.name).css('fill',''+event.originalEvent.color);
				$('#map-'+data.name).prop('data-temp', event.originalEvent.temp);
				$('#map-'+data.name).prop('data-humidity', event.originalEvent.humidity);
				$('#map-'+data.name).prop('data-wind', event.originalEvent.wind);
				
			}

    	});
    $('#ourForecastMap').usmap({
    	currentMapUpdate: function(event,data){
					    		var color='#E3E3FF';
					    		if(event.originalEvent.rain==true)
					    			color='#0033CC';

								//console.log('Changed color of:'+data.name+' to:'+color);
								$('#ourForecastMap-'+data.name).css('fill',color);
		},
    });
    $('#actualForecastMap').usmap({
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

