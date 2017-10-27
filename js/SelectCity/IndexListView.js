'use strict';
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    ListView,
    Dimensions,
} from 'react-native';
import Separator from "./Separator";


const SECTIONHEIGHT = 30;
const ROWHEIGHT = 40;
const ROWHEIGHT_BOX = 40;
var totalheight = []; //每个字母对应的城市和字母的总高度

const {width, height} = Dimensions.get('window');

var that;

const key_now = '当前选中资源池';
const key_hot = '资源池名称';
var dataBlob = {};
var sectionIDs;
var rowIDs;
export default class IndexListView extends PureComponent {

    constructor(props) {
        super(props);
        dataBlob = {};
        sectionIDs = [];
        rowIDs = [];
        this.state = {
            isForSearch: false,
        };
        this.initData(this.props.searchList, this.props.nowCityList)

    }

    initData(jsonData, nowCityList) {

        var getSectionData = (dataBlob, sectionID) => {
            return sectionID;
        };
        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID][rowID];
        };

        let ALL_CITY_LIST = jsonData.allCityList;
        let CURRENT_CITY_LIST = nowCityList;
        let HOT_CITY_LIST = jsonData.hotCityList;

        let letterList = this._getSortLetters(ALL_CITY_LIST);


        dataBlob[key_now] = CURRENT_CITY_LIST;
        dataBlob[key_hot] = HOT_CITY_LIST;

        ALL_CITY_LIST.map(cityJson => {
            //把城市放到对应的字母中
            let key = cityJson.sortLetters.toUpperCase();

            if (dataBlob[key]) {
                let subList = dataBlob[key];
                subList.push(cityJson);
            } else {
                let subList = [];
                subList.push(cityJson);
                dataBlob[key] = subList;
            }
        });

        sectionIDs = Object.keys(dataBlob);
        rowIDs = sectionIDs.map(sectionID => {
            let thisRow = [];
            let count = dataBlob[sectionID].length;
            for (let ii = 0; ii < count; ii++) {
                thisRow.push(ii);
            }

            let eachheight = SECTIONHEIGHT + ROWHEIGHT * thisRow.length;
            if (sectionID === key_hot || sectionID === key_now) {
                let rowNum = (thisRow.length % 3 === 0)
                    ? (thisRow.length / 3)
                    : parseInt(thisRow.length / 3) + 1;


                eachheight = SECTIONHEIGHT + ROWHEIGHT_BOX * rowNum;
            }

            totalheight.push(eachheight);

            return thisRow;
        });


        let ds = new ListView.DataSource({
            getRowData: getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        this.state = {
            dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            letters: sectionIDs
        };

        that = this;
    }

    setSearchResult(text, resetSearch, isForSearch) {
        if (resetSearch) {
            var getSectionData = (dataBlob, sectionID) => {
                return sectionID;
            };
            var getRowData = (dataBlob, sectionID, rowID) => {
                return dataBlob[sectionID][rowID];
            };
            let ds = new ListView.DataSource({
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            });
            this.setState({
                isForSearch: false,
                dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                letters: sectionIDs
            });
        } else if (isForSearch) {
            let data_ = {};
            let data;
            if (this.isChinese(text)) {
                data = this.getSearchResultForChinese(text);
            } else {
                data = this.getSearchResultForLetter(text);
            }

            if (data && data.length > 0) {
                console.log("--搜索结果")
                var getSectionData = (data_, sectionID) => {
                    return sectionID;
                };
                var getRowData = (data_, sectionID, rowID) => {
                    return data_[sectionID][rowID];
                };
                data.map(cityJson => {
                    //把城市放到对应的字母中
                    let key = cityJson.sortLetters.toUpperCase();
                    if (data_[key]) {
                        let subList = data_[key];
                        subList.push(cityJson);
                    } else {
                        let subList = [];
                        subList.push(cityJson);
                        data_[key] = subList;
                    }
                });
                let sectionIDs_ = Object.keys(data_);
                let rowIDs_ = sectionIDs_.map(sectionID => {
                    let thisRow = [];
                    let count = data_[sectionID].length;
                    for (let ii = 0; ii < count; ii++) {
                        thisRow.push(ii);
                    }

                    return thisRow;
                });
                let ds = new ListView.DataSource({
                    getRowData: getRowData,
                    getSectionHeaderData: getSectionData,
                    rowHasChanged: (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
                });
                console.log(JSON.stringify(data_))
                this.setState({
                    dataSource: ds.cloneWithRowsAndSections(data_, sectionIDs_, rowIDs_),
                });
            }

        }

    }

    isChinese(text) {
        let isChinese = false;
        if (/.*[\u4e00-\u9fa5]+.*$/.test(text)) {
            isChinese = true;
        }
        if (/^[A-Za-z]*$/.test(text)) {
            isChinese = false;
        }
        return isChinese;
    }

    getSearchResultForLetter(text) {
        if (/^[A-Za-z]*$/.test(text)) {
            console.log("--------")
            let letter = text.substring(0, 1).toLowerCase();
            //具体列表位置
            if (null == dataBlob) {
                dataBlob = this.refs.listview._getDataSource();
                console.log(JSON.stringify(dataBlob))
            }
            let result_ = [];
            let sectionKeys = Object.keys(dataBlob);
            for (let j = 0; j < sectionKeys.length; j++) {
                let key = sectionKeys[j];
                if (key === key_hot) {
                    continue;
                }
                if (key === key_now) {
                    continue;
                }
                if (key != key_hot || key != key_now) {
                    let itemArray = dataBlob[key.toUpperCase()];
                    if (Array.isArray(itemArray)) {
                        for (let i = 0; i < itemArray.length; i++) {

                            if (itemArray[i].spellName.includes(text.toLowerCase())) {
                                result_.push(itemArray[i]);
                                console.log(JSON.stringify(itemArray[i]))

                            }
                        }
                    }
                }


            }
            return result_;
        }

    }

    getSearchResultForChinese(text) {
        //中文
        if (/.*[\u4e00-\u9fa5]+.*$/.test(text)) {
            //具体列表位置
            if (null == dataBlob) {
                dataBlob = this.refs.listview._getDataSource();
                console.log(JSON.stringify(dataBlob))
            }
            let result_ = [];
            let sectionKeys = Object.keys(dataBlob);
            for (let j = 0; j < sectionKeys.length; j++) {
                let key = sectionKeys[j];
                if (key === key_hot) {
                    continue;
                }
                if (key === key_now) {
                    continue;
                }
                if (key != key_hot || key != key_now) {
                    let itemArray = dataBlob[key.toUpperCase()];
                    if (Array.isArray(itemArray)) {
                        for (let i = 0; i < itemArray.length; i++) {
                            if (itemArray[i].name.includes(text)) {
                                result_.push(itemArray[i]);

                            }
                        }
                    }
                }


            }
            return result_;
        }
    }

    _getSortLetters(dataList) {
        let list = [];

        for (let j = 0; j < dataList.length; j++) {
            let sortLetters = dataList[j].sortLetters.toUpperCase();

            let exist = false;
            for (let xx = 0; xx < list.length; xx++) {
                if (list[xx] === sortLetters) {
                    exist = true;
                }
                if (exist) {
                    break;
                }
            }
            if (!exist) {
                list.push(sortLetters);
            }
        }

        return list;
    }

    _cityNameClick(cityJson) {
        //this.refs.toast.show(cityJson.name, DURATION.LENGTH_SHORT);
        // this.props.nav.pop();
        // alert('选择了城市====》' + cityJson.id + '#####' + cityJson.name);
        this.props.onSelectCity(cityJson);
    }

    _scrollTo2(index, letter) {
        //this.refs.toast.close();
        let position = 0;
        for (let i = 0; i < index; i++) {
            position += totalheight[i]
        }
        if (index != -1) {
            this._listView.scrollTo({y: position + 80});

        } else {
            this._listView.scrollTo({y: position});
        }
        //this.refs.toast.show(letter, DURATION.LENGTH_SHORT);
    }

    _scrollTo(index, letter, offPosition, itemPosition) {
        //this.refs.toast.close();
        let position = 0;
        for (let i = 0; i < index; i++) {
            position += totalheight[i]
        }
        this._listView.scrollTo({y: position - offPosition + (itemPosition * 32)});
        //this.refs.toast.show(letter, DURATION.LENGTH_SHORT);
    }

    _renderRightLetters(letter, index) {
        if (index > 1) {
            return (
                <TouchableOpacity key={'letter_idx_' + index} activeOpacity={0.6} onPress={() => {
                    this._scrollTo2(index, letter)
                }}>
                    <View style={styles.letter}>
                        <Text style={styles.letterText}>{letter}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

    }

    _renderListBox(cityJson, rowId) {
        if (rowId === key_now) {
            let jsonObject = JSON.parse(cityJson);
            return (
                <TouchableOpacity key={'list_item_' + jsonObject.id} onPress={() => {
                    that._cityNameClick(jsonObject)
                }}>
                    <View style={styles.rowdataBox}>
                        <Text style={styles.rowdatatextBox}>{jsonObject.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity key={'list_item_' + cityJson.id} onPress={() => {
                that._cityNameClick(cityJson)
            }}>
                <View style={styles.rowdataBox}>
                    <Text style={styles.rowdatatextBox}>{cityJson.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _renderListRow(cityJson, rowId) {
        if (rowId === key_now || rowId === key_hot) {
            return that._renderListBox(cityJson, rowId);
        }

        return (
            <TouchableOpacity key={'list_item_' + cityJson.id} style={styles.rowView} onPress={() => {
                that._cityNameClick(cityJson)
            }}>
                <View style={styles.rowdata}>
                    <Text style={styles.rowdatatext}>{cityJson.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderListSectionHeader(sectionData, sectionID) {
        if (sectionID === 'A') {
            return (
                <View>
                    <Separator style={{backgroundColor: '#DDDDDD', marginTop: 5,}}/>
                    <View style={styles.sectionView}>
                        <Text style={styles.sectionText}>
                            {sectionData}
                        </Text>
                    </View>
                </View>
            );
        } else {
            if (sectionID === key_now || sectionID === key_hot) {
                return (
                    <View>
                        <View style={styles.sectionViewTop}>

                            <Text style={[sectionID === key_hot ? styles.sectionTextTop1 : styles.sectionTextTop]}>
                                {sectionData}
                            </Text>
                        </View>
                    </View>
                )
            }
            return (
                <View>
                    <View style={styles.sectionView}>

                        <Text style={styles.sectionText}>
                            {sectionData}
                        </Text>
                    </View>
                </View>
            );
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <ListView ref={listView => this._listView = listView}
                              contentContainerStyle={styles.contentContainer}
                              dataSource={this.state.dataSource}
                              renderRow={this._renderListRow}
                              renderSectionHeader={this._renderListSectionHeader}
                              removeClippedSubviews={true}
                              enableEmptySections={true}
                              initialListSize={500}/>
                    <View style={styles.letters}>
                        {this.state.letters && this.state.letters.map((letter, index) => this._renderRightLetters(letter, index))}
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // paddingTop: 50,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#eeeeee",
        // paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
    },
    contentContainer: {
        flexDirection: 'row',
        width: width,
        backgroundColor: "#eeeeee",
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },
    letters: {
        position: 'absolute',
        height: height,
        top: 5,
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
        // alignItems:'center',
        // justifyContent:'center'
    },
    letter: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Platform.OS === 'ios' ? height * 3.4 / 100 : height * 3.6 / 100,
        width: Platform.OS === 'ios' ? width * 3.6 / 50 : width * 4 / 50,
    },
    letterText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#5390ff'
    },
    sectionViewTop: {//选中灰色区域悬浮,资源池
        width: width,
        backgroundColor: '#eeeeee',
    },
    sectionTextTop: {//当前选中资源池字体,资源池
        color: '#888888',
        fontSize: 15,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 11,

    },
    sectionTextTop1: {//当前选中资源池字体,资源池
        color: '#888888',
        fontSize: 15,
        marginLeft: 11,
        marginBottom: 15,

    },
    sectionView: {//选中灰色区域悬浮,A，
        width: width,
        backgroundColor: '#eeeeee',
        height: 35,
        paddingLeft: 11,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    sectionText: {//当前选中资源池字体,A
        color: '#888888',
        fontSize: 16,
        textAlign: 'left',

    },
    rowView: {
        height: ROWHEIGHT,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: '#F4F4F4',
        borderBottomWidth: 0.5,
        backgroundColor: 'white'
    },
    rowdata: {
        paddingTop: 10,
        paddingBottom: 2
    },

    rowdatatext: { //列表item字体样式
        color: 'black',
        width: width,
        fontSize: 16,
    },
    rowdataBox: {//资源池名称button样式
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginLeft: 11,
        marginBottom: 10,
        width: 95,
        height: 42,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 3,
    },
    rowdatatextBox: {//资源池名称 选择区域字体样式
        marginTop: 10,
        fontSize: 16,
        color: 'black',
        alignSelf: 'center'
    }

});
