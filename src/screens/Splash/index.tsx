import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { images } from '../../assets/index';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamListSplash = {
    HomeScreen: undefined;
    Login: undefined;
};

type SplashScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamListSplash, 'Login'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            checkLogin();
        }, 2000);
    }, [navigation]);
    const checkLogin = async () => {
        const id = await AsyncStorage.getItem('USERID');
        if (id !== null) {
            navigation.navigate('HomeScreen')
        } else {
            navigation.navigate('Login')
        }
    }

    return (
        <View style={styles.MainContainer}>
            <Text style={styles.text}>Firebase Chat App</Text>
        </View>
    );
};

export default SplashScreen;