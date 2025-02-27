import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { images } from '../../assets';
import styles from './style';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const AddMembers = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { groupId, currentMembers } = route.params;

    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersSnapshot = await firestore().collection('users').get();
            const allUsers = usersSnapshot.docs.map(doc => doc.data());
            const filteredUsers = allUsers.filter(
                user => !currentMembers.some(member => member.userId === user.userId)
            );

            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const toggleMemberSelection = (user) => {
        setSelectedMembers(prev =>
            prev.some(member => member.userId === user.userId)
                ? prev.filter(member => member.userId !== user.userId)
                : [...prev, user]
        );
    };

    const handleAddMembers = async () => {
        if (selectedMembers.length === 0) {
            alert('Please select at least one member');
            return;
        }

        try {
            const groupRef = firestore().collection('groupChats').doc(groupId);
            await groupRef.update({
                members: firestore.FieldValue.arrayUnion(...selectedMembers),
            });
            alert('Members added successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding members:', error);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    }

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.userItem,
                selectedMembers.some(member => member.userId === item.userId) && styles.selectedUserItem,
            ]}
            onPress={() => toggleMemberSelection(item)}
        >
            <Image source={images.user} style={styles.userIcon} />
            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBackPress}>
                <Image source={images.back} style={styles.icon} />
            </TouchableOpacity>
            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.userId?.toString()}
            />
            <CustomButton onPress={handleAddMembers} title="Add Selected Members" style={styles.addButton} textStyle={styles.addButtonText} />
        </View>
    );
};

export default AddMembers;