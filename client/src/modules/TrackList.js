import React, { Component } from 'react'

//Made Pages

class TrackList extends Component {

    render(){
        const data = this.props.passInfo; 
        const Time_Zone_Convert = new Date().getTimezoneOffset()*60;
        //example data
        /*{
            "startAz": 181.49,
            "startAzCompass": "S",
            "startUTC": 1592023450,
            "maxAz": 261.13,
            "maxAzCompass": "W",
            "maxEl": 45.39,
            "maxUTC": 1592023910,
            "endAz": 339.11,
            "endAzCompass": "NNW",
            "endUTC": 1592024370,
            "satName": "NOAA18"
            }*/
        return(
            <div class="container">
                <div class="row p-3">
                    <div class="col text-center">
                        <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">{data.satName}</th>
                            <th scope="col">Start</th>
                            <th scope="col">End</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Max Elevation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row"></th>
                            <td>{(new Date((data.startUTC - Time_Zone_Convert) *1000)).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")}</td>
                            <td>{(new Date((data.endUTC - Time_Zone_Convert) *1000)).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")}</td>
                            <td>{Math.round((data.endUTC-data.startUTC)/60)}m:{(data.endUTC-data.startUTC)%60}s</td>
                            <td>{Math.round(data.maxEl)}˚</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrackList;
