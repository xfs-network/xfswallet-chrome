import React, { Component } from "react";

import {
  Switch,
  Route
} from "react-router-dom";

import './App.css';
import Initial from "./Initial";
import CreatePage from "./CreatePage";
import HomePage from "./HomePage";
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



async function checkAuth(globaldb) {
  let pass = await globaldb.getPassword();
  if (!pass) {
    return false;
  }
  return true;
}

function AuthPage({ history, db: { globaldb } }, c) {
  checkAuth(globaldb).then(function (r) {
    if (r) {
      return c;
    } else {
      history.replace('/initial');
    }

  });
}

class App extends Component {
  render() {
    
    return (
      <div>
        <Switch>
          <Route exact path="/" component={AuthPage(this.props, HomePage)}
            render={() => {
              return (<HomePage {...this.props} />);
            }} />
          <Route exact path="/send" component={AuthPage(this.props, SendPage)}
            render={() => {
              return (<SendPage {...this.props} />);
            }} />
          <Route exact path="/accountmgr" component={AuthPage(this.props, AccoutMgrPage)}
            render={() => {
              return (<AccoutMgrPage {...this.props} />);
            }} />
          <Route exact path="/accountdetail" component={AuthPage(this.props, AccountDetailPage)}
            render={() => {
              return (<AccountDetailPage {...this.props} />);
            }} />
          <Route exact path="/createwallet" component={AuthPage(this.props, CreateWalletPage)}
            render={() => {
              return (<CreateWalletPage {...this.props} />);
            }} />
          <Route exact path="/keyexport" component={AuthPage(this.props, KeyExportPage)}
            render={() => {
              return (<KeyExportPage {...this.props} />);
            }} />
          <Route exact path="/keyimport" component={AuthPage(this.props, KeyImportPage)}
            render={() => {
              return (<KeyImportPage {...this.props} />);
            }} />
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
          </Route>
          
          <Route exact path="/initial" >
            <Initial {...this.props}></Initial>
          </Route>
        </Switch>
      </div>
    );
  }
}
export default App;