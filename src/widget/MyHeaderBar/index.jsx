import React, { PureComponent } from 'react';
import './index.scss';
class Pages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
        return (
            <div className="header-bar-wrap">
                <div className="inner ">
                    <div className="leftWrap " >
                        { this.props.backBtn 
                            ? (this.props.backBtn() )
                            : !this.props.hideBackBtn 
                            ? (<label className="backBtn"
                                onClick={ this.props.backBtnOnPress } >
                                </label>)
                            : ( '' )
                        }
                    </div>
                    <div className="titleWrap" >
                        <label className="titleText">
                            {this.props.titleText ? this.props.titleText : ''}
                        </label>
                    </div>
                    <div className="rightWrap"></div>
                </div>
            </div>
        )
  }
}

export default Pages;
