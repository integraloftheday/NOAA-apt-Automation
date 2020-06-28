import React, { Component } from 'react'

//Made Pages
import NavBar from './NavBar.js';


class Pass extends Component {

    render(){
        const Time_Zone_Convert = new Date().getTimezoneOffset()*60;
        var passName; 
        passName = this.props.match.params.name;

        const main_DIR = "/USB/";
        const satName = passName.slice(0,6);
        const imgPath = main_DIR + passName+'.png';
        const wavePath = main_DIR + passName+'.wav';
        const PassTime = (parseInt(passName.slice(7,20))-Time_Zone_Convert) * 1000;
        console.log(passName.slice(7,20)); 
        var imgTag;

        if(true){ //TODO add some file catch system here.
            console.log(`TRUE ${imgPath}`);
             imgTag = <img class = "img-fluid float-left" alt="Weather Satellite" src={imgPath} /> ;
        }
        else{
            imgTag = <h1>Incorrect URL No such Pass</h1>;
        }

        return(
            <div class = "Pass">
            <NavBar/>
            <div class ="container-fluid" >
                <div class = 'row'>
                    <div class ='col text-center' style={{"padding": 15}}>
                    {imgTag}
                    </div>
                    <div class = 'col col-lg-2'>
                       <div class ='text-center'> <h1>Info</h1> </div>
                        <hr/>
                        <p>Satellite Name: {satName}</p>
                        <p>Time: {(new Date(PassTime)).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")}</p>
                        <div class ='text-center'> <h1>Controls</h1> </div>
                        <hr/>
                            <div class="row p-2">
                                <div class="col text-center">
                                    <form method="get" action={imgPath}>
                                    <button class = "btn btn-primary btn-block" type="submit">Image Download</button>
                                    </form>
                                </div>
                                </div>
                            <div class="row p-2">
                                <div class="col text-center">
                                    <form method="get" action={wavePath}>
                                    <button class = "btn btn-primary btn-block" type="submit">Audio Download</button>
                                    </form>
                                </div>
                            </div>

                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default Pass;