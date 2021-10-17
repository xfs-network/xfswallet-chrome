import classNames from "classnames";
import React, { Component } from "react";

import { Button } from "./components";
import { genRadmonAccount, XFSVERSION } from "./util/xfslib";
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
const PASSWORD_LIMIT_MIN = 4;
class CreatePage extends Component {

  constructor(props){
    super(props);
    this.state = {
      password1: '',
      password2: '',
    }
  }

  handleChangePassword1(e){
    let val = e.target.value;
    this.setState({password1: val});
  }

  handleChangePassword2(e){
    let val = e.target.value;
    this.setState({password2: val});
  }
  async handleCreteWallet(){
    const {history, db: {globaldb, accountdb}} = this.props;
    await globaldb.setPassword(this.state.password1);
    let a = genRadmonAccount();
    await accountdb.addAccount('My Account 1', a);
    history.replace('/');
  }
  render() {
    let password1hintcolor = ()=>{
      if(this.state.password1.length < PASSWORD_LIMIT_MIN){
        return 'red';
      }else {
        return 'default';
      }
    }
    let password2hintcolor = ()=>{
      if (this.state.password1.length < PASSWORD_LIMIT_MIN){
        return 'red';
      }
      if(this.state.password1 != this.state.password2){
        return 'red';
      }else {
        return 'default';
      }
    }
    let password1hintclasses = classNames(
      {
        [`hint-color-${password1hintcolor()}`]: true,
      }, 'form-hint');
      let password2hintclasses = classNames(
        {
          [`hint-color-${password2hintcolor()}`]: true,
        }, 'form-hint');
    let comfirmButtonDisabled = () =>{
      if (this.state.password1.length < PASSWORD_LIMIT_MIN){
        return true;
      }
      if(this.state.password1 != this.state.password2){
        return true;
      }else {
        return false;
      }
    }
    return (
      <div>
        <Appbar {...this.props}
          title="Create Wallet"
        />
        <div className="cell page-title" style={{
          paddingTop: '20px'
        }}>
          Set your identity password
        </div>
        <div className="pb-20">
          <form action="">
            <div className="form-group mb-10">
              <label htmlFor="password1" className="form-label">
                Password
              </label>
              <div>
                <input type="password" value={this.state.password1} 
                onChange={(e)=>this.handleChangePassword1(e)} 
                 className="form-control" placeholder="Password" />
                <small className={password1hintclasses}>
                  Must be at {PASSWORD_LIMIT_MIN} chartacters.
                </small>
              </div>
            </div>
            <div className="form-group mb-10">
              <label htmlFor="password2" className="form-label" >
                Confirm Password
              </label>
              <div>
                <input type="password" value={this.state.password2} 
                onChange={(e)=>this.handleChangePassword2(e)} 
                 className="form-control"  placeholder="Password" />
                <small className={password2hintclasses}>
                  Both passwords must match.
                </small>
              </div>
            </div>
            <div class="form-footer">
              <Button color="primary"
                disabled={comfirmButtonDisabled()}
                onClick={async ()=>this.handleCreteWallet()}>
                Comfirm
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default CreatePage;