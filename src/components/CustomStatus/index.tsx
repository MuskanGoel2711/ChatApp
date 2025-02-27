import { View, StatusBar } from 'react-native'
import React from 'react'

const CustomStatus = () => {
    return (
        <View>
            <StatusBar
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
                translucent={true}
            />
        </View>
    )
}

export default CustomStatus;