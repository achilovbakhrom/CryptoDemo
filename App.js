import React, {Component} from 'react';
import NEMComponent from './nem/index';
import EthereumComponent from './ethereum/index';
import BitcoinComponent from './bitcoin/index';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import {Provider} from 'react-redux';
import store from './redux/store';

const Temp = createDrawerNavigator({
    ETHEREUM: {
        screen: EthereumComponent
    },
    NEM: {
        screen: NEMComponent
    },
    BITCOIN: {
        screen: BitcoinComponent
    },

});

const AppContent = createAppContainer(Temp);

const App = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    )
};


export default App;
