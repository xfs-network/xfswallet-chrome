import classNames from "classnames";
import React, { Component } from "react";

import { Button, Notify } from "./components";
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
class CreateWalletPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      err: null
    }
  }
  handleChangeName(e){
    let val = e.target.value;
    this.setState({name: val});
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let count = await accountdb.addressCount();
    this.setState({
      name: `My account ${count+1}`,
    });
  }
  async handleCreteWallet(){
    const { history, db: { globaldb, accountdb } } = this.props;
    let a = genRadmonAccount();
    await accountdb.addAccount(this.state.name, a);
    await Notify.success('Create success');
    history.goBack();
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
          Create Wallet
        </div>
        <div className="pb-20">
          <form action="">
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
            <div className="cell">
              <div className="hint-err">
              </div>
            </div>
            <div class="form-footer">
              <Button color="primary"
                disabled={createbtndisenabled}
                onClick={async ()=>this.handleCreteWallet()}>
                Create
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default CreateWalletPage;