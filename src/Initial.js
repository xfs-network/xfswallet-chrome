import React, { Component} from "react";

import {Button} from "./components";

class Initial extends Component{
  constructor(props) {
    super(props);
    this.state = {
        ...props
    }
  }
  handleImportKey(){
    console.log('handle import key');
    const { history, db: { globaldb, accountdb } } = this.state;
    history.push('/keyimport');
  }
  render(){
    return(
      <div className="container">
        <div className="mb-20">
            <h2>Welcome to XFS Wallet!</h2>
            <p>Next, create your own digital walle</p>
        </div>
        <div className="mb-20">
          <Button color="primary" onClick={
            ()=>this.props.history.push('/createpage')}>
            Create wallet
          </Button>
        </div>
        <div className="mb-20" onClick={
            ()=>{this.handleImportKey()}}>
          <Button>Import key</Button>
        </div>
      </div>
    );
  }
}
export default Initial;
