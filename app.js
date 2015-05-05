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

var WeatherFunctions=require('openweathermap-plugin');

var WeatherModule=new WeatherFunctions();

WeatherModule.createStateDictionary();
WeatherModule.getHistoricDataForState();
//WeatherModule.getTestData();
//console.log("Finished creatng files");

var server = app.listen(3000,function(){
    var port=server.address().port;
    console.log('App listening at port %s',port);
});

var sio=require('socket.io').listen(server);

//4 shades of blue,white,light yellow,yellow,orange,2 shades of red
var tempColorRange=['#0033CC','#3F66D8','#66FFFF','#B2FFFF','#FFFFFF','#FFFFA6','#FFFF00','#FFA700','#FF7600','FF0004'];

function getColorFromTemp(index){
   
   return tempColorRange[parseInt(index)];
}

var fs=require('fs');

function getStateAbbrsList (){
        var array = fs.readFileSync('./stateAbbr').toString().split("\n");
        var abbrs={};
        for(i in array) {
            var splitArray = array[i].split(",");
            abbrs[splitArray[0]]=splitArray[1];
        }
        return abbrs;
};

function constructCurrentConditionsObject(stateName,color,temp,humidity,wind){

    var obj={};
    obj.state=abbrList[stateName];
    obj.color=color;
    obj.temp=temp;
    obj.humidity=humidity;
    obj.wind=wind;

    return obj;
}

var abbrList=getStateAbbrsList();

miInterval=setInterval(function(){

       console.log('POLLING NOW')
       
       var stateList=WeatherModule.getAttributesForAll();
        //console.log(stateList);

        stateList.forEach(function(state){
            
            var humidity=state.humidity;
            var wind=state.wind;
            var numericTemp=state.temp;
            var tempIndex=WeatherModule.normalizeTemperature(numericTemp);

        stateList.forEach(function(state){
            var temp=state.temp;
            var color=getColorFromTemp(temp);
            var stateName=state.state;
            var color=getColorFromTemp(tempIndex);
            

            var emitObject=constructCurrentConditionsObject(stateName,color,numericTemp,humidity,wind);

            sio.sockets.emit('updateCurrent',emitObject);
            console.log(emitObject);
        });
},60000);

sio.on('connection',function(socket){
    console.log('New COnnectrion')
})





module.exports = app;
