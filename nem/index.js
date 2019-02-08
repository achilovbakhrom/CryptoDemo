import React, {Component} from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import NEMComponent from './nem';

const NEMStack = createStackNavigator({
    NEM: {
        screen: NEMComponent
    }
});

export default createAppContainer(NEMStack);
