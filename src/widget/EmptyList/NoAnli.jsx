import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import './NoAnli.scss';

class Pages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //会在组件挂载后
  componentDidMount() {

  }

  
  //会在组件卸载及销毁之前直接调用
  componentWillUnmount(){

  }
    render() {
        let text = this.props.text ? this.props.text : '暂无相关案例';
        return (
            <div className=" no-anli ">

              <div className="inner ">
                  <img className=" icon" src="http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/EmptyList/no_anli@2x.png" alt="icon"/>
                  {this.props.reload
                    ?
                    (<label onPress={()=>{ this.props.onPress()}}>
                        <div className="reloadBtn">
                          <label className=" reloadText" >再次加载</label>
                        </div>
                      </label>)
                    :
                    <label className=" text " >{text}</label>
                  }
              </div>
            </div>
        );
    }
}

export default Pages;
