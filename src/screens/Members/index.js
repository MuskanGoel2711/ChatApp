import { View, Text, TouchableOpacity, Image, FlatList, Modal } from 'react-native'
import React, { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { images } from '../../assets';
import styles from './style';
import { useRoute } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const Members = ({ navigation }) => {
    const route = useRoute();
    const { groupName, groupId, members: initialMembers } = route.params;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [members, setMembers] = useState(initialMembers);

    const handleLongPress = (member) => {
        setSelectedMember(member);
        setIsModalVisible(true);
    };

    const handleDeleteMember = async () => {
        if (selectedMember) {
            try {
                await deleteMemberFromFirestore(selectedMember.userId);
                const updatedMembers = members.filter(member => member.userId !== selectedMember.userId);
                setMembers(updatedMembers);
                setIsModalVisible(false);
            } catch (error) {
                console.error("Error deleting member: ", error);
            }
        }
    };

    const deleteMemberFromFirestore = async (userId) => {
        try {
            const doc = await firestore().collection('groupChats').doc(groupId).get();
            const membersArray = doc.data().members;
            const memberToRemove = membersArray.find(member => member.userId === userId);

            if (memberToRemove) {
                await firestore().collection('groupChats').doc(groupId).update({
                    members: firestore.FieldValue.arrayRemove(memberToRemove)
                });
                console.log('Member removed from Firestore:', memberToRemove);
            } else {
                console.log('Member not found in Firestore:', userId);
            }
        } catch (error) {
            console.error('Error deleting member from Firestore:', error);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    }
    const handleAddMembersPress = () => {
        navigation.navigate('AddMembers', { groupId, currentMembers: members });
    };
    const initials = groupName
        ? groupName
            .split(' ') // Split by spaces to get individual words
            .slice(0, 2) // Take the first two words
            .map(word => word.charAt(0)) // Get first character of each word
            .join('') // Join them together
            .toUpperCase() // Convert to uppercase
        : '';

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    const renderMemberItem = ({ item }) => (
        <TouchableOpacity style={styles.memberItem} onLongPress={() => handleLongPress(item)}>
            <View style={styles.memberInitialsContainer}>
                <Text style={styles.memberInitials}>{getInitials(item.firstName, item.lastName)}</Text>
            </View>
            <Text style={styles.memberName}>{item.firstName} {item.lastName}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <Image source={images.back} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.text1}>Group Info</Text>
                <Text style={styles.edit}>Edit</Text>
            </View>
            <View style={styles.imageContainer}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.initials}>{initials}</Text>
                </View>
                <Text style={styles.groupName}>{groupName}</Text>
                <Text style={styles.number}>Group - {members.length} members</Text>
            </View>
            <View style={styles.membersName}>
                <Text style={styles.members}>{members.length} members</Text>
                <View style={styles.flatListContainer}>
                    <TouchableOpacity style={styles.iconContainer} onPress={handleAddMembersPress}>
                        <Image source={images.add} style={styles.icon} />
                        <Text style={styles.addMember}>Add Members</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={members}
                        renderItem={renderMemberItem}
                        keyExtractor={(item) => item.userId?.toString()}
                    />
                </View>
            </View>
            <Modal
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete {selectedMember?.firstName} {selectedMember?.lastName}?</Text>
                        <View style={styles.modalButtonContainer}>
                            <CustomButton title="Delete" onPress={handleDeleteMember} style={{ marginTop: 0 }} />
                            <CustomButton title="Cancel" onPress={() => setIsModalVisible(false)} style={{ marginTop: 0 }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Members;