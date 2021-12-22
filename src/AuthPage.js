import React, { Component } from "react";
import { Button } from "./components";
const PASSWORD_LIMIT_MIN = 4;
class AuthPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            password: '',
        }
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
                                <small className={passwordhintcolor}>
                                    Must be at {PASSWORD_LIMIT_MIN} chartacters.
                                </small>
                            </div>
                        </div>
                        <div>
                            <Button color="primary"
                                disabled={comfirmButtonDisabled()}
                                onClick={async () => this.handleCreteWallet()}>
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