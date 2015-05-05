var fs = require("fs");

function MapUpdater(){
    //4 shades of blue,white,light yellow,yellow,orange,2 shades of red
    this.tempColorRange= ['#0033CC','#3F66D8','#66FFFF','#B2FFFF','#FFFFFF','#FFFFA6','#FFFF00','#FFA700','#FF7600','#FF0004'];
    this.abbrList= {};
};

MapUpdater.prototype={

    getColorFromTemp: function (index){
       return this.tempColorRange[parseInt(index)-1];
    },

    getStateAbbrsList: function(){
        var array = fs.readFileSync('./stateAbbr').toString().split("\n");
        var abbrs={};
        for(i in array) {
            var splitArray = array[i].split(",");
            abbrs[splitArray[0]]=splitArray[1];
        }
        return abbrs;
    },

    constructCurrentConditionsObject:function(stateName,color,temp,humidity,wind){
        var obj={};
        obj.state=this.abbrList[stateName];
        obj.color=color;
        obj.temp=temp;
        obj.humidity=humidity;
        obj.wind=wind;

        return obj;
    },   

    getCurrentConditionsObject: function(stateName,color,temp,humidity,wind){

        if(Object.keys(this.abbrList).length==0){
            console.log('abbrList was empty.');
            this.abbrList=this.getStateAbbrsList();
            console.log('Now it is:');
            console.log(this.abbrList);
        }
        else{
            console.log('abbrList not empty:');
            console.log(this.abbrList);
        }

        return this.constructCurrentConditionsObject(stateName,color,temp,humidity,wind);
    },

    sendUpdate: function(sio,WeatherModule,ownObj){
        var stateList=WeatherModule.getAttributesForAll();

        stateList.forEach(function(state){
            
            var humidity=state.humidity;
            var wind=state.wind;
            var numericTemp=state.temp;
            var tempIndex=WeatherModule.normalizeTemperature(numericTemp);
            var stateName=state.state;
            console.log(ownObj);
            var color=ownObj.getColorFromTemp(tempIndex);
                

            var emitObject=ownObj.getCurrentConditionsObject(stateName,color,numericTemp,humidity,wind);

            sio.sockets.emit('updateCurrent',emitObject);
            console.log(emitObject);
        });
    },

    testFunction: function(){
        //console.log(this);
        //console.log();
        return this.getColorFromTemp(5);
    },
};

module.exports=MapUpdater;