
import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import BitcoinComponent from './bitcoin';

const BitcoinStack = createStackNavigator({
    Home: {
        screen: BitcoinComponent
    }
}, {
    title: "Bitcoin"
});

export default createAppContainer(BitcoinStack);
