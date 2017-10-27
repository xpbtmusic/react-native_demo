/**
 * Separator.js
 */

//import liraries
import React, {PureComponent} from 'react'
import { View,StyleSheet} from 'react-native'


// create a component
class Separator extends PureComponent {
    render() {
        return (
            <View style={[styles.line, this.props.style]}/>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    line: {
        height:1,
        backgroundColor:"#eeeeee",
    },
});

//make this component available to the app
export default Separator;
