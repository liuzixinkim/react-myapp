import React, { PureComponent } from 'react';
import "./index.scss";

class BackBtn extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {};
    }

    render() {
        let { fromShare, classes } = this.props;
        return (
            fromShare ? <img className={classes} onClick={this.props.goHome} src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/FooterNav/home_tab@2x.png' alt="img" /> : <img className={classes} onClick={this.props.goBack} src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/arrow2@2x.png' alt="img" />
        )
    }

}

export default BackBtn;
