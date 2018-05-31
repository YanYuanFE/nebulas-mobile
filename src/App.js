import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
import DashBoard from './containers/dashboard';
import Vote from './containers/vote';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
            <Switch>
              <Route exact path="/" component={DashBoard} />
              <Route path="/vote" component={Vote} />
            </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
