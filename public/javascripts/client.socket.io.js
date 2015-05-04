var server_name="http://127.0.0.1:3000/";
var socket=io.connect(server_name);




function updateValues(love_perc,hate_perc,total_count){
	$("#Love_Percentage--display").find("#Love_Percentage--datafield").text(love_perc);
	$("#Hate_Percentage--display").find("#Hate_Percentage--datafield").text(hate_perc);
	$("#Total_Tweets--display").find("#Total_Tweets--datafield").text(total_count);
}

function addTweet(username,tweet){
	$("#tweet-table").find('tbody')
	  .prepend($('<tr>')
	  	.append($('<td class=\'col-lg-2\'>')
	  		.text(username))
	  	.append($('<td class=\'col-lg-7\'>')
	  		//.text(decodeURIComponent(escape(tweet))))
	  		.text(tweet))
	  	)
	  .children('tr').slice(50).remove();
}

socket.on('new-tweet',function(data){

	updateValues(data.love_perc,data.hate_perc,data.tweet_count);
	addTweet(data.username,data.text);
});
