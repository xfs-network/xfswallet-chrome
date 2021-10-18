import React, { Component } from "react";
import { defaultBalanceFormat, defaultTxsValueFormat, sortList } from "./util/common";
import { Button, Notify, DataEmpty } from "./components";
import { atto2base } from "./util/xfslibutil";
import classNames from "classnames";

function HomePageAppbar(props) {
  const {defaultnet, networks, onNetChange, netstatus} = props;
  let badgeclasses = classNames(
    {
      [`badge-danger`]: (!netstatus || netstatus === 1),
      [`badge-success`]: (netstatus && netstatus === 1),
    }, 'badge'
  );
  return (
    <div className="homeappbar">
      <div className="homeappbar-left cur-p"
        onClick={() => props.history.push('/accountmgr')}>
        <span className="avatar">
          X
          <span className={badgeclasses}></span>
        </span>
      </div>
      <div className="appbar-network">
        <select class="form-select" value={defaultnet} onChange={(e) => { onNetChange(e) }}>
          {networks.map((item) => {
            const {id, name} = item;
            return (
              <option value={id}>{name}</option>
            )
          })}
        </select>
      </div>
    </div>
  );
}

function EyeView(props) {
  const { open } = props;
  let icons = [
    (<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
    </svg>),
    (<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
    </svg>)
  ]
  let showicon = open ? icons[0] : icons[1];
  return (
    <div className="icon">
      {showicon}
    </div>
  )
}


function HomeTrasactionItem(props) {
  const { hash, to, value,status } = props;
  let baseval = atto2base(value);
  let valf = parseFloat(baseval);
  let valstr = defaultTxsValueFormat(valf);
  let badgeclasses = classNames(
    {
      [`badge-warning`]: (status&&status===-2),
      [`badge-danger`]: (status&&status===-1),
      [`badge-default`]: (!status||status===0),
      [`badge-success`]: (status&&status===1),
    }, 'badge'
  );
  return (
    <div className="home-list-item cur-p">
      <div className="item-left">
        <span className="avatar">
          TX
          <span className={badgeclasses}></span>
        </span>
      </div>
      <div className="item-content">
        <div className="tx-item-hash">
          {`0x${hash}`}
        </div>
        <div className="tx-item-addr">
          {`${to}`}
        </div>
      </div>
      <div className="item-right">
        <div>{`${valstr} XFSC`}</div>
      </div>
    </div>
  );
}

function HomeTransactionList(props) {
  return (
    <div className="home-list-data">
      <DataEmpty show={!(props.data) || props.data.length == 0} />
      {props.data.map((item) => {
        return (
          <HomeTrasactionItem {...item} />
        );
      })}
    </div>
  )
}


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networks: [],
      accountInfo: {},
      accountBalance: 0,
      defaultnet: 0,
      showbalance: true,
      transactions: [],
      netstatus: 0
    }
  }

  handleChangeBalance(e) {
    this.setState({ showbalance: !this.state.showbalance });
  }

  async componentWillMount() {
    const { history, db: { globaldb, accountdb } } = this.props;
    let networks = await globaldb.listAllNetwork();
    let defaultnet = await globaldb.getDefaultNet();
    let defaultAddr = await accountdb.getDefault();
    if (!defaultAddr){
      return;
    }
    let accountInfo = await accountdb.getAccount(defaultAddr);
    let accountBalance = await accountdb.getAddressBalance(accountInfo.addr, defaultnet);
    let txhashes = await accountdb.getAddressTxs(accountInfo.addr, defaultnet);
    let netstatus = await globaldb.getNetworkStatus(defaultnet);
    let txs = [];
    for (let i=0; i<txhashes.length; i++){
      const txhash = txhashes[i];
      const txobj = await accountdb.getAddressTx(defaultAddr, defaultnet, txhash);
      txs.push(txobj);
    }
    txs = sortList(txs, (c,n)=>{
      let ct = parseInt(c.timestamp);
      let nt = parseInt(n.timestamp);
      return ct < nt;
    });
    this.setState({
      networks: networks,
      accountInfo: accountInfo,
      defaultnet: defaultnet,
      accountBalance: accountBalance ? accountBalance : 0,
      transactions: txs,
      netstatus: netstatus ? netstatus: 0,
    });
    this.inrvSyncNetStatus = setInterval(async () => {
      let netstatus = await globaldb.getNetworkStatus(defaultnet);
      if (this.state.netstatus !== netstatus && netstatus === 0) {
        await Notify.warning('Network connect err');
      }else if(this.state.netstatus !== netstatus && netstatus === 1){
        await Notify.success('Network connect success');
      }
      this.setState({
        netstatus: netstatus ? netstatus: 0,
      });
    }, 1000);

    this.inrvSyncBalance = setInterval(async () => {
      let accountBalance = await accountdb.getAddressBalance(accountInfo.addr, defaultnet);
      if (this.state.accountBalance !== 0 && this.state.accountBalance !== accountBalance) {
        await Notify.success('Balance has been changed');
      }
      this.setState({
        accountBalance: accountBalance ? accountBalance : 0
      });
    }, 1000);

  }
  componentWillUnmount(){
    clearInterval(this.inrvSyncNetStatus);
    clearInterval(this.inrvSyncBalance);
  }
  handleToAccountDetialPage(e) {
    this.props.history.push('/accountdetail',
      { addr: this.state.accountInfo.addr });
  }
  async handleNetChange(e) {
    const { history, db: { globaldb, accountdb } } = this.props;
    let val = e.target.value;
    let netid = parseInt(val);
    if (isNaN(netid)) {
      await Notify.error('Change net err');
      return;
    }
    await globaldb.setDefaultNet(netid);
    this.setState({ defaultnet: netid });
    window.location.reload();
  }


  render() {
    let balance = this.state.accountBalance;
    let balanceval = atto2base(balance);
    let balancetxt = defaultBalanceFormat(balanceval);
    balancetxt = this.state.showbalance ? balancetxt : '****';
    return (
      <div>
        <HomePageAppbar {...this.props}
          title="Create Wallet"
          networks={this.state.networks}
          defaultnet={this.state.defaultnet}
          onNetChange={async (e) => { this.handleNetChange(e) }}
          netstatus={this.state.netstatus}
        />
        <div className="home-info">
          <div className="home-info-item cur-p" onClick={(e) => {
            this.handleToAccountDetialPage(e);
          }}>
            <div className="home-info-item-left">
              <div className="home-info-accname">
                {this.state.accountInfo.name}
              </div>
              <div className="home-info-addr">
                {this.state.accountInfo.addr}
              </div>
            </div>
            <div className="home-info-item-right">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="home-info-item" style={{ borderBottom: 'none' }}>
            <div className="home-info-item-left">
              <div>Balance</div>
              <div>{balancetxt}</div>
            </div>
            <div className="home-info-item-right cur-p" onClick={(e) => { this.handleChangeBalance(e) }}>
              <EyeView open={this.state.showbalance} />
            </div>
          </div>
        </div>
        <div className="home-ops">
          <div className="btn-wrap">
            <Button onClick={() => {
              this.props.history.push('/send', {
                fromaddr: this.state.accountInfo.addr,
                networkid: this.state.defaultnet
              });
            }}>Send</Button>
          </div>
        </div>
        <div className="home-list-wrap">
          <div className="home-list-title">
            Transactions
          </div>
          <HomeTransactionList data={this.state.transactions} />
        </div>
      </div>
    );
  }
}
export default HomePage;