import bip39 from 'react-native-bip39';
import bitcoin from 'react-native-bitcoinjs-lib';
import crypto from 'crypto';
import EventEmitter from 'events';

import Constants from './constants';

import bnet from './network';
import Database from '../database';
import axios from 'axios';


class Wallet extends EventEmitter {

    constructor(info) {
        super();
        this.__name = info.name;
        this.__address = info.address;
        this.__wif = info.wif;
        this.__network = info.network;
        this.__password = info.password || undefined;
        this.__utxos = [];

    }

    /**
     * This will set the unspend outputs as retrieved by the network.
     * It will also parse them to retrieve the total number of coins available to the wallet
     * @param value
     */
    set utxos(value) {
        this.__utxos = value;
    }

    get utxos() {
        return this.__utxos;
    }

    /**
     * Coins are not set explicitly but through the unspent outputs
     * @returns {number|*}
     */
    get coins() {
        return this.utxos.reduce((a, c) => a + c.value, 0) / Constants.Bitcoin.Satoshis;
    }

    get name() {
        return this.__name;
    }

    get address() {
        return this.__address;
    }

    get key() {
        return this.address;
    }

    get wif() {
        return this.__wif;
    }

    get network() {
        return this.__network;
    }

    /**
     * This is irreversible as there is not way to decrypt the wallet for good.
     * The only way to read the key is with the readDecrypted function
     * @param password Cleartext or hashed makes no difference
     * @returns {Wallet} It returns itself
     * @code const wallet = Wallet.create(name, mnemonic).encrypt(password);
     */
    encrypt(password) {
        if (this.__password) throw new Error('Cannot re-encrypt an encrypted key');
        this.__password = password;
        const cipher = crypto.createCipher(Wallet.Defaults.Encryption, password);
        this.__wif = cipher.update(this.__wif, 'utf8', 'hex') + cipher.final('hex');
        return this;
    }

    /**
     * This method will NOT decrypt the wallet but temporarily the key and return it to the calling code
     * This method is NOT symmetrical with the encrypt one.
     * @param password Hashed or not it will be used, it only needs to match the one used in encryption
     * @returns {string} It will not return the wallet itself like the encrypt
     */
    readDecrypted(password) {
        if (!this.__password) throw new Error('Cannot de-encrypt an key that was not encrypted');
        if (!password || !this.matches(password)) throw new Error('Passwords do not match');
        const cipher = crypto.createDecipher(Wallet.Defaults.Encryption, password);
        return cipher.update(this.__wif, 'hex', 'utf8') + cipher.final('utf8');
    }

    matches(password) {
        return password === this.__password;
    }


    send(btc, address, fee, password) {

        const satoshis = Math.round(btc * Constants.Bitcoin.Satoshis);

        const network = bnet.current;

        const txb = new bitcoin.TransactionBuilder(network);

        let current = 0;

        for (const utx of this.utxos) {

            txb.addInput(utx.tx_hash_big_endian, utx.tx_output_n);

            current += utx.value;
            if (current >= (satoshis + fee)) break;
        }

        txb.addOutput(address, satoshis);
        const change = current - (satoshis + fee);
        console.log(address);
        console.log(this.address);
        console.log(current);
        console.log(change);
        if (change) txb.addOutput(this.address, change);

        console.log('aft');

        const wif = this.__password ? this.readDecrypted(password) : this.wif;
        const key = bitcoin.ECPair.fromWIF(wif, network);

        txb.sign(0, key);

        const raw = txb.build().toHex();
        return bnet.api.broadcast(raw);
    }


    static sendTransaction() {
        Wallet.collectUtxos((satoshis) => {

            bnet.api.getFee().then((fee) => {
                console.log("fee");
                console.log(fee);
                const satoshis = Math.round(0.00002 * Constants.Bitcoin.Satoshis);

                let key = bitcoin.ECPair.fromWIF("L47iPTNUuNLPoHWKc42yaqE4fXag4Yi86KMvcbyb7TLJRm6ESSzD", bitcoin.networks.bitcoin);
                console.log("pub"); //The above should output: 17hFoVScNKVDfDTT6vVhjYwvCu6iDEiXC4
                console.log(key.getAddress().toString()); //The above should output: 17hFoVScNKVDfDTT6vVhjYwvCu6iDEiXC4
                let tx = new bitcoin.TransactionBuilder();
                tx.addInput("6584d44d8c205f3a33a5093fbb53f501a5a087344d6416b81e5ac74007bd22d1", 0);
                tx.addOutput("17CrdRH4mWgCKwKJKYPU4CZrT89YfFEH2n", satoshis); // 1000 satoshis will be taken as fee.
                tx.addOutput("16z46CESbJTEAFZdvm47w1rqzu4F7HQc8", Math.round(150000 - satoshis + satoshis*fee)); // 1000 satoshis will be taken as fee.
                tx.sign(0, key);
                console.log("before");
                let raw = tx.build().toHex();
                console.log(raw);
                console.log("after");
                bnet.api.broadcast(raw);

            }).catch((e) => {
                console.log('Could not get fee ', e);
            });


        });
    }


    static collectUtxos(callback) {

        axios.get('https://blockchain.info/address/177xBhHZN3bGCH8c7GcVDv4gQ2bYGGvT3v?format=json')
            .then(res => {
                console.log(res.data);
                let satoshis = parseFloat(res.data.final_balance)
                // console.log("received");
                // console.log(balance/Constants.Bitcoin.Satoshis);
                callback(satoshis);
                // console.log("end")
            })
    }


    static get store() {
        if (!Wallet.__store) Wallet.__store = new Database(Wallet.Defaults.DBFileName);
        return Wallet.__store;
    }

    static all() {
        return Wallet.store.find({ network: bnet.name }).then((docs) => {
            return docs.map(doc => new Wallet(doc));
        });
    }


    static generate() {
        return bip39.generateMnemonic();
    }


    static create(name, mnemonic) {

        const seed = bip39.mnemonicToSeed('project nasty dose grunt ritual price gap prison degree agent satisfy across');
        // const seed = bip39.mnemonicToSeed(mnemonic); // random mnemonics
        const master = bitcoin.HDNode.fromSeedBuffer(seed, bnet.current);
        const derived = master.derivePath(Wallet.Defaults.Path);
        // console.log(derived.toBase58());
        // x_pub - success
        console.log(derived.neutered().toBase58());
        const address = derived.getAddress();
        const wif = derived.keyPair.toWIF();



        return new Wallet({
            name: name,
            address: address,
            wif: wif,
            network: bnet.name,
        });

    }

    update() {

        return bnet.api.getUnspentOutputs(this.address).then((result) => {
            this.utxos = result.utxos;
            this.emit(Wallet.Events.Updated);
            return true;
        }, (e) => {
            if (e.toString() === Constants.ReturnValues.NoFreeOutputs) {
                this.emit(Wallet.Events.Updated);
            }
        });
    }

    save() {
        return Wallet.store.insert(this.toObject());
    }

    erase() {
        Wallet.store.remove({ address: this.address });
        this.emit(Wallet.Events.Updated);
    }


    toObject() {
        const obj = {
            name: this.name,
            address: this.address,
            wif: this.wif,
            network: this.network,
        };
        if (this.__password) obj.password = this.__password;
        return obj;
    }
}

// Wallet.Defaults = {
//     Encryption: 'aes-256-cbc',
//     Path: "m/44'/0'/0'/0/0",
//     DBFileName: 'wallets',
// };


Wallet.Defaults = {
    Encryption: 'aes-256-cbc',
    Path: "m/0'",
    DBFileName: 'wallets',
};

Wallet.Events = {
    Updated: 'updated',
};


export default Wallet;
