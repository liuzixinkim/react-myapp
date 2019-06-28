import React, { Component } from 'react';


export default class Test extends Component {

    handleClick(){
        console.log('点击了',this)
    }

    render(){
        return (
            <div onClick={ ()=> this.handleClick() }>click btn</div>
        )
    }
}