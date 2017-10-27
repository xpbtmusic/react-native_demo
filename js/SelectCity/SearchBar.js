/**
 * SearchBar.js 
 */

import React, {PureComponent} from 'react'
import {StyleSheet, View, TextInput, TouchableOpacity, Text, Image, Keyboard, Alert, Platform} from 'react-native'



class SearchBar extends PureComponent {

    props: {
        onSubmitEditing: Function,
        text: string,
        onChangeText: Function,
        onSubmit: Function,
        style: Object
    }

    state: {
        text: string
    }

    constructor(props: Object) {
        super(props);

        this.state = {
            text: this.props.text,
        };
    }

    onChangeText(text: string) {

        this.setState({text: text});

        this.props.onChangeText && this.props.onChangeText(text)
    }

    onSubmitEditing() {
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.text);
        }
    }

    click() {
        if (Platform.OS==='ios') {
            //取消

        } else {
            //搜索
            this.onSubmitEditing();
        }
        Keyboard.dismiss();
    }

    searchButton() {
        if (Platform.OS==='ios') {
            return (
                <TouchableOpacity
                    onPress={this.click.bind(this)}
                    style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>
                        {Platform.OS==='ios' ? '取消' : '搜索'}
                    </Text>
                </TouchableOpacity>
            );

        }
    }

    render() {

        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.inputContainer}>
                    <Image
                        style={styles.icon}
                        source={require('./img/search.png')}
                    />

                    <TextInput
                        ref='input'
                        style={styles.input}
                        placeholder='输入城市名称或拼音查询'
                        placeholderTextColor='#666666'
                        returnKeyType='search'
                        onSubmitEditing={this.onSubmitEditing.bind(this)}
                        onChangeText={(text) => {
                            this.onChangeText(text)
                        }}
                        underlineColorAndroid='transparent'
                    />

                </View>

                {this.searchButton()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
    },
    inputContainer: {
        flex: 1,
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF1F8',
        borderRadius: 5,
    },
    icon: {//搜索按钮
        marginLeft: 10,
        width: 14,
        height: 14,
    },
    cancelBtn: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelText: {
        color: '#4683ca',
        fontSize: 14,
    },
    input: {
        flex: 1,
        fontSize: 14,
        height: Platform.OS === 'ios' ? 30 : 40,
        marginHorizontal: 5,
        marginVertical: 0,
    }
});


export default SearchBar;	