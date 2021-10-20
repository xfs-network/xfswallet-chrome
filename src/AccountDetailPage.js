import classNames from "classnames";
import React, { Component } from "react";

import { Button,Notify } from "./components";
import { genRadmonAccount, XFSVERSION, exportKey } from "./util/xfslib";
function Appbar(props) {
  return (
    <div className="appbar">
      <div className="appbar-left cur-p" onClick={()=>props.history.goBack()}>
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

class AccountDetailPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      addr: '',
      netid: '',
    }
  }
  handleChangeName(e){
    let val = e.target.value;
    this.setState({name: val});
  }
  async handleSubmitUpdate(e){
    const { history, db: { globaldb, accountdb } } = this.props;
    await accountdb.setAddressName(this.state.addr, this.state.name);
    Notify.success('Save Success');
  }
  async handleExportKey(e){
    const { history, db: { globaldb, accountdb } } = this.props;
    let acc = await accountdb.getAccount(this.state.addr);
    history.push('/keyexport', {addr:this.state.addr});
  }
  async handleRemoveAddr(){
    const { history, db: { globaldb, accountdb } } = this.props;
    let allAccount = await accountdb.listAllAccount();
    if (allAccount.length <= 1){
      Notify.warning('Keep at least one account', 3000);
      return;
    }
    let resetdef = allAccount[0].addr;
    if (this.state.addr === resetdef){
      resetdef = allAccount[1].addr;
    }
    await accountdb.delAddress(this.state.addr);
    await accountdb.setDefault(resetdef);
    history.goBack();
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let gotaddr = history.location.state.addr;
    let netid = history.location.state.netid;
    let account = await accountdb.getAccount(gotaddr);
    this.setState({
      netid: netid,
      ...account
    });
  }
  async handleCleanTxs(){
    const { history, db: { globaldb, accountdb } } = this.props;
    await accountdb.delAddressTxsByNetid(this.state.addr, this.state.netid);
    await Notify.success('Successfully clean');
  }
  async handleResetNonce(){
    const { history, db: { globaldb, accountdb } } = this.props;
    history.push('/resetnonce', {addr: this.state.addr, netid: this.state.netid});
  }
  render() {
    let nameInputHintClasses = classNames(
      {
        [`hint-color-default`]: (this.state.name && this.state.name.length > 0), 
        [`hint-color-red`]: (!this.state.name || this.state.name.length < 1)
      }, 'form-hint');
    let createbtndisenabled = (!this.state.name || this.state.name.length < 1);
    return (
      <div>
        <Appbar {...this.props}
          title=""
        />
        <div className="cell page-title" style={{
          paddingTop: '20px',
          paddingBottom: '20px'
        }}>
          Wallet Settings
        </div>
        <div className="pb-20">
          <form action="">
            <div className="form-group mb-10">
              <label htmlFor="address" className="form-label">Address</label>
              <div>
                <input type="text" value={this.state.addr}
                 className="form-control" 
                 name="address" readOnly/>
              </div>
            </div>
            <div className="form-group mb-10">
              <label htmlFor="name"  className="form-label" >Name</label>
              <div>
                <input type="text" value={this.state.name} 
                onChange={(e)=>{this.handleChangeName(e)}}
                 className="form-control" 
                 name="name" placeholder="Name" />
                <small className={nameInputHintClasses}>
                  Please enter wallet name
                </small>
              </div>
            </div>
            <div class="form-footer">
              <Button color="primary"
                disabled={createbtndisenabled}
                onClick={async (e)=>this.handleSubmitUpdate(e)}>
                Submit
              </Button>
              <hr/>
              <Button
                onClick={async ()=>this.handleExportKey()}>
                Export Key
              </Button>
              <hr/>
              <Button
                onClick={async ()=>this.handleCleanTxs()}>
                Clean Local Transactions
              </Button>
              <hr/>
              <Button
                onClick={async ()=>this.handleResetNonce()}>
                Reset nonce
              </Button>
              <hr/>
              <Button
                color="danger"
                onClick={async ()=>this.handleRemoveAddr()}>
                Remove
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default AccountDetailPage;