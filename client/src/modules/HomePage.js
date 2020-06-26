import React, { Component } from 'react'

//Made Pages
import NavBar from './NavBar.js';
import EmbededPass from './EmbededPass.js';

class HomePage extends Component {
    state = {
        "temp":0,
        "hud":0,
        "latestPass":null
    }

    componentDidMount(){

          Promise.all([
            fetch("http://10.0.1.89:81/api/v1/content/all/new").then(value => value.json()),
            fetch("http://10.0.1.89:81/api/v1/current/temp").then(value => value.json()),
            fetch("http://10.0.1.89:81/api/v1/current/hud").then(value => value.json())
            ])
            .then((value) => {
                
                if(value[0][0].success && value[1].success && value[2].success){
                    
                    this.setState({
                        "latestPass":value[0][0],
                        "temp":value[1].temperature,
                        "hud":value[2].humidity
                    });
                    console.log(this.state);
            }
            })
            .catch((err) => {
                console.log(err);
            });
}
    render(){


        if(this.state.latestPass != null){
            console.log("FILENAME");
            console.log(this.state.latestPass);
        return(
            <div class = "Home">
                <NavBar active = {"Home"}/>
                <div class="container fluid">
                    <div class="row">
                        <div class="col text-center">
                            <h1> Home Page </h1>
                            <hr/>
                        </div>
                    </div>
                    <div class ="row">
                        <div class="col text-center">
                            <h3>Current Temperature: {Math.round(this.state.temp * 1.8 + 32).toFixed(2)}˚&nbsp;&nbsp; &nbsp;&nbsp;Current Humidity: {this.state.hud}%</h3>
                        </div>
                    </div>
                </div>
                <EmbededPass passName={this.state.latestPass.fileName}/>
            </div>
        );
        }
        else{
            return(<div class ="Home"><NavBar active = {"Home"}/> <h1>Loading</h1></div>);
        }
    }
}

export default HomePage;
