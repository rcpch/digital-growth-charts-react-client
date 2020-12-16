// React
import React, { Component } from "react";
import "./App.css";

// React Router DOM
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// RCPCH Components
import "./components/MeasurementForm";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import References from "./pages/References";
import Results from "./pages/Results";
import Spreadsheet from "./pages/Spreadsheet";
import SerialResults from "./pages/SerialResults";
import HeaderBar from "./components/HeaderBar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <Router>
            <HeaderBar />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/references">
                <References />
              </Route>
              <Route path="/results">
                <Results />
              </Route>
              <Route path="/serial_results">
                <SerialResults />
              </Route>
              <Route path="/spreadsheet">
                <Spreadsheet />
              </Route>
            </Switch>
          </Router>
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
