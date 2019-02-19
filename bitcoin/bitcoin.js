import React, {Component} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight, TextInput, Button} from 'react-native';
// import Modal from 'react-native-modal';

var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();

type Props = {};

import Wallet from '../utils/BitcoinWallet/wallet';
import net from '../utils/BitcoinWallet/network';
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
        this.showPayments = this.showPayments.bind(this);
        this.hidePayments = this.hidePayments.bind(this);
        this.state = {
            createModalVisibility: false,
            errorModalVisibility: false,
            password: '',
            confirmPassword: '',
            name: '',
            errorMessage: '',
            selectedWalletIndex: 0,
            selectedWallet: null,
            showDetailsModal: false,
            payments: []
        }
    }

    componentDidMount() {

        Wallet.sendTransaction()

        // Wallet.all().then((wallets) => {
        //
        //     this.wallets = wallets;
        //     this.setState({
        //         wallets: wallets,
        //     });
            // console.log("bfore test");
            // console.log(wallets);
            // let a = this.wallets[6].send(0.0, this.wallets[0].address, 0, '111');
            // console.log(a);
            // console.log("test1");
            // console.log(this.wallets);
            // console.log("begin");
            // console.log(insight);

            // "mkoA3oosAKnqhC67pRxeqHjgqjSjoadSHy"
            // "13mtk1K3b1hTcT42WPtvngazAbR66NoA8w"

            //"xpub xpub69VALARCTZ12pptZKtmCvUmDkgwd9TLn69cR8mSSfLJUyeA3hvevnTd4hwQ5BzHyDrE9ao9zfkUBkPgJsyC5H1z336AhTw9L72M7TiYoXG5"
            // insight.getUtxos('1CWCbxhnVavxxzzv49EwaQBvBbnJTVjpxe', function(err, utxos) {
            //     if (err) {
            //         console.log("error");
            //         console.log(err)
            //     } else {
            //         console.log("utxos");
            //         console.log(utxos)
            //     }
            // });

            // insight.getUnspentUtxos('1JVNvRDPNLcxV3PigTg8LRTE8kKv4rXdua', function(err, utxos) {
            //     if (err) {
            //         console.log("error");
            //         console.log(err)
            //     } else {
            //         console.log("utxos");
            //         console.log(utxos)
            //     }
            // });


            // net.api.getTransactions(wallets.map(w => w.address)).then((txs) => {
            //     this.transactions = txs;
            // });


            // net.api.getTransactions(['xpub69VALARCTZ12pptZKtmCvUmDkgwd9TLn69cR8mSSfLJUyeA3hvevnTd4hwQ5BzHyDrE9ao9zfkUBkPgJsyC5H1z336AhTw9L72M7TiYoXG5']).then((txs) => {
            //     console.log('begin');
            //     console.log(txs);
            //     console.log('end');
            //     this.transactions = txs;
            // });

        // });
    }

    set transactions(txs) {
        this._transactions = txs;
        const addressToWallet = {};
        this.wallets.forEach((w) => {
            addressToWallet[w.address] = w;
        });
        const payments = [];
        // transactions come in the order of the addresses passed

        txs.forEach((tx, i) => {
            const wallet = this.wallets[i];
            console.log(tx);
            tx.out.forEach((out, j) => {
                payments.push({
                    key: `${i}/${j}`,
                    name: wallet ? wallet.name : out.addr,
                    address: out.addr,
                    inflow: wallet !== undefined,
                    time: new Date(tx.time * 1000).toDateString(),
                    coins: out.value / 100000000,
                    hash: tx.hash,
                });
            });
        });

        this.setState({
            payments: payments
        });
    }

    get transactions() {
        if (!this._transactions) this._transactions = [];
        return this._transactions;
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

//             let seed16to64bytes = someMnemonicObject.toSeedBuffer(); // BIP39 gives 64 byte hash of the phrase
//             let xprvString = bitcoin.HDNode.fromSeedBuffer(seed16to64bytes).toBase58();
// // ----------------------------------------------------
// // 2 levels of 0' here as per BIP44 spec
//             let xpubString = bitcoin.HDNode.fromBase58(xprvString).derivePath("m/44'/0'/0'").neutered().toBase58();
// // no m/ since this xpub is the 3rd layer, not the top layer of the HD tree
//             let address = bitcoin.HDNode.fromBase58(xpubString).derivePath("0/0").getAddress();

            mnemonic.then((mnemonic) => {

                const wallet = Wallet.create(name, mnemonic).encrypt(password);
                this.__addWallet(wallet, mnemonic)
            });
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

    showPayments(index) {
        this.setState({
            selectedWalletIndex: index,
            showDetailsModal: true,
            selectedWallet: this.state.wallets[index]
        })
    }

    paymentsModalContent() {

        let payments = [];

        this.state.payments.forEach((item) => {
            if (this.state.selectedWallet && this.state.selectedWallet.address && item.address === this.state.selectedWallet.address) {
                payments.push(item);
            }
        });

        console.log(this.state.payments);

        return (
            <Modal
                transparent={false}
                visible={this.state.showDetailsModal}>
                <View>
                    <View style={styles.topText}>
                        <Button
                            title="Close"
                            color="#841584"
                            onPress={this.hidePayments} />
                    </View>
                    <View>
                        <Text> Transaction {this.state.selectedWallet && this.state.selectedWallet.__address}</Text>
                    </View>
                    <FlatList
                        style={styles.list}
                        data={payments}
                        extraData={this.state.payments}
                        renderItem={({item}) => {
                            return (
                                <Text style={styles.unselectedListItem}> {item.key + " " + item.name + " " + item.address}</Text>
                            )
                        }}
                    />
                </View>
            </Modal>
        )
    }

    hidePayments() {
        this.setState({
            showDetailsModal: false
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
                    extraData={this.state.selectedWallet}
                    renderItem={({item, index}) => {
                        console.log(this.state.selectedWallet === index);
                        return (
                            <TouchableOpacity
                                onPress={() => this.showPayments(index)}>
                                <Text style={this.state.selectedWalletIndex === index ? styles.selectedListItem : styles.unselectedListItem}> {item.__name + " " + item.__address}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
                {this.errorModalContent()}
                {this.createModalContent()}
                {this.paymentsModalContent()}
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
