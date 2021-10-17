import classNames from "classnames";
import React, { Component } from "react";

import { Button } from "./components";

import { genRadmonAccount, XFSVERSION } from "./util/xfslib";

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

function NetworkListItem(props) {
  const {id, name, lock} = props;
  let lockclassnames = classNames(
    {
      [`d-none`]: !lock,
    }, 'item-right-lock'
  );
  return (
    <div className="list-group-item cur-p"
      onClick={(e)=>{props.onClick(e,id)}}>
      <div className="network-item">
        <div className="item-name">
          {name}
        </div>
        <div className="item-right">
          <div className={lockclassnames}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            </svg>
          </div>
          <div className="item-right-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
function NetworkList(props) {
  const { data, onItemClick } = props;
  return (
    <div className="list-group" style={props.style}>
      {data.map((item) => {
        return (
          <NetworkListItem {...item} onClick={onItemClick}>
          </NetworkListItem>
        );
      })}
    </div>
  );
}

class NetworkMgrPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }
  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let networks = await globaldb.listAllNetwork();
    this.setState({data: networks});
  }
  handleNewNetwork(e) {
    const { history, db: { globaldb, accountdb } } = this.props;
    history.push('/newnetwork');
  }
  handleNetworkItemCliek(e, id){
    const { history, db: { globaldb, accountdb } } = this.props;
    history.push('/networkdetail', {id: id});
  }
  render() {
    return (
      <div>
        <Appbar {...this.props}
          title=""
        />
        <div className="cell page-title pv-20">
          All Networks
        </div>
        <NetworkList data={this.state.data} style={{
          paddingBottom: '56px'
        }}
          onItemClick={(e, id) => { this.handleNetworkItemCliek(e, id) }} />
        <div className="fix-wrap">
          <Button color="primary"
              onClick={async (e) => this.handleNewNetwork(e)}>
              Add Network
          </Button>
        </div>
      </div>
    );
  }
}
export default NetworkMgrPage;