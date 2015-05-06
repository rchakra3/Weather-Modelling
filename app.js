var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/**********************CUSTOM CODE*********************************/

//The server starts listening on port 3000
var server = app.listen(3000,function(){
    var port=server.address().port;
    console.log('App listening at port %s',port);
});
//bind socket to the server
var sio=require('socket.io').listen(server);

//utilizing a custom plugin we wrote for functions related to pulling, normalizing and returning weather data
var WeatherFunctions=require('openweathermap-plugin');
//create an object of the same
var WeatherModule=new WeatherFunctions();

//creates a map of state to their capital.
/*We send a query based on the captital, but abstract that away since it is easier to work with
**the state names for a few reasons. An important one is that it makes it easier to update the client-side maps
*/
WeatherModule.createStateDictionary();

//This function is called when we feel there is a need to retrain the bayesian model with more recent data
/*We are using historical weather from an entire year currently*/
//WeatherModule.getHistoricDataForState();

//Creates an object of currentWeatherUpdates which contains custom methods to parse incoming data and send out updates to clients
var currentWeatherUpdates=require('./lib/currentWeatherUpdates.js');
var MapUpdater=new currentWeatherUpdates();

//Creates an object of BayesianNets which contains custom methods to create, update and estimate probabilities
var BayesianNets=require('./lib/BayesianNets.js');
var BayesianNetObjectRain=new BayesianNets();
//Generates 50 bayesian classifiers-one for each state. 
/*****THIS IS IMPORTANT- A single classifier was highly inaccurate***/
BayesianNetObjectRain.generateAllNets(MapUpdater.returnAbbrsList());
var bayesNetsForRain=BayesianNetObjectRain.getAllNets();

/*function that calls the sendUpdate function in MapUpdater:
    The sendUpdate function:
    1. polls the API for data about the state's weather- this can be slow at certain times of the day
    2. Creates an object and sends it to all connected clients to update their maps
*/
function currentUpdateFunction(){
       //console.log('POLLING NOW')
       var currentStateWeather=MapUpdater.sendUpdate(sio,WeatherModule,MapUpdater);
       return currentStateWeather;
};

/*function that handles the forecasting functionality:
    The todayRainForecastUpdate function:
    1. Uses the current weather of a city (state capital), uses it as input to a Bayes classifier and gets the classification
    2. The Bayes classifier will predict the probability of precipitation of any kind and the probability of no precipitation
    3. Once we have our own prediction, we poll the weather API for their forecast with respect to precipitation
    4. We then calculate the number of correctly classified (This assumes the Weather API forecast is accurate) areas,
        and use it to calculate accuracy.

*/
function todayRainForecastUpdate(currentStateWeather,abbrList){
      //console.log('Updating todays rain forecast');

      var selfPredictRainCount=0;
      var selfPredictNoRainCount=0;
      var actualPredictRainCount=0;
      var actualPredictNoRainCount=0;
      var correctCount=0;

      var truePositive=0;
      var falsePositive=0;

      currentStateWeather.forEach(function(state){
            
            var humidity=WeatherModule.normalizeHumidity(state.humidity);
            var wind=WeatherModule.normalizeWind(state.wind);
            var temp=WeatherModule.normalizeTemperature(state.temp);
            var stateName=state.state;
            
            // 1. Uses the current weather of a city (state capital), uses it as input to a Bayes classifier and gets the classification
            var lookupObject=BayesianNetObjectRain.createObject(temp,humidity,wind);
            var scoreObject=bayesNetsForRain[stateName].score(lookupObject);
            //2. The Bayes classifier will predict the probability of precipitation of any kind and the probability of no precipitation
            var probRain=parseFloat(scoreObject['1']);
            var probNoRain=parseFloat(scoreObject['0']);
            var finalSelfRainPrediction=false;
          
            if(probRain>0.5){
                finalSelfRainPrediction=true;
                selfPredictRainCount++;
            }
            else if(probNoRain>0.5){
                finalSelfRainPrediction=false;
                selfPredictNoRainCount++;
            }
            else if(probRain>probNoRain){
                finalSelfRainPrediction=true;
                selfPredictRainCount++;
            }
            else{
                finalSelfRainPrediction=false;
                selfPredictNoRainCount++;
            }
            var rainUpdateObj={state:abbrList[stateName],rain:finalSelfRainPrediction};
            sio.sockets.emit('updateTodaySelfRainForecast',rainUpdateObj)


            /****************To get actual Forecast**********************/
            
           
            var actualForecast=null;
            while(actualForecast==null){
                //3. we poll the weather API for their forecast with respect to precipitation
                actualForecast=WeatherModule.getCurrentRainForecast(stateName);
            }
             /*4. We then calculate the number of correctly classified (This assumes the Weather API forecast is accurate) areas,
                and use it to calculate accuracy.*/
            if(actualForecast==true){
                actualPredictRainCount++;
                if(finalSelfRainPrediction==true){
                    correctCount++;
                    truePositive++;
                }
            }
            else{
                actualPredictNoRainCount++;
                if(finalSelfRainPrediction==false){
                    correctCount++;
                }
                else{
                    falsePositive++;
                }
            }

            rainUpdateObj={state:abbrList[stateName],rain:actualForecast};
            sio.sockets.emit('updateTodayActualRainForecast',rainUpdateObj);
            
        });
    var acc=(correctCount)/(50);
    var prec=(truePositive)/(truePositive+falsePositive);
    acc=acc*100;
    prec=prec*100;
    //console.log('Accuracy:'+acc)
    sio.sockets.emit('accuracyUpdate',{accuracy:acc,precision:prec});

}

//calls the functions to poll current weather conditions and well as the function for precipitation prediction
function sendAllUpdate(){
    var currentStateWeather=currentUpdateFunction();
    todayRainForecastUpdate(currentStateWeather,MapUpdater.returnAbbrsList());
}


var flag=true;
//Only start polling after the first client connects- API upper Caps on number of requests!!
/*sio.on('connection',function(socket){
    console.log('New Connectrion');
    if(flag){
        flag=false;
        sendAllUpdate();
        miInterval=setInterval(sendAllUpdate,60000);
    }
});*/

module.exports = app;