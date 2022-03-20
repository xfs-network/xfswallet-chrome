import React, { Component } from "react";
import classNames from "classnames";
import ReactDOM from "react-dom";
function show(txt, opts) {
    return new Promise((resolve, reject) => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        let time = (opts && opts.time) ? opts.time : 1000;
        let Tmp = (props) => {
            let type = (opts && opts.type) ? opts.type : 'primary';
            const classes = classNames({
                [`app-notify-${type}`]: true,
            }, 'app-notify', 'p-10px');
            return (
                <div className={classes}>
                    <span className="app-notify-txt">{txt}</span>
                </div>
            );
        }
        ReactDOM.render(<Tmp />, container);
        setTimeout(() => {
            document.body.removeChild(container);
            resolve();
        }, time);
    })
}

function success(txt, time) {
    return show(txt, { type: 'success', time: time });
}
function error(txt, time) {
    return show(txt, { type: 'danger', time: time });
}
function warning(txt, time) {
    return show(txt, { type: 'warning', time: time });
}
export default {
    show,
    success,
    error,
    warning,
};