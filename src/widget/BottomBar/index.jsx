import React, { PureComponent } from 'react';
import "./index.scss";
class BottomBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
        return (
            <div className="bottomBarBox">
                <a href="http://jiaju.leju.com"><i className="bottom_icon i1"></i>首页</a>
                <a href="http://jiaju.leju.com/brand"><i className="bottom_icon i2"></i>品牌馆</a>
                <a href="http://jiaju.leju.com/tousu"><i className="bottom_icon i3"></i>投诉</a>
            </div>
        );
  }
}

export default BottomBar;
