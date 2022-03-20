import classNames from "classnames";
import React, { Component } from "react";

import { Button } from "./components";
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

class KeyExportPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      keyhex: '',
    }
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let gotaddr = history.location.state.addr;
    let account = await accountdb.getAccount(gotaddr);
    let {key: {key, pub}} = account;
    let keyhex = '0x' + exportKey(key);
    this.setState({
      keyhex: keyhex
    });
  }
  render() {
    return (
      <div>
        <Appbar {...this.props}
          title=""
        />
        <div className="cell page-title" style={{
          paddingTop: '20px',
          paddingBottom: '20px'
        }}>
          Export Key
        </div>
        <div className="pb-20">
          <form action="">
            <div className="form-group mb-10">
              <label className="form-label">Private Key</label>
              <div>
                <div className="input-group">
                  <textarea className="form-control" rows="3" value={this.state.keyhex} readOnly></textarea>
                </div>
                <small className="form-hint">Please back up your private key carefully.</small>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default KeyExportPage;