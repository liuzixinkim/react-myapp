import React, { PureComponent } from 'react';
import './index.scss';
class Pages extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="loading-container">
                <img className="icon" src='http://src.leju.com/imp/imp/deal/37/44/8/1e0ba8e15d89d8b20dac2547123_p24_mk24.png' alt="loading" />
                <span className="text">拼命加载中...</span>
            </div>
        )
    }
}

export default Pages;
