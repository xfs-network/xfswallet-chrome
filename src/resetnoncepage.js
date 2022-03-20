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

class ResetNoncePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      nonce: '',
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
    await accountdb.setAddressNonce(
      this.state.addr, this.state.netid, 
      this.state.nonce);
    await Notify.success('Save Success');
    history.goBack();
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let addr = history.location.state.addr;
    let netid = history.location.state.netid;
    let nonce = await accountdb.getAddressNonce(addr, netid);
    this.setState({nonce: nonce, addr: addr, netid: netid});
  }
  render() {
    let inputHintClasses = ()=>{
      let err = true;
      if (/^[0-9]+$/.test(this.state.nonce)){
        err = false;
      }
      return classNames(
        {
          [`hint-color-default`]: !err, 
          [`hint-color-red`]: err
        }, 'form-hint');
    }
    let createbtndisenabled = ()=>{
      let disenabled = true;
      if (/^[0-9]+$/g.test(this.state.nonce)){
        disenabled = false;
      }
      return disenabled;
    };
    return (
      <div>
        <Appbar {...this.props}
          title=""
        />
        <div className="cell page-title" style={{
          paddingTop: '20px',
          paddingBottom: '20px'
        }}>
          Reset Nonce
        </div>
        <div className="pb-20">
          <form action="">
            <div className="form-group mb-10">
              <label htmlFor="name"  className="form-label" >
                Nonce
              </label>
              <div>
                <input type="text" 
                value={this.state.nonce} 
                onChange={(e)=>{
                  let val = e.target.value;
                  this.setState({ nonce: val });
                }}
                 className="form-control" 
                 placeholder="Nonce" />
                <small className={inputHintClasses()}>
                  Please enter nonce number
                </small>
              </div>
            </div>
            <div class="form-footer">
              <Button color="primary"
                disabled={createbtndisenabled()}
                onClick={async (e)=>this.handleSubmitUpdate(e)}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default ResetNoncePage;