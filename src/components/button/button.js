import React, { Component} from "react";
import classNames from "classnames";
import './button.css';

class Button extends Component {
    constructor(props) {
      super(props);
    }
    render(){
      const classes = classNames(
        {
          [`btn-${this.props.color}`]: this.props.color,
          [`disabled`]: this.props.disabled
        }, 'btn', this.props.className);
      return(
        <div className={classes} {...this.props}>
            {this.props.children}
        </div>
      );
    }
}
export default Button;