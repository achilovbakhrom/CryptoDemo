
import React, { Component } from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight, TextInput, Button} from 'react-native';
import nem from 'nem-sdk';

import Wallet from '../utils/NEMWallet/wallet';

type Props = {};

export default class NEMComponent extends Component<Props> {

    static navigationOptions = ({ navigation }) => ({
        title: 'NEM',
        headerTitleStyle : { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor:'white',
        },
    });

    componentDidMount() {
        let wallet = Wallet.createPRNG("google", "google")
        console.log(wallet)
        Wallet.send("", 0, "NC3Y5HZDEUW3HGGNZJ3MGJRPNTD232QIKMRX5NH6", "hello")

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center', margin: 20}}>
                    <Text> NEM Addresses </Text>
                </View>

                <View style={styles.buttonContent}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("test")
                        }}
                        style={styles.button}>
                        <Text style={styles.text}> Create PRNG Wallet </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            console.log("test")
                        }}
                        style={styles.button}>
                        <Text style={styles.text}> Create Brain Wallet </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.list}
                    renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    console.log("test")
                                }}>
                                <Text> Address </Text>
                            </TouchableOpacity>
                        )
                    }}
                />

            </View>
        )
    }
}

let styles = StyleSheet.create({
    buttonContent: {
        flexDirection: 'row'
    },
    bg: {
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    topTitle: {
        marginTop: 20,
        fontSize: 18
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    button: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: '#101A92',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 15,

    },
    list: {
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        backgroundColor: '#A1A1A1'
    },
    selectedListItem: {
        padding: 10,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'red'
    },
    unselectedListItem: {
        padding: 10,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'aqua'
    },
    topText: {
        marginTop: 20
    }
});
