import React, { Component } from 'react'
import {Link} from "react-router-dom"
import {Navbar, Nav } from 'react-bootstrap'

//media 
import logo from './media/NOAA_logo.svg'

class NavBar extends Component {
    render(){
        const active = this.props.active;
        console.log(this.props.active);
        // determines which is active
        var HomeA = "";
        var ListA = "";
        var AboutA = ""; 
        var TrackA =""
        switch(active){
            case "Home": 
                HomeA = "active";
                break;
            case "List": 
                ListA = "active";
                break;
            case "About": 
                AboutA = "active";
                break;
            case "Track":
                TrackA="active";
                break;
            default: 
                console.log("Incorrect prop");
                HomeA = "";
                break;
        }

        return(
            <Navbar expand="lg" class ="navbar navbar-expand-lg navbar-light" style={{"backgroundColor": "#e3f2fd"}} >
            <Navbar.Brand href="/">
                <img src = {logo} width="30" height="30" class="d-inline-block align-top" alt="" loading="lazy"/>
                &nbsp; Weather Images
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Link class={"nav-item nav-link " + HomeA}  to="/">Home <span class="sr-only">(current)</span></Link>
                <Link class={"nav-item nav-link " + ListA}  to="/list">List</Link>
                <Link class={"nav-item nav-link " + TrackA} to ="/track" > Track</Link>
                <Link class={"nav-item nav-link " + AboutA} to ="/about" > About</Link>
            </Nav>
            </Navbar.Collapse>
            </Navbar>
        )
    }
}

NavBar.defaultProps = {
    active: 'Home'
  };

export default NavBar;