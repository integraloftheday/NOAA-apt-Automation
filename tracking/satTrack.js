const satellite = require('satellite.js');

class satTrack {
    constructor(tle1,tle2,satName='None',latO=0,longO=0,altO=0){
        this.tle1 = tle1;
        this.tle2 = tle2; 
        this.satName = satName;
        this.id = tle2.split(" ")[1]

        this.sat = satellite.twoline2satrec(this.tle1, this.tle2);
        this.period = 1/(this.tle2.replace(/  +/g, ' ').split(" ").slice(-2)[0] / 86400); // in revolutions per second
        this.observer = {
            longitude: satellite.degreesToRadians(longO),
            latitude: satellite.degreesToRadians(latO),
            height: altO
        };
    }
    /**
     * A function that sets the observer's position. 
     * @param {float} longO a degree longitutde
     * @param {float} latO a degree latitude
     * @param {float} alt altitude of observer
     */
    observerLoc(longO,latO,altO){
        this.observer = {
            longitude: satellite.degreesToRadians(longO),
            latitude: satellite.degreesToRadians(latO),
            height: altO
        };
    }

    /**
     * A function that returns current Geodetic Cordinates of a satellite. 
     * @param {Date() Object} dateObj [A javascript date object]
     * @return {json} A json object which has the form: 
     * {
        degree: {
            longitude: -112.0393201641886,
            latitude: -61.085215347408734,
            height: 880.6553925203925
        },
        radian: {
            positionGd: {
            longitude: -1.9554550285611647,
            latitude: -1.0661381321020542,
            height: 880.6553925203925
            }
        }
        }
        > d.gPosition(new Date()).degree;
        {
        longitude: -113.11061502556825,
        latitude: -59.681495773094326,
        height: 879.9431801066794
        }
     */
    gPosition(dateObj){
        var gmst = satellite.gstime(dateObj);
        var posAndVel = satellite.propagate(this.sat , dateObj);
        var positionGd = satellite.eciToGeodetic(posAndVel.position, gmst);
        var position = {
            'degree':{
                'longitude': (positionGd.longitude / Math.PI) * 180,
                'latitude': (positionGd.latitude / Math.PI) * 180,
                'height': positionGd.height
            },
            'radian':{
                positionGd
            }
        }
        return(position);
    }

    eciPosition(dateObj){
        return(satellite.propagate(this.sat , dateObj).position);
    }

    lookAngles(dateObj){
        var gmst = satellite.gstime(dateObj);
        var posAndVel = satellite.propagate(this.sat , dateObj);
        var positionEcf   = satellite.eciToEcf(posAndVel.position, gmst);
        var lookAngles    = satellite.ecfToLookAngles(this.observer, positionEcf);

        return({
            'degree':{
                'azimuth':(lookAngles.azimuth/Math.PI)*180,
                'elevation':(lookAngles.elevation/Math.PI)*180,
                'rangeSat':lookAngles.rangeSat
        },
        'radian':{
            'azimuth':lookAngles.azimuth,
            'elevation':lookAngles.elevation,
            'rangeSat':lookAngles.rangeSat
        }
    })
    }

    maxElevation(a,b,tol=1e-5){
        var goldenRatio = (Math.sqrt(5)+1)/2;
        var c = b - (b - a)/goldenRatio;
        var d = a + (b - a)/goldenRatio;
        var result;
        while(Math.abs(c-b)>tol){
            if(this.lookAngles(new Date(c*1000)).radian.elevation > this.lookAngles(new Date(d*1000)).radian.elevation){
                b = d;
            }
            else{
                a = c;
            }
            var c = b - (b - a)/goldenRatio;
            var d = a + (b - a)/goldenRatio;
        }
        result = (b+a)/2;
        return([this.lookAngles(new Date(result*1000)).radian.elevation,result]);
    }

    horizonTransition(a,b,tol=1e-5){
        var m = (a+b)/2;
        var fm = this.lookAngles(new Date(m*1000)).radian.elevation;
        while(Math.abs(fm)>=1e-5){
            if(fm*this.lookAngles(new Date(a*1000)).radian.elevation<0){
                b = m;
            }
            else{
                a = m;
            }
            m = (a+b)/2;
            fm = this.lookAngles(new Date(m*1000)).radian.elevation;;
        }
        return(m);
    }

    passes(startDate,duration,minAngle){
        var startU = startDate.getTime() / 1000;
        var rise;
        var set;
        var extrema = [];
        var passes = [];
        var anglesStart, anglesEnd, anglesMax;
        for(var s = startU; s<startU+duration;s+=this.period/2){
            extrema.push(this.maxElevation(s,s+this.period/2,1));
        }
        //console.log(extrema);
        for(var i=0;i<extrema.length;i++){
            if(extrema[i][0]>minAngle && extrema[i][1]>startU){
                rise = this.horizonTransition(extrema[i][1]-this.period/2,extrema[i][1],1); //UTC time start 
                set = this.horizonTransition(extrema[i][1],extrema[i][1]+this.period/2,1); //UTC time end
                anglesStart = this.lookAngles(new Date(rise *1000));
                anglesEnd = this.lookAngles(new Date(set*1000));
                anglesMax = this.lookAngles(new Date(extrema[i][1]*1000));
                passes.push(
                    {
                        "startAz":anglesStart.degree.azimuth,
                        "startEl":anglesStart.degree.elevation,
                        "startUTC":Math.round(rise),
                        "maxAz":anglesMax.degree.azimuth,
                        "maxEl":anglesMax.degree.elevation,
                        "maxUTC":Math.round(extrema[i][1]),
                        "endAz":anglesEnd.degree.azimuth,
                        "endEl":anglesEnd.degree.elevation,
                        "endUTC":Math.round(set),
                        "duration":Math.round(set-rise)
                    });
            }
        }
        return({
            "info":{
                "satid":this.id,
                "satname":this.satName,
                "passescount":passes.length
            },
            "passes":passes
        });
    }
    test(){
        return("HELLO")
    }

}

function goldenSearchMax1(f,a,b,tol=1e-5){
    var goldenRatio = (Math.sqrt(5)+1)/2;
    var c = b - (b - a)/goldenRatio;
    var d = a + (b - a)/goldenRatio;
    var result;
    while(Math.abs(c-b)>tol){
        if(f(c) > f(d)){
            b = d;
        }
        else{
            a = c;
        }
        var c = b - (b - a)/goldenRatio;
        var d = a + (b - a)/goldenRatio;
    }
    result = (b+a)/2;
    return([f(result),result]);
}

function bisection(f,a,b,tol=1e-5){
    var m = (a+b)/2;
    var fm = f(m);
    while(Math.abs(fm)>=1e-5){
        if(fm*f(a)<0){
            b = m;
        }
        else{
            a = m;
        }
        m = (a+b)/2;
        fm = f(m);
        console.log(m);
        console.log(fm);
    }
    return(m);
}



module.exports = satTrack; 