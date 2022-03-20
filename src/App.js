import React, { Component, createContext, useContext, useState } from "react";

import {
  Switch,
  Route,
  Redirect,
  Router,
} from "react-router-dom";

import './App.css';
import Initial from "./Initial";
import CreatePage from "./CreatePage";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage"
import SendPage from "./SendPage";
import AccoutMgrPage from "./AccoutMgrPage";
import AccountDetailPage from "./AccountDetailPage";
import CreateWalletPage from "./CreateWalletPage";
import KeyExportPage from "./KeyExportPage";
import KeyImportPage from "./KeyImportPage";
import NetworkMgrPage from "./NetworkMgrPage";
import NewNetwork from "./newnetwork";
import NetworkDetail from "./networkdetail";
import ResetNoncePage from "./resetnoncepage";
import ConnectPage from './ConnectPage';
import SendTxPage from './SendTxPage';
function PrivateRoute({ children, initialed, authed,path, ...props }) {
  console.log('privateroute', path);
  return <Route {...props} render={() => {
    if (initialed && authed) {
      return (children);
    }else if(!initialed){
      return <Redirect to={{
        pathname: '/initial',
        state: {from: path},
      }} />
    } else {
      return <Redirect to={{
        pathname: '/auth',
        state: {from: path},
      }} />
    }
  }} />
}
function setTimeoutAsync(t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, t);
  })
}


function ProvideAuth({ children, authed }) {
  return (
    <div>
      {children}
    </div>
  );
}

function InitialRoute({ children, initialed, ...props  }) {
  const {history} = props;
  const {location: {state}} = history;
  if (initialed) {
    history.replace(state.from||'/');
  }
  return <Route {...props}>
    {children}
  </Route>;
}

function AuthRoute({ children, authed, ...props  }) {
  const {history} = props;
  const {location: {state}} = history;
  if (authed) {
    history.replace(state.from||'/');
  }
  return <Route {...props}>
    {React.cloneElement(children)}
  </Route>;
}

async function checkAuth(globaldb) {
  let last = await globaldb.getPasswordLockTime();
  if (!last){
    return false;
  }
  let now = new Date().getTime();
  return !(now - last > 0);
}
async function checkInitialization(globaldb) {
  let pass = await globaldb.getPassword();
  if (!pass) {
    return false;
  }
  return true;
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      initialed: false,
      pageState: false,
      launchParams: {}
    }
  }

  async componentDidMount() {
    const {history, db: { extradb, globaldb } } = this.props;
    let initiated = await checkInitialization(globaldb);
    let authed = await checkAuth(globaldb);
    this.setState({ initialed: initiated, authed: authed});
    const pageState = await extradb.popPageState();
    if (pageState){
      console.log('pushle', pageState);
      this.setState({launchParams: {...pageState}});
      history.push(pageState.page);
    }
  }
  async unlockPassword(){
    this.setState({authed: true });
  }
  async setupPassword(){
    this.setState({initialed: true });
  }
  render() {
    return (
      <ProvideAuth {...this.state}>
        <Router {...this.props}>
          <Switch>
            <PrivateRoute exact path="/" {...this.props} {...this.state}>
              <HomePage {...this.props} {...this.state}/>
            </PrivateRoute>
            <InitialRoute exact path="/initial" {...this.props} {...this.state}>
              <Initial {...this.props} {...this.state }/>
            </InitialRoute>
            <AuthRoute exact path="/auth" {...this.props} {...this.state} >
              <AuthPage {...this.props} unlockPasswordFn={()=>{this.unlockPassword()}}/>
            </AuthRoute>
            <Route exact path="/createpage">
              <CreatePage {...this.props} 
              setupPasswordFn={()=>{this.setupPassword()}}
              unlockPasswordFn={()=>{this.unlockPassword()}}
              />
            </Route>
            <Route exact path="/keyimport" {...this.props} {...this.state}>
              <KeyImportPage {...this.props}/>
            </Route>
            <PrivateRoute exact path="/send" {...this.props} {...this.state}>
              <SendPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/accountmgr" {...this.props} {...this.state}>
              <AccoutMgrPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/accountdetail" {...this.props} {...this.state}>
              <AccountDetailPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/accountdetail" {...this.props} {...this.state}>
              <AccountDetailPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/createwallet" {...this.props} {...this.state}>
              <CreateWalletPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/keyexport" {...this.props} {...this.state}>
              <KeyExportPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/keyimport" {...this.props} {...this.state}>
              <KeyImportPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/networkmgr" {...this.props} {...this.state}>
              <NetworkMgrPage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/newnetwork" {...this.props} {...this.state}>
              <NewNetwork {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/networkdetail" {...this.props} {...this.state}>
              <NetworkDetail {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/resetnonce" {...this.props} {...this.state}>
              <ResetNoncePage {...this.props}/>
            </PrivateRoute>
            <PrivateRoute exact path="/connect" {...this.props} {...this.state}>
              <ConnectPage {...this.props} {...this.state}/>
            </PrivateRoute>
            <PrivateRoute exact path="/sendtx" {...this.props} {...this.state}>
              <SendTxPage {...this.props} {...this.state}/>
            </PrivateRoute>
          </Switch>
        </Router>
      </ProvideAuth>

    );
  }
}
export default App;
