import React, {Component} from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import EthereumComponent from './ethereum';

const EthereumStack = createStackNavigator({
    Ethereum: {
        screen: EthereumComponent
    }
});

export default createAppContainer(EthereumStack);
