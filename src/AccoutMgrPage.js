import classNames from "classnames";
import React, { Component } from "react";

import { Button } from "./components";

import { genRadmonAccount, XFSVERSION } from "./util/xfslib";

function Appbar(props) {
  return (
    <div className="appbar">
      <div className="appbar-left cur-p" onClick={() => props.history.goBack()}>
        <div className="appbar-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          </svg>
        </div>
      </div>
      <div className="appbar-title">
        {props.title}
      </div>
      <div className="appbar-right">
      </div>
    </div>
  );
}


function AccountList(props) {
  const { data, selectd, onItemClick } = props;
  return (
    <div className="accountmgr-list">
      <div className="accountmgr-list-data">
        {data.map((item) => {
          const itemiconclass = classNames(
            {
              [`d-none`]: (item.addr !== selectd),
            }, 'bi', 'bi-check-lg');
          return (
            <div className="accountmgr-list-item cur-p"
             key={item.addr} onClick={(e)=>{onItemClick(e, item.addr)}}>
              <div className="item-check">
                <div className="item-check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={itemiconclass} viewBox="0 0 16 16">
                    <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z" />
                  </svg>
                </div>
              </div>
              <div className="item-content">
                <div className="ft-125">
                  {item.name}
                </div>
                {/* <div className="ft-1">
                  {item.balance}
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

class AccountMgrPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      accountlist: [],
      defaultAddr: '',
    }
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let defaultAddr =  await accountdb.getDefault();
    let accountlist = await accountdb.listAllAccount();
    this.setState({
      accountlist: accountlist,
      defaultAddr: defaultAddr
    });
  }
  handleChangePassword(e) {
    let val = e.target.value;
    this.setState({ password: val });
  }
  handleImportKey(e) {
    const { history, db: { globaldb, accountdb } } = this.props;
    history.push('/keyimport');
  }
  handleToNetworkMgr(e) {
    const { history, db: { globaldb, accountdb } } = this.props;
    history.push('/networkmgr');
  }
  async handleAccountListSelect(e,addr) {
    const { history, db: { globaldb, accountdb } } = this.props;
    this.setState({defaultAddr: addr});
    await accountdb.setDefault(addr);
  }
  render() {
    return (
      <div>
        <Appbar {...this.props}
          title=""
        />
        <div className="cell page-title pv-20">
          All Accounts
        </div>
        <AccountList data={this.state.accountlist} 
        onItemClick={(e,addr)=>{this.handleAccountListSelect(e, addr)}}
        selectd={this.state.defaultAddr}/>
        <div className="cell pv-20 cell-border-b cur-p"
        onClick={()=>{
          this.props.history.push('/createwallet');
        }}>
          <div className="cell-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </div>
          <div className="cell-title">
            <span>Create Account</span>
          </div>
        </div>
        <div className="cell pv-20 cell-border-b cur-p" onClick={(e)=>{
          this.handleImportKey(e);
        }}>
          <div className="cell-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
            </svg>
          </div>
          <div className="cell-title">
            <span>Import Private Key</span>
          </div>
        </div>
        <div className="cell pv-20 cell-border-b cur-p" onClick={(e)=>{
          this.handleToNetworkMgr(e);
        }}>
          <div className="cell-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
            </svg>
          </div>
          <div className="cell-title">
            <span>Network Settings</span>
          </div>
        </div>
      </div>
    );
  }
}
export default AccountMgrPage;