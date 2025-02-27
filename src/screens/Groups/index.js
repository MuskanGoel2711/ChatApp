import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import styles from './style';
import CustomButton from '../../components/CustomButton';
import { images } from '../../assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomStatus from '../../components/CustomStatus';
import DeleteGroupModal from './DeleteGroupModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Groups = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [groups, setGroups] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem("USERID");
            console.log("Retrieved userId from AsyncStorage:", storedUserId);
            if (storedUserId) {
                setUserId(storedUserId);
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = firestore()
            .collection('groupChats')
            .onSnapshot(snapshot => {
                const allGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Fetched groups from Firestore:", allGroups);

                const filteredGroups = allGroups.filter(group =>
                    group.members?.some(member => {
                        console.log(`Checking group ${group.id}:`, member);
                        return member.userId === userId;
                    })
                );
                console.log("Filtered groups:", filteredGroups);
                setGroups(filteredGroups);
            });

        return () => unsubscribe();
    }, [userId]);

    const formatTimeAgo = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return "";
        const date = new Date(timestamp._seconds * 1000);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60);

        if (diff < 1) return "Just now";
        if (diff < 60) return `${diff} min ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
        return `${Math.floor(diff / 1440)} days ago`;
    };


    const handleBackPress = () => {
        navigation.goBack();
    }

    const handleLongPress = (groupId) => {
        setSelectedGroupId(groupId);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.groupItem}
            onPress={() => navigation.navigate('GroupChat', {
                groupId: item.id,
                groupName: item.name,
                members: item.members,
            })}
            onLongPress={() => handleLongPress(item.id)}
        >
            <Image source={images.group} style={styles.user} />
            <View style={styles.userInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage || "No messages yet"}
                </Text>
            </View>
            <Text style={styles.timeAgo}>{formatTimeAgo(item.lastMessageTimestamp)}</Text>
        </TouchableOpacity>
    )

    const ListEmptyComponent = () => {
        return (
            <View style={styles.emptyView}>
                <View></View>
                <Text style={styles.emptyText}>No Results</Text>
            </View>
        )
    }

    const handleDeleteGroup = async () => {
        if (selectedGroupId) {
            await firestore().collection('groupChats').doc(selectedGroupId).delete();
            setModalVisible(false);
            setSelectedGroupId(null);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <CustomStatus />
            <TouchableOpacity onPress={handleBackPress}>
                <Image source={images.back} style={styles.icon} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>All Groups</Text>
            {loading ? (<View style={styles.groupItem}></View>) :
                (<FlatList
                    data={groups}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={ListEmptyComponent}
                />)}
            <CustomButton title={'+ Create Group'} onPress={() => navigation.navigate('CreateGroup')} />
            <DeleteGroupModal
                visible={modalVisible}
                onDelete={handleDeleteGroup}
                onCancel={() => setModalVisible(false)}
            />
        </View>
    );
};

export default Groups;