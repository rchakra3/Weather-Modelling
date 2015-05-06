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

var server = app.listen(3000,function(){
    var port=server.address().port;
    console.log('App listening at port %s',port);
});

var sio=require('socket.io').listen(server);

var WeatherFunctions=require('openweathermap-plugin');

var WeatherModule=new WeatherFunctions();

WeatherModule.createStateDictionary();
//WeatherModule.getHistoricreateStateDictionarycDataForState();
//WeatherModule.getTestData();
//console.log("Finished creatng files");

var currentWeatherUpdates=require('./lib/currentWeatherUpdates.js');

var MapUpdater=new currentWeatherUpdates();

var fs=require('fs');

var BayesianNets=require('./lib/BayesianNets.js');

var BayesianNetObjectRain=new BayesianNets();

BayesianNetObjectRain.generateAllNets(MapUpdater.returnAbbrsList());

var bayesNetsForRain=BayesianNetObjectRain.getAllNets();

function currentUpdateFunction(){

       console.log('POLLING NOW')
       var currentStateWeather=MapUpdater.sendUpdate(sio,WeatherModule,MapUpdater);
       return currentStateWeather;
};

function todayRainForecastUpdate(currentStateWeather,abbrList){
      console.log('Updating todays rain forecast');

      var selfPredictRainCount=0;
      var selfPredictNoRainCount=0;
      var actualPredictRainCount=0;
      var actualPredictNoRainCount=0;
      var correctCount=0;

      currentStateWeather.forEach(function(state){
            
            var humidity=WeatherModule.normalizeHumidity(state.humidity);
            var wind=WeatherModule.normalizeWind(state.wind);
            var temp=WeatherModule.normalizeTemperature(state.temp);
            var stateName=state.state;
            //console.log('State name:'+stateName);
            //console.log(bayesNetsForRain);
            var lookupObject=BayesianNetObjectRain.createObject(temp,humidity,wind);
            var scoreObject=bayesNetsForRain[stateName].score(lookupObject);

            var probRain=parseFloat(scoreObject['1']);
            var probNoRain=parseFloat(scoreObject['0']);
            var finalSelfRainPrediction=false;
           // console.log('********PROB OF RAIN:'+probRain);
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
                actualForecast=WeatherModule.getCurrentRainForecast(stateName);
            }

            if(actualForecast==true){
                actualPredictRainCount++;
                if(finalSelfRainPrediction==true){
                    correctCount++;
                }
            }
            else{
                actualPredictNoRainCount++;
                if(finalSelfRainPrediction==false){
                    correctCount++;
                }
            }

            rainUpdateObj={state:abbrList[stateName],rain:actualForecast};
            sio.sockets.emit('updateTodayActualRainForecast',rainUpdateObj);
            //console.log('Score for:'+stateName);
            //console.log(scoreObject);
        });
    console.log('Accuracy:'+(correctCount)/(50))


}

function sendAllUpdate(){
    var currentStateWeather=currentUpdateFunction();
    todayRainForecastUpdate(currentStateWeather,MapUpdater.returnAbbrsList());
}

function updateHistory(){
    var fs = require("fs");         
    var curDate=WeatherFunctions.getCurrentDate().split("-");
    var oldFile="./history/mod/mod_city0.txt";
    var historyArray=fs.readFileSync(oldFile).toString().split("\n");
    var lastHistDate=(historyArray[historyArray.length - 1]).split(",")[0].split("-");
    var dayDate, dataString, oldFile, newFile;
    if(curDate[0] > lastHistDate[0] || curDate[1] > lastHistDate[1] || curDate[2] > lastHistDate[2]){
        var linkData = "/blah";
        var i=0;
        for(var state in WeatherFunctions.stateMap){
            dayData=WeatherFunctions.getJSON(linkData).split(",");
            dataString[0]=dayData[0];
            dataString[1]=dayData[2];
            dataString[2]=dayData[8];
            dataString[3]=dayData[17];
            dataString[4]=dayData[21];
            oldFile = "./history/mod/mod_city"+i+".txt";
            newFile = "./history/final/city_"+i+".txt";
            fs.appendFileSync(oldFile, dataString.join());
            
            dataString[0]=dataString[0];
            dataString[1]=WeatherFunctions.normalizeTemperature(dataString[1]);
            dataString[2]=WeatherFunctions.normalizeHumidity(dataString[2]);
            dataString[3]=WeatherFunctions.normalizeWind(dataString[3]);
            dataString[4]=(dataString[4] == " ") ? 1 : dataString[4];
            fs.appendFileSync(newFile, dataString.join());
            i++;
        }
    }
}

var flag=true;

sio.on('connection',function(socket){
    console.log('New Connectrion');
    if(flag){
        flag=false;
        sendAllUpdate();
        miInterval=setInterval(sendAllUpdate,60000);
    }

    updateHistory();
    hisInterval=setInterval(updateHistory, 60000*60);
});

module.exports = app;