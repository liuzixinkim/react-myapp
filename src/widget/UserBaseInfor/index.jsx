import React, { PureComponent } from 'react';
import './index.scss';
import LazyImage from "../LazyImage";

export default class UserBaseInfor extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            agent_type:props.type,
            showStyle:false,//是否显示'设计风格'
            showService:false,//是否显示'设计服务'
            showDes:false,//是否显示'个人简介'
            limitLen:50,//设置截取简介的字数
            originalDes:'',//'个人简介'
            smallDes:'',//截取后的'个人简介'
            showAllDes:props.showAllDes || false, //是否展开'个人简介'
            showArrows:false //是否显示'个人简介'的箭头
        };
    }

      //会在组件挂载后
    componentDidMount() {
        this.requireDesignerDetail();
    }

    //请求详情页面
	requireDesignerDetail(){

        let datas = this.props.detailData;
        
        this.setState({
            showStyle:datas.style_name && datas.style_name [0] ? true : false,
            showService:datas.service_item && datas.service_item[0] ? true : false
        })	
        
        
        // 描述的逻辑
        if(datas.description){
            let _description = datas.description;
            let _limitLen = this.state.limitLen;
            if(_description.length > _limitLen){
                _description = this.LimitNumber(datas.description,_limitLen)
                this.setState({
                    showArrows:true
                })
            }else{
                this.setState({
                    showArrows:false
                })
            }
            
            this.setState({
                showDes:true,
                originalDes:datas.description,
                smallDes:_description,
            })
        }

    }
    
    //切换 描述 文字
    toggleTntro(){
        this.setState((prevState)=>({
            showAllDes: !prevState.showAllDes
        }))
    }

    // 截取文字
    LimitNumber(txt,len){
        let str = txt
        if(str.length > len){
            str = str.substr(0,len) + '... ' ;
            this.setState({ showArrow:true })
        }
        return str
    }

    render(){
        let detailData = Object.assign({},  this.props.detailData)
        return(
            <div className="base-infor">
                <div className="designer-infor">
                    
                    <LazyImage
                            srcset={detailData.avaster}
                            src="http://src.leju.com/imp/imp/deal/6d/ac/9/23ec2e9328fb148e014bb10f433_p24_mk24.png" />

                    <div className="infor">
                    <h4>{detailData.real_name}</h4>
                    {detailData.pro_name ? (<p>所在地区：<span>{detailData.pro_name}</span><span>{detailData.city_name}</span></p> ) : null}
                    {detailData.level_name && this.state.agent_type == 3 ? (<p>级别：<em>{detailData.level_name}</em></p>) : null } 
                    </div>
                </div>
                
                {
                    detailData.charge_standard_name && this.state.agent_type == 3 ? (
                        <div className="charge">
                            <h5>收费标准：</h5>
                            {detailData.charge_standard ? (<p><em>{detailData.charge_standard_name}</em></p>) : (<p><em>{detailData.charge_standard}</em>元/平米</p>)}
                        </div>
                        )
                    :
                        null
                }

                {
                    this.state.showStyle && this.state.agent_type == 3 ? (
                        <div className="sj-style">
                            <h5>设计风格：</h5>
                            {
                                detailData.style_name.map((item,key)=>(
                                <span key={key}>{item}</span>
                                )) 
                            }
                        </div>
                        )
                    :
                        null
                }

                {
                    this.state.showService ? (
                        <div className="sj-service">
                            <h5>{this.state.agent_type == 3 ? '设计服务：' : '服务内容：'}</h5>
                            {
                                detailData.service_item.map((item,key)=>(
                                <span key={key}>{item}</span>
                                ))
                            }
                        </div>
                        )
                    : 
                        null
                }
                {
                    this.state.showDes ? (
                        <div className="personal-infor">
                            <p>
                            {this.state.agent_type == 3 ? '个人简介：' : '公司介绍：'}
                            <span>{this.state.showAllDes ? this.state.originalDes : this.state.smallDes}</span>
                            {this.state.showArrows ? (<em onClick={()=> this.toggleTntro()} className={this.state.showAllDes ? 'intro': ''}></em>) : null}
                            </p>
                        </div>
                        )
                    :
                        null
                }
        
            </div>          
        )
    }
}
