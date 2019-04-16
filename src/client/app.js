import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SmallScreen from './components/SmallScreen';
import BigScreen from './components/BigScreen';

export default () => (
  <div>
    <Switch>
      <Route exact path="/client" component={SmallScreen} />
      <Route exact path="/BigScreen" component={BigScreen} />
    </Switch>
  </div>
);
