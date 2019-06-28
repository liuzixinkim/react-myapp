
import React, { Component } from 'react';
import './index.scss';

class DialogAlert extends Component {
    constructor(props){
        super(props);
        this.state = {
            alertStatus:false,
            alertTitle:'提示', //标题
            alertTip:'网络错误', //提示
            cancelText:'取消',
            confirmText:'确认',

            isShortTip:false, //是否为短提示，短提示的情况下不显示'取消''确认'（且2s后消失），且优先级最高，其他配置无效

            isShowCancel:true, //是否显示确认按钮
            isShowConfirm:true, //是否显示确认按钮

            cancelCallbackFn:function(){}, //取消 回调函数
            confirmCallbackFn:function (){}//确认 回调函数
        }
    }


    componentWillReceiveProps(nextProps) {
        let options = nextProps.dialogOpt || {};

        //如果是短提示
        if(options.isShortTip){
            options.isShowCancel = false;
            options.isShowConfirm = false;
            setTimeout(()=>{
                this.close()
            },2000)
        }

        this.setState({
            ...options
        })
    }

    //取消
    cancel = () => {
        this.state.cancelCallbackFn();
        this.close()
    }

    //确认
    confirm = () => {
        this.state.confirmCallbackFn();
        this.close()
    }

    close = () => {
        this.setState({
            alertStatus:false
        })
    }


    render(){
        let opts = this.state;
        return (
            <div className="dialog-wrap" style={opts.alertStatus ? {display:'block'}:{display:'none'}}>
                <div className="dialog-box">
                    <h6>{opts.alertTitle}</h6>
                    <p>{opts.alertTip}</p>
                    {!opts.isShowCancel && !opts.isShowConfirm ? null : (
                        <div>
                            {opts.isShowCancel ? (<span onClick={ () => this.cancel() }>{opts.cancelText}</span>) : null}
                            {opts.isShowConfirm ? (<span className="confirm" onClick={ () => this.confirm() }>{opts.confirmText}</span>) : null}
                        </div>
                        )}
                </div>
            </div>
        )
    }
}

export default DialogAlert;

