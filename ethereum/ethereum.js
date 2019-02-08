import React, { Component } from 'react';
import {View, Text} from 'react-native';
type Props = {};
export default class EthereumComponent extends Component<Props> {
    static navigationOptions = ({ navigation }) => ({
        title: 'Ethereum',
        headerTitleStyle : { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor:'white',
        },
    });
    render() {
        return(
            <View>
                <Text> Ethereum Component </Text>
            </View>
        )
    }
}
