$(document).ready(function() {
    $('#map').usmap({

    		showLabels: true,

    		click: function(event, data) {
			    $('#clicked-state')
			      .text('You clicked: '+data.name);
			  },

    	});
    $('#map').usmap('trigger', 'MI', 'click')

 });

