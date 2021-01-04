import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { AddressesList } from './pages/AddressesList';
import { Profile } from './pages/Profile';
import { GenerateWrapper } from './pages/GenerateWrapper';
import { ImportWrapper } from './pages/ImportWrapper';
import { GeneratePage } from './pages/GeneratePage';
import { ImportPage } from './pages/ImportPage';
import { ActivatePage } from './pages/ActivatePage';
import { Wallet } from './pages/Wallet';
import { PrivateWrapper } from './components/PrivateWrapper';

export const PrivateRoute = () => (
  <PrivateWrapper>
    <Switch>
      <Route path={["/", "/list"]} exact>
        <AddressesList />
      </Route>
      <Route path="/profile" exact>
        <Profile />
      </Route>
      <Route path="/generate">
        <GenerateWrapper />
      </Route>
      <Route path="/import">
        <ImportWrapper />
      </Route>
      <Route path="/wallet/:address" exact>
        <Wallet />
      </Route>
      <Redirect from="*" to="/list" />
    </Switch>
  </PrivateWrapper>
);

export const PublicRoute = () => (
  <Switch>
    <Route path={["/", "/login"]} exact>
      <AuthPage />
    </Route>
    <Redirect from="*" to="/login" />
  </Switch>
);

export const GenerateRoute = () => (
  <Switch>
    <Route path="/generate" exact>
      <GeneratePage />
    </Route>
    <Route path="/generate/new" exact>
      <GeneratePage />
    </Route>
    <Route path="/generate/activate" exact>
      <ActivatePage />
    </Route>
    <Redirect to="/generate/new" />
  </Switch>
);

export const ImportRoute = () => (
  <Switch>
    <Route path="/import" exact>
      <ImportPage />
    </Route>
    <Route path="/import/new" exact>
      <ImportPage />
    </Route>
    <Route path="/import/activate" exact>
      <ActivatePage />
    </Route>
    <Redirect to="/import/new" />
  </Switch>
);
