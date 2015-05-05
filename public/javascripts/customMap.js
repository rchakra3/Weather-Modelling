$(document).ready(function() {
    $('#map').usmap({

    		showLabels: true,

    		click: function(event, data) {
			    $('#clicked-state').text('You clicked: '+data.name);
			    $('#openModal').click();
			    $('#disp-temp').text($('#map-'+data.name).prop('data-temp'));
			  },

			currentMapUpdate: function(event,data){
				console.log('Changed color of:'+data.name+' to:'+event.originalEvent.color);
				$('#'+data.name).css('fill',''+event.originalEvent.color);
				$('#map-'+data.name).prop('data-temp', event.originalEvent.temp);
				$('#map-'+data.name).prop('data-humidity', event.originalEvent.humidity);
				$('#map-'+data.name).prop('data-wind', event.originalEvent.wind);
				//if(event.originalEvent.city)
					//$('#map-'+data.name).prop('data-city', event.originalEvent.city);
			}

    	});
    $('#ourForecastMap').usmap({});
    $('#actualForecastMap').usmap({});
 }

 );

