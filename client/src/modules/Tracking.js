import React, { Component } from 'react'



//Made Pages
import NavBar from './NavBar.js';
import TrackList from './TrackList.js'

class Tracking extends Component {
state={
    "NOAA15":null,
    "NOAA18":null,
    "NOAA19":null
};

componentDidMount(){
    //Hard coded the latitude and longitude
    Promise.all([
      fetch("https://www.n2yo.com/rest/v1/satellite/radiopasses/25338/33.435130/-111.587890/0/1/10/&apiKey=K5AYJP-4HLLAN-DKE6WR-45RP").then(value => value.json()),
      fetch("https://www.n2yo.com/rest/v1/satellite/radiopasses/28654/33.435130/-111.587890/0/1/10/&apiKey=K5AYJP-4HLLAN-DKE6WR-45RP").then(value => value.json()),
      fetch("https://www.n2yo.com/rest/v1/satellite/radiopasses/33591/33.435130/-111.587890/0/1/10/&apiKey=K5AYJP-4HLLAN-DKE6WR-45RP").then(value => value.json())
      ])
      .then((value) => {
              this.setState({
                  "NOAA15":value[0],
                  "NOAA18":value[1],
                  "NOAA19":value[2]
              });
              //console.log(this.state);
      })
      .catch((err) => {
          console.log(err);
      });
}

    render(){
        var allPasses;
        var result;
        if(this.state.NOAA15 != null){
            this.state.NOAA15.passes.map((entry)=>{
                return(entry.satName ="NOAA15");
            });
            this.state.NOAA18.passes.map((entry)=>{
                return(entry.satName ="NOAA18");
            });
            this.state.NOAA19.passes.map((entry)=>{
                return(entry.satName ="NOAA19");
            })
            allPasses=(this.state.NOAA15.passes.concat(this.state.NOAA18.passes).concat(this.state.NOAA19.passes));
            allPasses.sort((a,b) =>{
                return(a.startUTC - b.startUTC); 
            });
            console.log(allPasses);
            result=allPasses.map((item)=>{
                return(<TrackList passInfo={item}/>)
            });
            console.log(result);
        }
        else{
            result=<h1>Loading</h1> 
        }

        return(
            <div class = "NotFound">
                <NavBar actice={"Track"}/>
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
