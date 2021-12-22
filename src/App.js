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

// function PrivateRoute({ children, authed, ...props }) {
//   let auth = useAuth();
//   console.log('auth', auth);
//   console.log('authed', authed);
//   return <Route {...props} render={() => {
//     return auth.user
//       ? (children)
//       : <Redirect to='/initial' />
//   }} />
// }

function PrivateRoute({ children, initialed, authed, ...props }) {
  console.log('aaaaa', authed, initialed);
  return <Route {...props} render={() => {
    return initialed && authed
      ? (children)
      : <Redirect to='/auth' />
  }} />
}
function setTimeoutAsync(t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, t);
  })
}
async function checkAuth(globaldb) {
  let pass = await globaldb.getPassword();
  if (!pass) {
    return false;
  }
  return true;
}

function ProvideAuth({ children, authed }) {
  console.log('privce auth', authed);
  return (
    <div>
      {children}
    </div>
  );
}

function AsyncRoute({ children, authed, ...props  }) {
  console.log('AsyncRoute', authed, props);
  // console.log();
  const {history} = props;
  console.log(history);
  if (authed) {
    history.push('/');
  }
  return <Route {...props} render={() => {
    return !authed
      ? (children)
      : <Redirect to='/' />
  }} />;
}

function InitialRoute({ children, initialed, ...props  }) {
  console.log('InitialRoute', initialed, props);
  // console.log();
  const {history} = props;
  // console.log(history);
  if (initialed) {
    // history.push('/');
    console.log('InitialRoute:push');
  }
  return <Route {...props}>
    {children}
  </Route>;
}

function AuthRoute({ children, authed, ...props  }) {
  console.log('AuthRoute', authed, props);
  // console.log();
  const {history} = props;
  // console.log(history);
  if (authed) {
    // history.push('/');
    console.log('AuthRoute:push');
  }
  return <Route {...props}>
    {children}
  </Route>;
}
class App extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {
      authed: false,
      initialed: false,
    }
  }

  async componentDidMount() {
    const { db: { extradb, globaldb } } = this.props;
    let authed = await checkAuth(globaldb);
    await setTimeoutAsync(5000);
    // this.setState({ authed: true });
  }
  render() {
    return (
      <ProvideAuth {...this.state}>
        <Router {...this.props}>
          <Switch>
            <PrivateRoute exact path="/" {...this.props} {...this.state}>
              <HomePage {...this.props} />
            </PrivateRoute>
            <InitialRoute exact path="/initial" {...this.props} {...this.state}>
              <Initial {...this.props} />
            </InitialRoute>
            <AuthRoute exact path="/auth" {...this.props} {...this.state}>
              <AuthPage {...this.props} />
            </AuthRoute>
            <Route exact path="/createpage">
              <CreatePage {...this.props} />
            </Route>
            {/* <Route exact path="/send" element={
            <RequireAuth {...this.props}>
              <SendPage {...this.props}/>
            </RequireAuth>
          } />
          <Route exact path="/accountmgr" element={
            <RequireAuth {...this.props}>
              <AccoutMgrPage {...this.props}/>
            </RequireAuth>
          } />
          <Route exact path="/accountdetail" element={
            <RequireAuth {...this.props}>
              <AccountDetailPage {...this.props}/>
            </RequireAuth>
          } />
          <Route exact path="/createwallet" element={
            <RequireAuth {...this.props}>
              <CreateWalletPage {...this.props}/>
            </RequireAuth>
          }  />
          <Route exact path="/keyexport" element={
            <RequireAuth {...this.props}>
              <KeyExportPage {...this.props}/>
            </RequireAuth>
          } />
          <Route exact path="/keyimport" element={
            <RequireAuth {...this.props}>
              <KeyImportPage {...this.props}/>
            </RequireAuth>
          } />
          <Route exact path="/networkmgr">
            <NetworkMgrPage {...this.props}></NetworkMgrPage>
          </Route>
          <Route exact path="/newnetwork">
            <NewNetwork {...this.props}></NewNetwork>
          </Route>
          <Route exact path="/networkdetail">
            <NetworkDetail {...this.props}></NetworkDetail>
          </Route>
          <Route exact path="/resetnonce">
            <ResetNoncePage {...this.props}></ResetNoncePage>
          </Route>
          <Route exact path="/createpage">
            <CreatePage {...this.props}></CreatePage>
          </Route> */}


          </Switch>
        </Router>
      </ProvideAuth>

    );
  }
}
export default App;