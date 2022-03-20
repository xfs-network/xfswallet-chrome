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


class NewNetwork extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      id: '',
      rpcurl: ''
    }
  }

  async handleSubmit(e){
    const { history, db: { globaldb, accountdb } } = this.props;
    let netdata = {
      id: parseInt(this.state.id),
      name: this.state.name,
      rpcurl: this.state.rpcurl,
      lock: false,
    }
    let old = await globaldb.getNetwork(netdata.id);
    if (old){
      await Notify.warning('Network ID already exists', 2500);
      return;
    }
    await globaldb.setNetwork(netdata);
    await Notify.success('Successful append new network');
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
          New Network
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
                  }} placeholder="Network name" />
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
                    }} placeholder="Network id" />
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
                    }} placeholder="RPC URL address" />
                </div>
                <small className={rpcurlinputhintclassnames()}>
                  Please enter RPC URL address.
                </small>
              </div>
            </div>
            <div class="form-footer">
              <Button
                disabled={submitbtndisabled()}
                onClick={async (e)=>{this.handleSubmit(e)}}
                color="primary">
                  Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default NewNetwork;