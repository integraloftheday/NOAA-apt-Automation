import React, { Component } from 'react'

//Made Pages
import NavBar from './NavBar.js';

class About extends Component {

    render(){


        return(
            <div className = "About">
                <NavBar active = {"About"}/>
                <div class="container fluid">
                    <div class="row">
                        <div class="col text-center">
                            <h1>About Page</h1>
                            <hr/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p>This website is dedicated to display NOAA15, NOAA18, and NOAA19 images downloaded using the Raspberry Pi on the roof. Satellite tracking provided by&nbsp;
                                <a href="https://www.n2yo.com">N2YO</a>. 
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-center">
                            <h3>Other Local websites</h3>
                            <hr/>
                        </div>
                    </div>
                    <div class ="row">
                        <div class="col">
                            <li><a href="http://10.0.1.89/dump1090/gmap.html">Airplane Tracking</a> </li>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-center">
                            <h3>Other Websites</h3>
                            <hr/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <li><a href="http://www.piTime.ml">PiTime</a></li>
                            <li><a href="https://integraloftheday.github.io">Integral of the Day</a></li>
                            <li><a href="http://ulamsknights.tk/">Ulams Knights</a></li>
                            <li><a href="https://integraloftheday.github.io/phasePortraits/">Phase Portrait Plotter</a></li>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default About;