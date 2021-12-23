import React, { Component } from "react";
import { Button,Notify } from "./components";
import classNames from "classnames";
import {PASSWORD_LOCK_TIME} from './config';
const PASSWORD_LIMIT_MIN = 4;
class AuthPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            password: '',
        }
    }
    async handleUnlock(){
        const { db: { extradb, globaldb },history, unlockPasswordFn,from} = this.props;
        const pass = await globaldb.getPassword();
        if (pass !== this.state.password){
            await Notify.error('Password is incorrect');
            return;
        }
        let t = new Date().getTime();
        t += PASSWORD_LOCK_TIME;
        await globaldb.setPasswordLockTime(t);
        
        // const {location: {state}} = history;
        // console.log('state.from', state);
        // console.log('props.from', from);
        await unlockPasswordFn();
    }
    render() {
        let passwordhintcolor = ()=>{
            if(this.state.password.length < PASSWORD_LIMIT_MIN){
              return 'red';
            }else {
              return 'default';
            }
        };
        let comfirmButtonDisabled = () =>{
            if (this.state.password.length < PASSWORD_LIMIT_MIN){
              return true;
            }
            return false;
        };
        let passwordhintclasses = classNames(
            {
              [`hint-color-${passwordhintcolor()}`]: true,
            }, 'form-hint');
        return (
            <div className="container">
                <div className="mb-20">
                    <h2>Welcome to XFS Wallet!</h2>
                    <p>Unlock your wallet</p>
                </div>
                <div>
                    <form action="">
                        <div className="mb-10">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div>
                                <input type="password" value={this.state.password}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        this.setState({password: val});
                                    }}
                                    className="form-control" placeholder="Password" />
                                <small className={passwordhintclasses}>
                                    Must be at {PASSWORD_LIMIT_MIN} chartacters.
                                </small>
                            </div>
                        </div>
                        <div>
                            <Button color="primary"
                                disabled={comfirmButtonDisabled()}
                                onClick={async () => this.handleUnlock()}>
                                Unlock
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AuthPage;