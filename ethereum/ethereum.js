import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Wallet from '../utils/EtherWallet/wallet';


type Props = {};
export default class EthereumComponent extends Component<Props> {
    static navigationOptions = ({ navigation }) => ({
        title: 'Ethereum',
        headerTitleStyle : { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor:'white',
        },
    });

    componentDidMount(){
        Wallet.createAccount("jjjasdfdsaokdkrtikertkfbvhdjskdeasfirjdi");
    }

    render() {
        return(
            <View>
                <Text> Ethereum Component </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({

});
