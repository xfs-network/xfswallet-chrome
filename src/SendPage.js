import classNames from "classnames";
import { Base64 } from "js-base64";
import React, { Component } from "react";

import { Button, Notify } from "./components";
import { calcGasFee } from "./util/common";
import HttpJsonRpcClient from "./util/jsonrpcclient";
import { exportKey, signTransaction, Transaction } from "./util/xfslib";
import { atto2base, base2atto } from "./util/xfslibutil";

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


const MinimumGasLimit = 100;
const MinimumGasPrice = 100;
const DefaultGasLimit = '100';
const DefaultGasPrice = '100';
class SendPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toaddr: '',
      value: '',
      isComstomGas: false,
      gaslimit: DefaultGasLimit,
      gasprice: DefaultGasPrice,
      isAdvanced: false,
      data: '',
      fromaddr: '',
      networkid: -1
    }
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let {fromaddr, networkid} = history.location.state;
    this.setState({
      fromaddr: fromaddr,
      networkid: networkid,
    });
  }
  async handleSubmit(e) {
    const { history, db: { globaldb, accountdb } } = this.props;
    let valuedata = this.state.value;
    try {
      valuedata = base2atto(valuedata);
    }catch(e){
      Notify.error(`${e}`);
      return;
    }
    let acc = await accountdb.getAccount(this.state.fromaddr);
    let network = await globaldb.getNetwork(this.state.networkid);
    let nonce = await accountdb.getAddressNonce(this.state.fromaddr, this.state.networkid);
    
    // console.log('send-gaslimit',this.state.gaslimit);
    // console.log('send-gasprice',this.state.gasprice);
    let txdata = new Transaction({
      to: this.state.toaddr,
      value: valuedata,
      gasLimit: this.state.gaslimit,
      gasPrice: this.state.gasprice,
      data: this.state.data,
      nonce: nonce,
    });
    txdata.signWithPrivateKey(acc.key.key);
    let txdatajson = txdata.toJSON();
    let txjsonb64 = Base64.encode(txdatajson);
    let client = new HttpJsonRpcClient({url: network.rpcurl});
    try{
      let result = await client.call({
        method: 'TxPool.SendRawTransaction',
        params: {
          data: txjsonb64
        }
      });
      await accountdb.setAddressTx(this.state.fromaddr, this.state.networkid, txdata);
      await accountdb.setAddressNonce(this.state.fromaddr, this.state.networkid, nonce+1);
      await Notify.success('Send transaction succeeded');
      history.goBack();
    }catch(e){
      await Notify.error(e.message);
    }
  }
  render() {
    let gasfeeatto = calcGasFee(this.state.gasprice, this.state.gaslimit);
    let gasfee = atto2base(gasfeeatto);
    let comstomGasGroupClasses = classNames(
      {
        [`d-none`]: !this.state.isComstomGas,
      }, 'form-group', 'mb-10'
    );
    let advancedClasses = classNames(
      {
        [`d-none`]: !this.state.isAdvanced,
      }, 'form-group', 'mb-10'
    );

    let toaddrhintclasses = () => {
      let err = true;
      if (this.state.toaddr.length < 1){
        if (this.state.data.length > 0){
          err = false;
        }
      }else if(/^[0-9a-zA-Z]{33}$/.test(this.state.toaddr)){
        err = false;
      }
      return classNames(
        {
          ['hint-color-red']: err,
          ['hint-color-default']: !err
        }, 'form-hint'
      );
    }
    let valuehintclasses = () => {
      let err = true;
      if (this.state.value.length < 1){
        if (this.state.data.length > 0){
          err = false;
        }
      }else if(/^[0-9.]+$/.test(this.state.value)){
        err = false;
      }
      return classNames(
        {
          ['hint-color-red']: err,
          ['hint-color-default']: !err
        }, 'form-hint'
      );
    }
    let gaslimithintclasses = () => {
      let err = true;
      if(/^[0-9]+$/g.test(this.state.gaslimit)){
        let mGasLimit = parseInt(this.state.gaslimit);
        if (!isNaN(mGasLimit)){
          if (mGasLimit >= MinimumGasLimit){
            err = false;
          }
        }
      }
      return classNames(
        {
          ['hint-color-red']: err,
          ['hint-color-default']: !err
        }, 'form-hint'
      );
    }
    let gaspricehintclasses = () => {
      let err = true;
      if(/^[0-9]+$/.test(this.state.gasprice)){
        let mGasPrice = parseInt(this.state.gasprice);
        if (!isNaN(mGasPrice)){
          if (mGasPrice >= MinimumGasPrice){
            err = false;
          }
        }
      }
      return classNames(
        {
          ['hint-color-red']: err,
          ['hint-color-default']: !err
        }, 'form-hint'
      );
    }
    let datahintclasses = () => {
      let err = true;
      if (this.state.data.length === 0){
        err = false
      }else if(/^0[xX][0-9a-fA-F]+$/.test(this.state.data)){
        if (this.state.data.length % 2 === 0){
          err = false
        }
      }
      return classNames(
        {
          ['hint-color-red']: err,
          ['hint-color-default']: !err
        }, 'form-hint'
      );
    }
    let submitBtnDisabled = ()=>{
      if (this.state.toaddr.length === 0){
        if (this.state.data.length === 0){
          return true;
        }
      }else if(!/^[0-9a-zA-Z]{33}$/.test(this.state.toaddr)) {
        return true;
      }
      if (this.state.value.length === 0) {
        if (this.state.data.length === 0){
          return true;
        }
      }else if(!/^[0-9.]+$/.test(this.state.value)) {
        return true;
      }
      if (!/^[0-9]+$/g.test(this.state.gasprice)){
        return true;
      }
      if (!/^[0-9]+$/g.test(this.state.gaslimit)){
        return true;
      }
      if (this.state.data.length > 0){
        if (!/^0[xX][0-9a-fA-F]+$/.test(this.state.data)){
          return true;
        }
        if (this.state.data.length % 2 !== 0){
          return true;
        }
      }
      return false;
    };
    return (
      <div>
        <Appbar {...this.props}
          title="Send"
        />
        <div className="mt-20 pb-20">
          <form action="">
            <div className="form-group mb-10">
              <label className="form-label">
                To address
              </label>
              <div>
                <input type="text" className="form-control"
                  value={this.state.toaddr}
                  onChange={(e) => {
                    let val = e.target.value;
                    this.setState({ toaddr: val });
                  }}
                  placeholder="to address" />
                <small className={toaddrhintclasses()}>
                  Please enter the address.
                </small>
              </div>
            </div>
            <div className="form-group mb-10">
              <label className="form-label">
                Value
              </label>
              <div>
                <div className="input-group">
                  <input type="text" className="form-control"
                    value={this.state.value}
                    onChange={(e) => {
                      let val = e.target.value;
                      this.setState({ value: val });
                    }}
                    placeholder="value" />
                </div>
                <small className={valuehintclasses()}>
                  Please enter value.
                </small>
              </div>
            </div>
            <div className="form-group mb-10">
              <label className="form-label">
                GAS Fee
              </label>
              <div>
                <div className="input-group">
                  <input type="text" className="form-control"
                    value={`${gasfee} XFSC`}
                    disabled />
                  <div>
                    <small class="form-hint">
                      GAS Fee = GASLimit * GASPrice
                    </small>
                    <small class="form-hint">
                      Default Gas Limit: 1000, GAS Price: 1000
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="form-check cur-p">
                <input className="form-check-input" type="checkbox"
                  checked={this.state.isComstomGas}
                  onChange={(e) => {
                    let val = e.target.value;
                    let gasprice = this.state.gasprice;
                    let gaslimit = this.state.gaslimit;
                    if (this.state.isComstomGas){
                        gasprice = DefaultGasPrice;
                        gaslimit = DefaultGasLimit;
                    }
                    this.setState({ 
                      isComstomGas: !this.state.isComstomGas,
                      gaslimit: gaslimit,
                      gasprice: gasprice,
                    });
                   
                   
                  }} />
                <span className="form-check-label">
                  Comstom GAS
                </span>
              </label>
            </div>
            <div className={comstomGasGroupClasses}>
              <label className="form-label">Gas Price</label>
              <div>
                <div className="input-group">
                  <input type="text" className="form-control"
                    value={this.state.gasprice}
                    onChange={(e) => {
                      let val = e.target.value;
                      this.setState({ gasprice: val });
                    }} placeholder="GAS Price" />
                </div>
                <small className={gaspricehintclasses()}>
                  Please enter GAS Price.
                </small>
              </div>
            </div>
            <div className={comstomGasGroupClasses}>
              <label className="form-label">
                Gas Limit
              </label>
              <div>
                <div className="input-group">
                  <input type="text" className="form-control"
                    value={this.state.gaslimit}
                    onChange={(e) => {
                      let val = e.target.value;
                      this.setState({ gaslimit: val });
                    }} placeholder="GAS Limit" />
                </div>
                <small className={gaslimithintclasses()}>
                  Please enter GAS Limit.
                </small>
              </div>
            </div>
            <div className="form-group mb-3">
              <label className="form-check cur-p">
                <input className="form-check-input" type="checkbox"
                  checked={this.state.isAdvanced}
                  onChange={(e) => {
                    let val = e.target.value;
                    this.setState({ isAdvanced: !this.state.isAdvanced });
                  }}
                />
                <span className="form-check-label">
                  Open advanced
                </span>
              </label>
            </div>
            <div className={advancedClasses}>
              <label className="form-label">Data</label>
              <div>
                <div className="input-group">
                  <textarea class="form-control" rows="3"
                    placeholder="0x"
                    value={this.state.data}
                    onChange={(e) => {
                      let val = e.target.value;
                      this.setState({ data: val });
                    }} ></textarea>
                </div>
                <small className={datahintclasses()}>
                  Please enter data.
                </small>
              </div>
            </div>
            <div class="form-footer">
              <Button 
              onClick={async (e)=>{this.handleSubmit(e)}}
              disabled={submitBtnDisabled()} 
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
export default SendPage;