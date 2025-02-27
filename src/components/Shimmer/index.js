import React from 'react';
import { View, Animated } from 'react-native';
import styles from './style'
import { Text } from 'react-native-gesture-handler';

const ShimmerUserItem = () => {
    const shimmerAnim = new Animated.Value(0);

    Animated.loop(
        Animated.sequence([
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(shimmerAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]),
        { iterations: -1 }
    ).start();

    const interpolateColor = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ccc', '#fff'],
    });

    //   return (
    //     <View style={styles.userItem1}>
    //       <View style={[styles.user, { backgroundColor: interpolateColor }]} />
    //       <View style={styles.userInfo}>
    //         <View style={[styles.userName, { backgroundColor: interpolateColor, height: 15 }]} />
    //         <View style={[styles.lastMessage, { backgroundColor: interpolateColor, height: 10 }]} />
    //       </View>
    //       <View style={[styles.timeAgo, { backgroundColor: interpolateColor, height: 10 }]} />
    //     </View>
    //   );
    return (
        <View style={styles.userItem1}>
            {/* <View style={[styles.user]} /> */}
            <View style={[styles.initialsContainer]}>
                <Text style={styles.initials}></Text>
            </View>
            <View style={styles.userInfo}>
                <View style={[styles.userName, { height: 15 }]} />
                <View style={[styles.lastMessage, { height: 10 }]} />
            </View>
            <View style={[styles.timeAgo, { height: 10 }]} />
        </View>
    );
};

export default ShimmerUserItem;