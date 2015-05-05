$(document).ready(function() {
    $('#map').usmap({

    		showLabels: true,

    		click: function(event, data) {
			    $('#clicked-state')
			      .text('You clicked: '+data.name);
			  },

			currentMapUpdate: function(event,data){
				console.log('Changed color of:'+data.name+' to:'+event.originalEvent.color);
				 $('#'+data.name).css('fill',''+event.originalEvent.color);
			}

    	});
    $('#ourForecastMap').usmap({});
    $('#actualForecastMap').usmap({});
 }

 );

