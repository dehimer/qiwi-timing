import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SmallScreen from './components/SmallScreen/index';
import BigScreen from './components/BigScreen/index';

import './app.css'

export default () => (
  <Switch>
    <Route path="/server" component={BigScreen} />
    <Route path="/client" component={SmallScreen} />
  </Switch>
);
