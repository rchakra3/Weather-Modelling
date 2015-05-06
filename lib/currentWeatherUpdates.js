var fs = require("fs");


/*Methods to handle all possible requirements while updating the client maps*/

function MapUpdater(){
    //4 shades of blue,white,light yellow,yellow,orange,2 shades of red to show the temperatures
    this.tempColorRange= ['#0033CC','#3F66D8','#66FFFF','#B2FFFF','#FFFFFF','#FFFFA6','#FFFF00','#FFA700','#FF7600','#FF0004'];
    this.abbrList= {};
};

MapUpdater.prototype={
    //returns the corresponding color for the normalized temperature
    getColorFromTemp: function (index){
       return this.tempColorRange[parseInt(index)-1];
    },
    //get the list of state abbreviations- required to communicate the right state to color on the front end
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

    returnAbbrsList: function(){
        //console.log(this.abbrList);
        if(Object.keys(this.abbrList).length==0){
            this.abbrList=this.getStateAbbrsList();
        }
        return this.abbrList;
    },   

    getCurrentConditionsObject: function(stateName,color,temp,humidity,wind){

        if(Object.keys(this.abbrList).length==0){
            this.abbrList=this.getStateAbbrsList();
        }

        return this.constructCurrentConditionsObject(stateName,color,temp,humidity,wind);
    },

    //this sends an update to all clients currently connected to the server
    //the update consists of the current weather across the USA
    sendUpdate: function(sio,WeatherModule,ownObj){
        //uses the WeatherFunctions.js methods to get attributes for all states
        var stateList=WeatherModule.getAttributesForAll();

        stateList.forEach(function(state){
            
            var humidity=state.humidity;
            var wind=state.wind;
            var numericTemp=state.temp;
            var tempIndex=WeatherModule.normalizeTemperature(numericTemp);
            var stateName=state.state;
            //console.log(ownObj);
            var color=ownObj.getColorFromTemp(tempIndex);
                

            var emitObject=ownObj.getCurrentConditionsObject(stateName,color,numericTemp,humidity,wind);
            //update the representation of the state based on temperature
            sio.sockets.emit('updateCurrent',emitObject);
            //console.log(emitObject);
            return false;
        });

        return stateList;
    },

    testFunction: function(){
        return this.getColorFromTemp(5);
    },
};

module.exports=MapUpdater;