import React, { Component } from 'react'

//Made Pages
import NavBar from './NavBar.js';
import ListThumbNail from './ListThumbNail.js'

class List extends Component {
    state = {
        "passes":[],
    };

      // Code is invoked after the component is mounted/inserted into the DOM tree.
    componentDidMount() {
        const url =
        'http://10.0.1.89:81/api/v1/content/all/new'
        fetch(url)
        .then(result => result.json())
        .then(result => {
            this.setState({
            "passes": result,
            });
            console.log(this.state.passes);
        })
    }

    render(){
        var listResult;
        const passes = this.state.passes;
        if(passes.length >0){
            console.log(passes);
            listResult = passes.map((item) => {
            return( <ListThumbNail passInfo={item}/>)
        });
    }
    else{
    listResult = " ";
    }

        return(
            <div class = "List">
            
                <NavBar active = {"List"}/>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col text-center">
                            <h1> List Page </h1>
                            <hr/>
                    </div>
                </div>
                {listResult}
                </div>
            </div>
        );
    }
}

export default List;
