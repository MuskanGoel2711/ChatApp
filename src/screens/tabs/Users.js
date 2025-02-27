import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Keyboard, TextInput, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../../assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '../HomeScreen/Modal';
import CustomInput from '../../components/CustomInput';
import { useFocusEffect } from '@react-navigation/native';
import ShimmerUserItem from '../../components/Shimmer';
let id = '';

const Users = ({ navigateToChat, navigateToGroups }) => {
  const insets = useSafeAreaInsets()
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );

  const getUsers = async () => {
    id = await AsyncStorage.getItem('USERID');
    const email = await AsyncStorage.getItem('EMAIL');
    let tempData = [];

    firestore()
      .collection('users')
      .where('email', '!=', email)
      .get()
      .then(async (res) => {
        if (!res.empty) {
          for (const doc of res.docs) {
            let userData = doc.data();
            const chatId =
              id < userData.userId
                ? `${id}_${userData.userId}`
                : `${userData.userId}_${id}`;

            const chatDoc = await firestore().collection('chats').doc(chatId).get();
            const chatData = chatDoc.data() || {}

            tempData.push({
              ...userData,
              lastMessage: chatData.lastMessage || "Say Hi!",
              lastMessageTime: chatData.lastMessageTime || null,
            });
          }
          tempData.sort((a, b) => (b.lastMessageTime?._seconds || 0) - (a.lastMessageTime?._seconds || 0));
          setUsers(tempData);
          setFilteredUsers(tempData);
        }
      })
      .catch((error) => console.error("Error fetching users:", error))
      .finally(() => setLoading(false));
  }

  const handleSearch = (text) => {
    setSearchQuery(text);
    // setFilteredUsers(users);
    if (text.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.firstName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

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

  const openModal = () => {
    Keyboard.dismiss()
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <View></View>
        <Text style={styles.emptyText}>No Results</Text>
      </View>
    )
  }

  const navigateToScreen = () => {
    Keyboard.dismiss()
    navigateToGroups();
    setModalVisible(false);
  }
  // { backgroundColor: getRandomColor(item.userId) }
  const renderItemCircle = ({ item, index }) => {
    const initials = generateInitials(item.firstName, item.lastName || '');
    return (
      <View style={{ marginHorizontal: 15, marginBottom: 0, height: 65 }}>
        <View style={[styles.initialsContainer1, ]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.textBottom}>{item.firstName}</Text>
      </View>

    )
  }

  const renderItem = ({ item, index }) => {
    const initials = generateInitials(item.firstName, item.lastName || '');
    return (
      <TouchableOpacity style={styles.userItem} onPress={() => navigateToChat(item, id)}>
        <View style={[styles.initialsContainer]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.firstName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <Text style={styles.timeAgo}>{formatTimeAgo(item.lastMessageTime)}</Text>
      </TouchableOpacity>
    )
  }

  const generateInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  const getRandomColor = (userId) => {
    const colors = ['#FF5733', '#4b79c4', '#2f96b5', '#F4C724', '#A833FF', '#599166', '#996423'];
    const index = userId ? userId.charCodeAt(0) % colors.length : Math.floor(Math.random() * colors.length);
    return colors[index];
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={images.homeMore} style={styles.more} />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={images.camera} style={styles.camera} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openModal}>
            <Image source={images.bell} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>Chats</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity>
          <View style={styles.initialsContainerStory}>
            <Text style={[styles.initials,{color: 'black'}]}>
              +
            </Text>
          </View>
          <Text style={styles.textBottom}>Add Story</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.userId}
          renderItem={renderItemCircle}
          // ListEmptyComponent={ListEmptyComponent}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <CustomInput
        style={styles.searchInput}
        label="Search users..."
        Icon={images.search}
        placeholderTextColor="black"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <ShimmerUserItem />}
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
        />)}
      < Modal closeModal={closeModal} navigateToScreen={navigateToScreen} isModalVisible={isModalVisible} />
    </View>
  )
}

export default Users

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5f7',
    padding: 15
  },
  header: {
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    color: 'black',
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 15
  },
  userItem: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    // backgroundColor: 'white',
    borderRadius: 10,
    // borderBottomWidth: 0.25
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBottom: {
    color: 'black',
    textAlign: 'center',
    paddingTop: 4
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
  },
  searchInput: {
    marginTop: 15,
    backgroundColor: '#f0f5f7',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black'
  },
  lastMessage: {
    fontSize: 15,
    color: 'gray'
  },
  timeAgo: {
    fontSize: 12,
    color: 'gray'
  },
  initialsContainerStory: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7E50EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsContainer1: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#7E50EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 18,
    color: 'white',
  },
  more: {
    width: 30,
    height: 30,
    tintColor: 'black'
  },
  camera: {
    width: 25,
    height: 25,
    tintColor: 'black',
    marginRight: 20
  },
  icon: {
    width: 33,
    height: 33,
    tintColor: '#7E50EA'
  }
})