import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
//Made Pages 
import Home from './HomePage.js';
import List from './List.js'; 
import About from './About.js';
import Pass from './Pass.js';
import NotFound from './NotFound.js';
import Tracking from './Tracking.js'


const App = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path ='/' exact component={Home}/>
                <Route path ='/about' exact component={About}/>
                <Route path ='/list' exact component={List}/>
                <Route path ='/track' exact component={Tracking}/>
                <Route path ='/pass/:name' exact component ={Pass} />
                <Route path ='/' component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
  };
  
  export default App