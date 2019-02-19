import EventEmitter from 'events';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);

class Wallet extends EventEmitter {

    constructor() {
        super()
    }

    static createAccount(entropy) {
        console.log(web3.eth);
        let acc = web3.eth.accounts.create([entropy]);
        console.log(acc)
    }





}

export default Wallet;
