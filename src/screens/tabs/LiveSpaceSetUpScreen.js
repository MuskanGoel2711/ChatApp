import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { images } from '../../assets';
import { vh, vw } from '../../utils/Dimensions';
import CustomButton from '../../components/CustomButton';

const LiveSpaceSetupScreen = ({ navigation }) => {
    const [topic, setTopic] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const startLiveSpace = () => {
        // Navigate to the live space screen with the topic and recording option
        navigation.navigate('LiveSpace', { topic, isRecording });
    };

    const handleBackPress = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBackPress}>
                <Image source={images.back} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Your Space</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter the topic"
                value={topic}
                onChangeText={setTopic}
            />
            <TouchableOpacity
                style={styles.option}
                onPress={() => setIsRecording(!isRecording)}
            >
                <Text>{isRecording ? '✅ Recording Enabled' : '⭕ Recording Disabled'}</Text>
            </TouchableOpacity>
            <CustomButton title="Start Now" onPress={startLiveSpace}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // justifyContent: 'center',
    },
    icon: {
        width: vw(35),
        height: vh(35),
        tintColor: 'black'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
    option: {
        padding: 10,
        marginBottom: 20,
    },
});

export default LiveSpaceSetupScreen;