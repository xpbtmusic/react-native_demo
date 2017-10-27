'use strict';
import React, {PureComponent} from "react";
import {AsyncStorage, NetInfo, StyleSheet, Text, View,Alert} from "react-native";

const NOW_CITY_LIST = "{\"sortLetters\":\"q\",\"spellName\":\"quanguo\",\"fullname\":\"全国/全国\",\"name\":\"全国\",\"id\":0}";
var now_city_key = "nowCityKey";
var _this_;
import jsonData from './city-list.json';
import SearchBar from "./SearchBar";
import Separator from "./Separator";
import CityList from './IndexListView'

class SelectCity extends PureComponent {


    constructor(props) {
        super(props);
        _this_ = this;
        this._isMounted = false;
        this.state = {
            nowCityList: [],
            dataList:null,
        };
    }

    resetParam(navigation) {
        _this_._isMounted = false;
        navigation.goBack();
    }

    componentWillMount() {
        let array = [];
        array.push(NOW_CITY_LIST);
        this.setState({dataList:jsonData,nowCityList: array})

    }


    componentWillUnMount() {
        this._isMounted = false;
    }

    onChangeText(text) {

        this.state.dataList = null;
        if (text === null || text === "") {
            this.refs.listview.setSearchResult(null, true, false);
        } else {
            this.refs.listview.setSearchResult(text, false, true);
        }

    }

    onSubmit(text) {

        // alert(text);
    }

    renderHeader() {
        return (
            <View>
                <View style={{height:60}}/>
                <Separator/>
                <SearchBar
                    style={{marginBottom: 7.5, marginTop: 7.5, height: 30}}
                    onChangeText={this.onChangeText.bind(this)}
                    onSubmit={this.onSubmit.bind(this)}
                />
                <Separator/>
            </View>
        );
    }
    onSelectCity(cityJson) {
        AsyncStorage.setItem(now_city_key, JSON.stringify(cityJson) + '');
        Alert.alert(JSON.stringify(cityJson));
    }
    render() {

        let {allCityList} = this.state;
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <CityList
                    ref="listview"
                    onSelectCity={this.onSelectCity.bind(this)}
                    nowCityList={this.state.nowCityList}
                    searchList={this.state.dataList}
                />
            </View>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 21,
        color: 'gray',
    },
    labelItemContainer: {
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: '#F4F4F4',
        borderBottomWidth: 0.5,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    labelSearchItemStyle: {
        fontSize: 12,
        color: 'black',
        textAlign: 'left'
    },
});
export default SelectCity;
