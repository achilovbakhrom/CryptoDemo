import React, {Component} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight, TextInput} from 'react-native';
// import Modal from 'react-native-modal';
type Props = {};
import Wallet from '../utils/BitcoinWallet/wallet';

import Constants from '../utils/BitcoinWallet/constants';

export default class BitcoinComponent extends Component<Props> {

    static navigationOptions = ({navigation}) => ({
        title: 'Bitcoin',
        headerTitleStyle: {textAlign: 'center', alignSelf: 'center'},
        headerStyle: {
            backgroundColor: 'white',
        },
    });

    constructor(props) {
        super(props);

        this.handleCreate = this.handleCreate.bind(this);
        this.showModal = this.showModal.bind(this);
        this.dismissModal = this.dismissModal.bind(this);
        this.showErrorModal = this.showErrorModal.bind(this);
        this.dismissErrorModal = this.dismissErrorModal.bind(this);
        this.passwordTextChange = this.passwordTextChange.bind(this);
        this.confirmPasswordTextChange = this.confirmPasswordTextChange.bind(this);
        this.nameChange = this.nameChange.bind(this);

        this.state = {
            createModalVisibility: false,
            errorModalVisibility: false,
            password: '',
            confirmPassword: '',
            name: '',
            wallets: [],
            errorMessage: ''
        }
    }

    showModal() {
        this.setState({
            createModalVisibility: true
        })
    }

    dismissModal() {
        this.setState({
            createModalVisibility: false
        })
    }

    showErrorModal(text) {
        this.setState({
            errorMessage: text,
            errorModalVisibility: true
        })
    }

    dismissErrorModal() {
        this.setState({
            errorModalVisibility: false
        })
    }

    handleCreate() {
        const { password, confirmPassword, name } = this.state;
        if (name && password && confirmPassword && password === confirmPassword) {
            this.setState({
                createModalVisibility: false
            });
            const mnemonic = Wallet.generate();
            const wallet = Wallet.create(name, mnemonic).encrypt(password);
            this.__addWallet(wallet, mnemonic)
        } else {
            this.setState({
                errorMessage: 'Name empty or password and confirm password fields are not equal',
                createModalVisibility: false,
                errorModalVisibility: true
            })
        }
    }

    __addWallet(wallet, mnemonic) {
        this.setState({
            wallets: this.state.wallets.concat([wallet]),
        });
        wallet.save().then(() => {
            setTimeout(() => {
                this.showErrorModal(Constants.Messages.Wallet.Mnemonic);
            }, 1000);
        }, () => {
            this.showErrorModal(Constants.Messages.Wallet.Failed);
        });
    }


    passwordTextChange(text) {
        this.setState({
            password: text
        })
    }

    confirmPasswordTextChange(text) {
        this.setState({
            confirmPassword: text
        })
    }

    nameChange(text) {
        this.setState({
            name: text
        })
    }


    createModalContent() {
        return (
            <Modal
                transparent={true}
                visible={this.state.createModalVisibility}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        borderRadius: 20,
                        backgroundColor: 'white',
                        width: 300,
                        height: 250
                    }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text>Set password to wallet!</Text>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 20,
                                marginLeft: 20,
                                marginRight: 20,
                                marginBottom: 8,
                            }}>
                                <TextInput
                                    style={{height: 40, fontSize: 20, borderColor: 'gray', borderWidth: 1, flex: 1}}
                                    maxLength={20}
                                    multiline={false}
                                    placeholder='Wallet name'
                                    onChangeText={this.nameChange}
                                />
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 8,
                                marginLeft: 20,
                                marginRight: 20,
                                marginBottom: 8,
                            }}>
                                <TextInput
                                    style={{height: 40, fontSize: 20, borderColor: 'gray', borderWidth: 1, flex: 1}}
                                    maxLength={20}
                                    multiline={false}
                                    placeholder='Enter password'
                                    secureTextEntry={true}
                                    onChangeText={this.passwordTextChange}
                                />
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 8,
                                marginLeft: 20,
                                marginRight: 20,
                                marginBottom: 20
                            }}>
                                <TextInput
                                    style={{height: 40, fontSize: 20, borderColor: 'gray', borderWidth: 1, flex: 1}}
                                    maxLength={20}
                                    multiline={false}
                                    placeholder='Re enter password'
                                    secureTextEntry={true}
                                    onChangeText={this.confirmPasswordTextChange}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 20
                                }}>
                                <TouchableHighlight
                                    style={{
                                        flex: 1,
                                        alignItems: 'center'
                                    }}
                                    onPress={this.dismissModal}>
                                    <Text
                                        style={{
                                            color: 'blue',
                                            fontSize: 20
                                        }}>Cancel</Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={{
                                        flex: 1,
                                        alignItems: 'center'
                                    }}
                                    onPress={this.handleCreate}>
                                    <Text
                                        style={{
                                            color: 'blue',
                                            fontSize: 20
                                        }}>Create</Text>
                                </TouchableHighlight>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    errorModalContent() {
        return (
            <Modal transparent={true}
                   visible={this.state.errorModalVisibility}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        borderRadius: 20,
                        backgroundColor: 'white',
                        width: 300,
                        height: 150
                    }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    color: 'red',
                                    flex: 1
                                }}>
                                <Text> {this.state.errorMessage}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: 15
                                }}>
                                <TouchableHighlight
                                    style={{
                                        alignItems: 'center'
                                    }}
                                    onPress={this.dismissErrorModal}>
                                    <Text
                                        style={{
                                            color: 'blue',
                                            fontSize: 20
                                        }}>Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center', margin: 20}}>
                    <Text> BITCOIN Addresses </Text>
                </View>

                <TouchableOpacity
                    onPress={this.showModal}
                    style={styles.button}>
                    <Text style={styles.text}> Create Address</Text>
                </TouchableOpacity>
                <FlatList
                    style={styles.list}
                    data={this.state.wallets}
                    renderItem={(item) => {
                        console.log(item);
                        return (<Text> {item.item.__name + " " + item.item.__address}</Text>)
                    }}
                />
                {this.errorModalContent()}
                {this.createModalContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    }
});
