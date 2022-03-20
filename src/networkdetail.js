import classNames from "classnames";
import React, { Component } from "react";

import { Button, Notify } from "./components";

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


class NetworkDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      id: '',
      rpcurl: '',
      lock: false,
    }
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let currentNetid = history.location.state.id;
    let netdata = await globaldb.getNetwork(currentNetid);
    this.setState({
      name: netdata.name,
      id: `${netdata.id}`,
      rpcurl: netdata.rpcurl,
      lock: netdata.lock
    });
  }
  async handleSubmit(e){
    const { history, db: { globaldb, accountdb } } = this.props;
    if (this.state.lock){
      await Notify.warning('Network is locked', 2500);
      return;
    }
    let netdata = {
      id: parseInt(this.state.id),
      name: this.state.name,
      rpcurl: this.state.rpcurl,
      lock: false,
    }
    let old = await globaldb.getNetwork(netdata.id);
    if (old && old.id != this.state.id){
      await Notify.warning('Network ID already exists', 2500);
      return;
    }
    await globaldb.setNetwork(netdata);
    await Notify.success('Successful append new network');
  }
  async handleRemove(e){
    const { history, db: { globaldb, accountdb } } = this.props;
    if (this.state.lock){
      await Notify.warning('Network is locked', 2500);
      return;
    }
    let networks = await globaldb.listAllNetwork();
    if (networks.length <= 1){
      Notify.warning('Keep at least one network', 2500);
      return;
    }
    let resetdef = networks[0].id;
    if (this.state.id === resetdef){
      resetdef = networks[1].id;
    }
    await globaldb.delNet(this.state.id);
    await globaldb.setDefaultNet(resetdef);
    await Notify.success('Successful removed network');
    history.goBack();
  }
  render() {
    let nameinputhintclassnames = ()=>{
      let err = false;
      if (this.state.name.length < 1) {
        err = true;
      }
      return classNames(
        {
          [`hint-color-red`]: err,
          [`hint-color-default`]: !err
        }, 'form-hint'
      );
    }
    let idinputhintclassnames = ()=>{
      let err = false;
      if (this.state.id.length < 1) {
        err = true;
      }else if(!/^[0-9]+/.test(this.state.id)){
        err = true;
      }
      return classNames(
        {
          [`hint-color-red`]: err,
          [`hint-color-default`]: !err
        }, 'form-hint'
      );
    }
    let rpcurlinputhintclassnames = () => {
      let err = false;
      if (this.state.rpcurl.length < 1) {
        err = true;
      }else {
        if (!/^(http|https):\/\/.+/.test(this.state.rpcurl)){
          err = true;
        }
      }
      return classNames(
        {
          [`hint-color-red`]: err,
          [`hint-color-default`]: !err
        }, 'form-hint'
      );
    }
    let submitbtndisabled = () => {
      if (this.state.lock){
        return true;
      }
      let err = false;
      if (this.state.name.length < 1) {
        err = true;
        return err;
      }
      if (this.state.id.length < 1) {
        err = true;
        return err;
      }else if(!/^[0-9]+/.test(this.state.id)){
        err = true;
        return err;
      }
      if (!/^(http|https):\/\/.+/.test(this.state.rpcurl)){
        err = true;
        return err;
      }
      return err;
    }
    return (
      <div>
        <Appbar {...this.props}
          title=""
        />
        <div className="cell page-title pv-20">
          Network Detail
        </div>
        <div className="pb-20">
          <form action="">
            <div className="form-group mb-10">
              <label className="form-label">Network name</label>
              <div>
                <input type="text" className="form-control"
                  value={this.state.name}
                  onChange={(e)=>{
                    let val = e.target.value;
                    this.setState({name: val})
                  }} placeholder="Network name" disabled={this.state.lock}/>
                <small className={nameinputhintclassnames()}>
                  Please enter a network name.
                </small>
              </div>
            </div>
            <div className="form-group mb-10">
              <label className="form-label">Network id</label>
              <div>
                <div className="input-group">
                  <input type="text" className="form-control"
                   value={this.state.id}
                    onChange={(e)=>{
                      let val = e.target.value;
                      this.setState({id: val})
                    }} placeholder="Network id" disabled={this.state.lock}/>
                </div>
                <small className={idinputhintclassnames()}>
                  Please enter the network id.
                </small>
              </div>
            </div>
            <div className="form-group mb-10">
              <label className="form-label">RPC URL</label>
              <div>
                <div className="input-group">
                  <input type="text" className="form-control"
                  value={this.state.rpcurl}
                    onChange={(e)=>{
                      let val = e.target.value;
                      this.setState({rpcurl: val})
                    }} placeholder="RPC URL address" disabled={this.state.lock}/>
                </div>
                <small className={rpcurlinputhintclassnames()}>
                  Please enter RPC URL address.
                </small>
              </div>
            </div>
            <div class="form-footer">
              <Button
                style={{
                  marginBottom: '10px',
                }}
                disabled={submitbtndisabled()}
                onClick={async (e)=>{this.handleSubmit(e)}}
                color="primary">
                  Submit
              </Button>
              <Button
                disabled={this.state.lock}
                onClick={async (e)=>{this.handleRemove(e)}}
                color="danger">
                  Remove
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default NetworkDetail;