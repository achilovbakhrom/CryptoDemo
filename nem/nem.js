
import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';

type Props = {};

export default class NEMComponent extends Component<Props> {

    static navigationOptions = ({ navigation }) => ({
        title: 'NEM',
        headerTitleStyle : { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor:'white',
        },
    });

    render() {
        return(
            <View style={styles.bg}>
                <Text> NEM Component </Text>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    bg: {
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    topTitle: {
        marginTop: 20,
        fontSize: 18
    }
});
