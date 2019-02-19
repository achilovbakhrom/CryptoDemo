import nem from 'nem-sdk';
import Database from '../database';
import EventEmitter from 'events';

class Wallet extends EventEmitter {

    constructor() {
        super()
    }


    static createPRNG(name, password) {
        const  wallet = nem.model.wallet.createPRNG(name, password, nem.model.network.data.mainnet.id)
        return wallet
    }

    static createBrain(name, password) {
        let wallet = nem.model.wallet.createBrain(name, password, nem.model.network.data.mainnet.id)
        return wallet
    }

    static send(privateKey, amount, recipient, message) {

        var rBytes = nem.crypto.nacl.randomBytes(32);
        // convert the random bytes to an hex string
        // the result, rHex, can be printed out to the console for taking a backup with console.log(rBytes).
        // Take a backup copy of that value as it lets you recreate the keypair to give
        // you access to your account.
        // This value is also usable with the NEM NanoWallet.
        var rHex = nem.utils.convert.ua2hex(rBytes);
        console.log("enter")
        // generate the keypair
        var keyPair = nem.crypto.keyPair.create(rHex);
        console.log("addr")
        recipient = nem.model.address.toAddress(keyPair.publicKey.toString(),  nem.model.network.data.testnet.id)
        // privateKey = keyPair.secretKey;
        // console.log("addr")

        privateKey = nem.crypto.helpers.derivePassSha("passphrase", 6000).priv;
        var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
        var transferTransaction = nem.model.objects.get("transferTransaction");
        var common = nem.model.objects.get("common");
        common.privateKey = privateKey
        transferTransaction.amount = nem.utils.helpers.cleanTextAmount(amount);
        // Recipient address must be clean (no hypens: "-")
        transferTransaction.recipient = nem.model.address.clean(recipient);
        // Set message
        transferTransaction.message = message;
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
        // Serialize transfer transaction and announce
        nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
            // If code >= 2, it's an error
            console.log(res);
            if (res.code >= 2) {
                alert(res.message);
            } else {
                alert(res.message);
            }
        }, function(err) {
            console.log(err);
            alert(err);
        });
    }


}

export default Wallet;
