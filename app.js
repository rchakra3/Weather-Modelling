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

var WeatherFunctions=require('openweathermap-plugin')

var WeatherModule=new WeatherFunctions();

WeatherModule.createStateDictionary();

var server = app.listen(3000,function(){
    var port=server.address().port;
    console.log('App listening at port %s',port);
});

var sio=require('socket.io').listen(server);

var tempColorRange=parseInt('E50009' , 16)-parseInt('96D7E9' , 16);

function getColorFromTemp(temp){
    //Celsius
    var minTemp= -62 ;
    var maxTemp=57;
    var normalizedTemp=((temp-minTemp)/(maxTemp-minTemp));
    var hexColorRange=(parseInt('E50009' , 16)-parseInt('96D7E9' , 16)).toString(16);
    var colorDiff=Math.floor(normalizedTemp*(parseInt(hexColorRange,16)));
    var color=colorDiff+parseInt('96D7E9' , 16);
    return '#'+color.toString(16);
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

var abbrList=getStateAbbrsList();

sio.on('connection',function(socket){

    console.log('New COnnectrion')

     var stateList=WeatherModule.getTemperatureForAll();

        console.log(stateList);

        stateList.forEach(function(state){
            var temp=state.temp;
            var color=getColorFromTemp(temp);
            var stateName=state.state;

            var emitObject={state:abbrList[stateName],color:color};

            socket.emit('updateColor',emitObject);
            //socket.emit('updateColor',{state:'CA',color:'#c73f7f'});
            console.log('state:'+emitObject.state+' color:'+emitObject.color);
        });

    miInterval=setInterval(function(){
       
    },1000);

})





module.exports = app;
