import classNames from "classnames";
import React, { Component } from "react";

import { Button,Notify } from "./components";
import { genRadmonAccount, XFSVERSION, exportKey,importKey } from "./util/xfslib";
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

class KeyExportPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keyhex: '',
    }
  }
  handleChangeKeyInput(e) {
    let val = e.target.value;
    this.setState({ keyhex: val });
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
  }
  async handleImportKey(e){
    const { history, db: { globaldb, accountdb } } = this.props;
    let pack = null;
    try{
      pack = importKey(this.state.keyhex);
    }catch(e){
      Notify.error(`${e}`, 3000);
      return;
    }
    if (!pack){
      Notify.error('Import error', 3000);
      return;
    }
    let count = await accountdb.addressCount();
    await accountdb.addAccount(`My address ${count+1}`, pack);
    await Notify.success('Import success');
    history.goBack();
  }
  render() {
    let hexcheck = (key)=>{
      let r = /^(0[xX][0-9a-fA-F]{4,}|[0-9a-fA-F]{4,})$/.test(key);
      return r;
    }
    let hintcolor = hexcheck(this.state.keyhex)?'default':'red';
    let inputHintClasses = classNames(
      {
        [`hint-color-${hintcolor}`]: true,
      }, 'form-hint');
    let createbtndisenabled = !hexcheck(this.state.keyhex);
    return (
      <div>
        <Appbar {...this.props}
          title=""
        />
        <div className="cell page-title" style={{
          paddingTop: '20px',
          paddingBottom: '20px'
        }}>
          Import Key
        </div>
        <div className="pb-20">
          <form action="">
            <div className="form-group mb-10">
              <label className="form-label">Private Key</label>
              <div>
                <div className="input-group">
                  <textarea className="form-control" rows="3"
                  onChange={(e)=>{this.handleChangeKeyInput(e)}}
                   value={this.state.keyhex}
                    placeholder={"Please enter your private key"}></textarea>
                </div>
                <small className={inputHintClasses}>
                  Please enter your private key.
                </small>
              </div>
            </div>
            <div class="form-footer">
                <Button color="primary"
                  disabled={createbtndisenabled}
                  onClick={async (e) => this.handleImportKey(e)}>
                  Import
                </Button>
              </div>
          </form>
        </div>
      </div>
    );
  }
}
export default KeyExportPage;