import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { images } from '../../assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import ShimmerUserItem from '../../components/Shimmer';

const CreateGroup = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        try {
            const id = await AsyncStorage.getItem('USERID');
            const email = await AsyncStorage.getItem('EMAIL');

            if (!id || !email) {
                console.error("User ID or Email not found in AsyncStorage.");
                return;
            }

            const res = await firestore()
                .collection('users')
                .get();

            if (!res.empty) {
                const tempData = await Promise.all(res.docs.map(async (doc) => {
                    const userData = doc.data();
                    const chatId =
                        id < userData.userId
                            ? `${id}_${userData.userId}`
                            : `${userData.userId}_${id}`;

                    const chatDoc = await firestore().collection('chats').doc(chatId).get();
                    const chatData = chatDoc.exists ? chatDoc.data() : {};

                    return {
                        ...userData,
                        lastMessage: chatData.lastMessage || "Say Hi!",
                        lastMessageTime: chatData.lastMessageTime || null,
                    };
                }));

                tempData.sort((a, b) => (b.lastMessageTime?._seconds || 0) - (a.lastMessageTime?._seconds || 0));
                setUsers(tempData);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally { setLoading(false) };
    };


    const toggleMemberSelection = (user) => {
        setSelectedMembers(prev =>
            prev.some(member => member.userId === user.userId)
                ? prev.filter(member => member.userId !== user.userId)
                : [...prev, user]
        );
    };

    const createGroup = async () => {
        if (!groupName.trim()) {
            alert('Please enter a group name');
            return;
        }
        if (selectedMembers.length === 0) {
            alert('Please select at least one member');
            return;
        }
        const groupId = uuid.v4();

        await firestore().collection('groupChats').doc(groupId).set({
            name: groupName,
            members: selectedMembers.map(member => ({
                userId: member.userId,
                firstName: member.firstName,
                lastName: member.lastName
            })),
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        alert('Group created successfully!');
        navigation.goBack();
    };

    const handleBackPress = () => {
        navigation.goBack();
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={handleBackPress}>
                <Image source={images.back} style={styles.icon} />
            </TouchableOpacity>
            <CustomInput
                label="Enter Group Name"
                value={groupName}
                onChangeText={setGroupName}
                style={{ marginBottom: 20 }}
            />
            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4, 5]}
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => <ShimmerUserItem />}
                />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.userId || item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.userItem, { backgroundColor: selectedMembers.some(member => member.userId === item.userId) ? 'lightblue' : 'white' }]} onPress={() => toggleMemberSelection(item)}>
                            <Image source={images.user} style={styles.user} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{item.firstName}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <CustomButton title="Create Group" onPress={createGroup} />
        </View>
    );
};

export default CreateGroup;


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    userItem: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderRadius: 10,
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between'
    },
    userInfo: {
        flex: 1,
        marginLeft: 10
    },
    userName: {
        fontSize: 16,
        fontWeight: '600'
    },
    user: {
        width: 23,
        height: 23,
        tintColor: '#7E50EA'
    },
    icon: {
        width: 40,
        height: 40,
        tintColor: 'black'
    }
})