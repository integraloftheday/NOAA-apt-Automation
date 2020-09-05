import React, { Component } from 'react';

//Made Pages
import NavBar from './NavBar.js';
import TrackList from './TrackList.js';


class Tracking extends Component {

    state={
        "config":null,
        "satPasses":null
    };

    componentDidMount(){
        //Hard coded the latitude and longitude
        var getUrl = window.location;
        var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
        baseUrl = "http://localhost:3000"; // for debugging
        var promisesUrl=[];
        fetch(baseUrl+"/api/v1/config")
            .then((config) => config.json())
            .then((config)=> {
                for(var i in config.tracking.ids){ //apiTrack(req.params.id,req.params.lat,req.params.long,req.params.alt,req.params.days,req.params.minAngle,(parsedJson)
                    promisesUrl.push(`${baseUrl}/api/v1/passes/${config.tracking.ids[i]}/${config.tracking.location.lat}/${config.tracking.location.long}/${config.tracking.location.alt}/${config.tracking.days}/${config.tracking.minAngle}`);
                }
                console.log(promisesUrl);
                Promise.all(promisesUrl.map(url => fetch(url).then(result =>result.json())))
                    .then((value) => {
                            console.log("Response")
                            console.log(value);
                            this.setState({
                                "satPasses":value
                            });
                            //console.log(this.state);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
    }

    render(){
        var allPasses=[];
        var result;
        if(this.state.satPasses!=null){
            for(var i in this.state.satPasses){
                console.log(this.state.satPasses[i].passes);
                allPasses = allPasses.concat(this.state.satPasses[i].passes);
                allPasses.sort((a,b) =>{
                    return(a.startUTC - b.startUTC); 
                });
                result=allPasses.map((item)=>{
                    return(<TrackList passInfo={item}/>)
                });
            }
            console.log("ALL PASSES");
            console.log(allPasses);
        }
        else{
            result=<h1>Loading</h1> 
        }

        return(
            <div class = "NotFound">
                <NavBar active={"Track"}/>
                <div class="container fluid">
                    <div class="row">
                        <div class="col text-center">
                            <h1>Tracking Page</h1>
                            <hr/>
                        </div>
                    </div>
                    <div class = "row">
                        <div class="col text-center">
                             {result}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tracking;
