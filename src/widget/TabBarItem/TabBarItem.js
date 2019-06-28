/**
 * KanTuZhuangXiu React Native App
 * description: 自定义 二级 tab 标签栏
 * @flow
 */
import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';

//import Screen from '../common/screen';

//import { SampleText, colors } from './index';


class TabBarItem extends PureComponent {
    render() {
        let selectedImage = this.props.selectedImage ? this.props.selectedImage : this.props.normalImage
        let resizeMode = this.props.resizeMode ? this.props.resizeMode : 'center'
        let textColor = this.props.focused ? this.props.focusedColor : this.props.normalColor
        return (
            <TouchableOpacity
               onPress={ this.props.tabOnPress } >

                <View style={this.props.tabLabelStyle}>
                <Text style={[this.props.tabTextStyle, textColor]} numberOfLines={1}>{this.props.tabText}</Text>

                <Image resizeMode={ resizeMode } 
                    source={this.props.focused
                        ? selectedImage
                        : this.props.normalImage}
                    style={this.props.tabIconStyle}
                />

                </View>
            </TouchableOpacity>
        );
    }
}

export default TabBarItem;
