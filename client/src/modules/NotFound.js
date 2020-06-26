import React, { Component } from 'react'

//Made Pages
import NavBar from './NavBar.js';


class NotFound extends Component {

    render(){

        return(
            <div class = "NotFound">
                <NavBar/>
                <div class="container fluid">
                    <div class="row">
                        <div class="col text-center">
                            <h1>404 Error: Page Not Found</h1>
                            <hr/>
                        </div>
                    </div>
                    <div class = "row">
                        <div class="col text-center">
                            <p>Please check the url is typed in correctly.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;
