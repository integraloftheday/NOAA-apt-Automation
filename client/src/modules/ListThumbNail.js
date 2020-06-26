import React, { Component } from 'react'
import {Container, Row, Col, Image } from 'react-bootstrap'
import {Redirect} from "react-router-dom"

class ListThumbNail extends Component {
    state ={'redirect':false};
    /*
    Example props
    {
        "success": true,
        "satName": "NOAA19",
        "passTime": 1585140083,
        "isImage": false,
        "fileName": "NOAA19_1585140083"
    },
    */
   handleOnClick = () => {
    // some action...
    // then redirect
    console.log("Changing")
    console.log(this.state.redirect);
    this.setState({redirect: true});
  }

   render(){
       const Time_Zone_Convert = 25200;
       const data = this.props.passInfo; 
       if (this.state.redirect === true) {
        return <Redirect push to={"/pass/"+data.fileName} />;
      }
      else if(data.sucess === false){
          return(" ");
      }
   return(
       <div class="ListThumbNail">
            <Container onClick={ () => {this.handleOnClick()}}>
                <Row>
                    <Col>
                    <hr/>
                    <Row >
                    <Col md="auto" class="text-left" href="/" >
                    <Image src={"/USB/"+data.fileName+".png"} thumbnail width ="100" height="100" />
                    </Col>
                    <Col>
                    <h3>{data.satName}</h3>
                    <h3> {(new Date((data.passTime - Time_Zone_Convert) *1000)).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")}</h3>
                    </Col>
                    </Row> 
                    <hr/>
                    </Col>
                </Row>
            </Container>
       </div>

   );
   }
}

export default ListThumbNail
