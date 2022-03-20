import React, { Component } from "react";
import { Button, Notify } from "./components";
import classNames from "classnames";
import { PASSWORD_LOCK_TIME } from './config';
const PASSWORD_LIMIT_MIN = 4;
import './connectpage.css';
class ConnectPage extends Component {
    constructor(props) {
        super(props);
        // const { history, } = this.props;
        console.log('props', props);
    }
    
    async handleConnect() {
        const { history, db: { globaldb, accountdb } } = this.props;
        let defaultAddr = await accountdb.getDefault();
        if (!defaultAddr){
            return;
        }
        chrome.runtime.sendMessage({method:'closewin', params: {
            address: defaultAddr
        }});
    }
    render() {
        let appiconUrl = chrome.runtime.getURL("images/appicon.png");
        console.log('appiconUrl', appiconUrl);
        return (
            <div className="container">
                <div className="mb-20">
                    <h2>Connect XFS Wallet Account</h2>
                    <p>Select the account you want to connect</p>
                </div>
                <div className="mb-20">
                    <div className="connect-top">
                        <div className="appicon" >
                            <img src={appiconUrl} alt="xfs" />
                        </div>
                        <div className="connect-line">
                            <div className="line"></div>
                        </div>
                        <div className="appicon">
                            <img src={appiconUrl} alt="xfs" />
                        </div>
                    </div>
                </div>
                <div className="mb-20">
                    The app is requesting your account address
                </div>
                <div>
                    <Button color="primary"
                        onClick={async () => this.handleConnect()}>
                        Allow
                    </Button>
                </div>
            </div>
        );
    }
}

export default ConnectPage;