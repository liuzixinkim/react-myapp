import React, { PureComponent } from 'react';


class Pages extends PureComponent {
  constructor(props) {
    super(props);
        this.state = {
            value: ''
        };
  }

  //会在组件挂载后
  componentDidMount() {

  }
    //监听输入框 文字改变
    changeText = (event)=> {
      var target = event.currentTarget,
          val = target.value;
        this.setState({value: val});

       this.props.changeText( val );
    }

    //清除输入框
    clearBtnOnpress=()=>{

        this.setState({value: ''});
        this.props.clearKeywordText()

    }

  render() {
      return (
            <div className="citySearchBox">
                <div className="inputBox">
                    <div className="searchIconwWrap"></div>

                    <input 
                        className="inputText"
                        ref="keyword"
                        value={this.state.value}
                        onChange={ (event)=> this.changeText(event) } 
                        maxLength={18} 
                        placeholder={'输入城市名或拼音查询'} />

                    {this.state.value ? (
                    <div className="clearIconwWrap" onClick={ ()=> this.clearBtnOnpress()  } ></div>
                    ) : ""}

                </div>
            </div>
        )
  }
}

export default Pages;
