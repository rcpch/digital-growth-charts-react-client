import React, { Component } from 'react';
import './App.css';
import './components/MeasurementForm'
import 'semantic-ui-css/semantic.min.css'
// import MenuBar from './components/MenuBar'
import Footer from './components/Footer'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import References from './pages/References';
import Results from './pages/Results';


class App extends Component {

  render(){
    return <div className="App">
         <div>
          <Router>
              <MenuBar/>
              <Switch>
                  <Route exact path="/">
                    <Home/>
                  </Route>
                  <Route path="/references">
                    <References />
                  </Route>
                  <Route path="/results">
                    <Results />
                  </Route>
              </Switch>
          </Router> 
          <Footer/>
        </div>
      </div>
  }
}

export default App;
