import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { TextInput, TouchableOpacity, View, Image, Text, PermissionsAndroid } from 'react-native';
import { Bubble, GiftedChat, Message } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import ImagePicker from 'react-native-image-crop-picker';
import { getLinkPreview } from 'link-preview-js';
import ImageViewing from "react-native-image-viewing";
import RNFS from 'react-native-fs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets';
import styles from './style'
import OptionModal from './OptionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatus from '../../components/CustomStatus';
import ReactionModal from './ReactionModal';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Audio from '../../components/AudioPlayer';

const GroupChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [audioManager, setAudioManager] = useState({
    currentPosition: 0,
    duration: 0
  });
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { groupId, groupName, members } = route.params;

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('USERID');
        const userName = await AsyncStorage.getItem('NAME');
        if (userId && userName) {
          setCurrentUser({ userId, name: userName });
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('groupChats')
      .doc(groupId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => {
          // console.log("Message Data:", doc.data());
          const data = doc.data();
          console.log("Fetched Message ID:", data._id);
          return {
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          };
        });
        const uniqueMessages = Array.from(new Map(fetchedMessages.map(m => [m._id, m])).values());
        setMessages(uniqueMessages);
      });

    return () => unsubscribe();
  }, [groupId]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ]);
    }
  };

  const startRecording = async () => {
    try {
      console.log("Attempting to start recording...");

      await requestPermissions();
      setRecording(true);

      let path = `${RNFS.DocumentDirectoryPath}/audioMessage.mp3`;
      console.log("Recording file path:", path);

      if (Platform.OS === "android" && path.startsWith("file://")) {
        path = path.replace("file://", "");
      }

      const result = await audioRecorderPlayer.startRecorder(path);
      console.log("Recording started:", result);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };


  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    setAudioUri(result);

    if (result) {
      const fileExists = await RNFS.exists(result);
      console.log("File exists after recording:", fileExists, "Path:", result);
      if (fileExists) {
        sendAudioMessage(result);
      } else {
        console.error("Recorded file does not exist!");
      }
    }
  };

  const sendAudioMessage = async (uri) => {
    try {
      const base64Audio = await RNFS.readFile(uri, "base64");
      const newMessage = {
        _id: uuid.v4(),
        createdAt: new Date(),
        user: { _id: currentUser.userId },
        audio: base64Audio,
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));

      await firestore()
        .collection('groupChats')
        .doc(groupId)
        .collection('messages')
        .doc(newMessage._id)
        .set(newMessage);
      await firestore()
        .collection('groupChats')
        .doc(groupId)
        .set(
          {
            lastMessage: '🎵 Audio',
            lastMessageTime: new Date(),
            lastMessageSender: currentUser.userId,
          },
          { merge: true }
        );

      console.log("Audio message saved successfully!");
    } catch (error) {
      console.error("Error sending audio message:", error);
    }
  };

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const stopPlayback = async (currentMessage) => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();

      setAudioManager((prev) => ({
        ...prev,
        [currentMessage._id]: {
          ...prev[currentMessage._id],
          isPause: true,
          currentPosition: 0,
        },
      }));

      setPlayingMessageId(null);
    } catch (error) {
      console.error("Error stopping playback:", error);
    }
  };

  const playAudio = (currentMessage) => {
    console.log("Playing audio for message:", currentMessage._id);

    if (playingMessageId === currentMessage._id && !audioManager[currentMessage._id]?.isPause) {
      // Pause the audio if it's already playing
      stopPlayback(currentMessage);
      return;
    }

    // Stop any currently playing audio
    if (playingMessageId && playingMessageId !== currentMessage._id) {
      stopPlayback(messages.find(msg => msg._id === playingMessageId));
    }

    const audioPath = `${RNFS.DocumentDirectoryPath}/temp_audio_${currentMessage._id}.mp3`;
    RNFS.writeFile(audioPath, currentMessage.audio, "base64")
      .then(() => {
        setPlayingMessageId(currentMessage._id);
        return audioRecorderPlayer.startPlayer(audioPath);
      })
      .then((audioDuration) => {
        console.log("Audio duration:", audioDuration);
        setAudioManager((prev) => ({
          ...prev,
          [currentMessage._id]: {
            isPause: false,
            duration: audioDuration,
            currentPosition: 0,
          },
        }));

        audioRecorderPlayer.addPlayBackListener((e) => {
          console.log("Playback listener:", e.currentPosition, e.duration);
          setAudioManager((prev) => ({
            ...prev,
            [currentMessage._id]: {
              ...prev[currentMessage._id],
              currentPosition: e.currentPosition,
              duration: e.duration
            },
          }));

          if (e.currentPosition >= e.duration) {
            stopPlayback(currentMessage);
          }
        });
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
        stopPlayback(currentMessage);
      });
  };
  const renderMessageAudio = (props) => {
    const { currentMessage } = props;
    const isSentByCurrentUser = currentMessage.user._id === route.params.id;
    console.log("playingMeage", playingMessageId)
    return (
      <Audio
        messageProps={props}
        audioRecorderPlayer={audioRecorderPlayer}
        playingMessageId={playingMessageId}
        setPlayingMessageId={setPlayingMessageId}
        isSentByCurrentUser={isSentByCurrentUser}
        playAudio={playAudio}
        audioManager={audioManager}
        stopPlayback={stopPlayback}
        onLongPress={() => onLongPressMessage(null, currentMessage)}
      />
    );
  };

  const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    return urls ? urls[0] : null;
  };

  const onSend = useCallback(async (newMessages = [], base64Image = null) => {
    if ((!newMessages.length && !base64Image) || !currentUser) return;

    const messageId = uuid.v4();
    const message = newMessages[0] || {};
    const text = message?.text || '';

    const messageData = {
      _id: messageId,
      text,
      sendBy: currentUser.userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      readBy: [currentUser.userId],
      user: {
        _id: currentUser.userId,
        name: currentUser.name
      },
      image: base64Image ? base64Image : message.image || '',
      groupMembers: members?.map(m => ({ userId: m.userId, name: m.name })) || [],
    };

    const url = extractUrl(text);
    if (url) {
      try {
        const preview = await getLinkPreview(url);
        messageData.preview = {
          url,
          title: preview.title,
          description: preview.description,
          image: preview.images?.[0] || ''
        };
      } catch (error) {
        console.error("Error fetching link preview:", error);
      }
    }

    try {
      await firestore()
        .collection('groupChats')
        .doc(groupId)
        .collection('messages')
        .doc(messageId)
        .set(messageData);

      await firestore()
        .collection('groupChats')
        .doc(groupId)
        .update({
          lastMessage: text || "📷 Image",
          lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    // setMessages(previousMessages => {
    //   console.log("Appending Message ID:", messageData._id);
    //   return GiftedChat.append(previousMessages, { ...messageData, createdAt: new Date() });
    // });
    setMessages(previousMessages => {
      const allMessages = GiftedChat.append(previousMessages, [messageData]);

      // Ensure unique messages by filtering out duplicates
      const uniqueMessages = Array.from(new Map(allMessages.map(m => [m._id, m])).values());

      return uniqueMessages;
    });
  }, [groupId, currentUser]);


  const handleInputChange = (text) => {
    setInputText(text);
    // updateTypingStatus(text.length > 0);
  };

  const isOptionModalVisible = () => {
    setOptionModalVisible(false)
  }

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({ cropping: true });
      const base64Image = await RNFS.readFile(image.path, 'base64');

      if (base64Image) {
        onSend([], `data:image/jpeg;base64,${base64Image}`);
      }
    } catch (error) {
      console.error('Image selection error:', error);
    }
  };


  const convertImageToBase64 = async (imagePath) => {
    try {
      const base64String = await RNFS.readFile(imagePath, 'base64');
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const takePhotoFromCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });

      if (image.path) {
        const base64Image = await convertImageToBase64(image.path);
        if (base64Image) {
          console.log("Captured Image Base64:", base64Image);
          onSend([], base64Image);
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const selectEmoji = async (emoji) => {
    if (!selectedMessage) return;

    try {
      const messageRef = firestore()
        .collection('groupChats')
        .doc(groupId)
        .collection('messages')
        .doc(selectedMessage._id);

      let updatedReactions = selectedMessage.reactions || [];
      const userReactionIndex = updatedReactions.findIndex(r => r.userId === currentUser.userId);

      if (userReactionIndex !== -1) {
        if (updatedReactions[userReactionIndex].emoji === emoji) {
          updatedReactions.splice(userReactionIndex, 1);
        } else {
          updatedReactions[userReactionIndex].emoji = emoji;
        }
      } else {
        updatedReactions.push({ userId: currentUser.userId, emoji });
      }

      await messageRef.update({ reactions: updatedReactions });
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === selectedMessage._id
            ? { ...msg, reactions: updatedReactions }
            : msg
        )
      );

      setReactionModalVisible(false);
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };


  const deleteMessage = async () => {
    if (!selectedMessage) return;

    try {
      await firestore()
        .collection('groupChats')
        .doc(groupId)
        .collection('messages')
        .doc(selectedMessage._id)
        .delete();

      setReactionModalVisible(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const deleteAllMessages = async () => {
    try {
      const messagesRef = firestore()
        .collection('groupChats')
        .doc(groupId)
        .collection('messages');

      const snapshot = await messagesRef.get();

      const batch = firestore().batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setMessages([]);
    } catch (error) {
      console.error('Error deleting all messages:', error);
    }
  };

  const onLongPressMessage = (context, message) => {
    setSelectedMessage(message);
    setReactionModalVisible(true);
  };
  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isSentByCurrentUser = currentUser?.userId === currentMessage?.user?._id;

    return (
      <TouchableOpacity
        onLongPress={() => {
          setReactionModalVisible(true);
          setSelectedMessage(currentMessage);
        }}
        activeOpacity={0.9}
      >
        <View>
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#EDE7FC',
                marginLeft: 14,
                padding: 5,
                paddingBottom: 1,
                marginBottom: 6,
                borderRadius: 12,
              },
              right: {
                backgroundColor: '#7E50EA',
                marginRight: 10,
                padding: 10,
                marginBottom: 6,
                borderRadius: 12
              },
            }}
            renderMessageText={(props) => (
              <View>
                {!isSentByCurrentUser && currentMessage.user && (
                  <Text
                    style={{
                      fontSize: 16,
                      color: isSentByCurrentUser ? '#fff' : '#7E50EA',
                      marginBottom: 4,
                      fontWeight: 'bold',
                    }}
                  >
                    {currentMessage.user.firstName}
                  </Text>
                )}
                {/* Display the message text */}
                <Text
                  style={{
                    color: isSentByCurrentUser ? '#fff' : 'black',
                    paddingBottom: 12,
                  }}
                >
                  {currentMessage.text}
                </Text>
              </View>
            )}
          />
          {/* <Message {...props} /> */}
          {/* {currentMessage.audio && (
            <View style={{
              alignItems: isSentByCurrentUser ? 'flex-end' : 'flex-start',
              marginHorizontal: 10,
              marginVertical: 5,
            }}>
              {renderMessageAudio(props)}
            </View>
          )} */}
          {currentMessage.reactions && currentMessage.reactions.length > 0 && (
            <View style={{
              position: 'absolute',
              bottom: -10,
              right: isSentByCurrentUser ? 10 : 'auto',
              left: isSentByCurrentUser ? 'auto' : 60,
              backgroundColor: 'white',
              borderRadius: 10,
              paddingHorizontal: 5,
              paddingVertical: 2,
              flexDirection: 'row',
            }}>
              {currentMessage.reactions.map((reaction, index) => (
                <Text key={index} style={{ fontSize: 16 }}>{reaction.emoji}</Text>
              ))}
            </View>
          )}
          {currentMessage.preview && (
            <TouchableOpacity
              onPress={() => Linking.openURL(currentMessage.preview.url)}
              style={{
                marginTop: 5,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#ddd',
                width: '80%',
                alignSelf: isSentByCurrentUser ? 'flex-end' : 'flex-start',
              }}
            >
              {currentMessage.preview.image ? (
                <Image
                  source={{ uri: currentMessage.preview.image }}
                  style={{ width: '100%', height: 200 }}
                  resizeMode="cover"
                />
              ) : null}
              <View style={{ padding: 5, backgroundColor: '#f0f0f0' }}>
                <Text style={{ fontWeight: 'bold' }}>{currentMessage.preview.title}</Text>
                {currentMessage.preview.description ? (
                  <Text numberOfLines={2}>{currentMessage.preview.description}</Text>
                ) : null}
                <Text style={{ color: 'blue' }}>{currentMessage.preview.url}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderInputToolBar = () => {
    return (
      <View style={styles.searchInputContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={images.plus}
            style={styles.plus}
            resizeMode="center"
          />
        </TouchableOpacity>
        <TextInput
          placeholder={'Your Typed message'}
          style={styles.searchInput}
          value={inputText}
          onChangeText={handleInputChange}
          returnKeyType="send"
          onSubmitEditing={() => {
            if (inputText.trim()) {
              onSend([{
                _id: uuid.v4(),
                text: inputText,
                createdAt: new Date(),
                user: { _id: currentUser.userId }
              }]);
              setInputText('');
            }
          }}
        />
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Image
            source={recording ? images.stop : images.mic}
            style={styles.sendInputIcon}
            resizeMode="center"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhotoFromCamera}>
          <Image
            source={images.camera}
            style={styles.sendInputIcon}
            resizeMode="center"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (inputText.trim()) {
            onSend([{ _id: uuid.v4(), text: inputText, createdAt: new Date(), user: { _id: currentUser.userId } }]);
          }
        }}>
          <Image
            source={images.send}
            style={styles.sendInputIcon}
            resizeMode="center"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessageImage = (props) => {
    const { currentMessage } = props;
    return currentMessage.image ? (
      <TouchableOpacity
        onLongPress={() => {
          console.log("Long pressed image message:", currentMessage);
          setReactionModalVisible(true);
          setSelectedMessage(currentMessage);
        }}
        onPress={() => {
          setSelectedImage([{ uri: currentMessage.image }]);
          setPreviewVisible(true);
        }}>
        <Image
          source={{ uri: currentMessage.image }}
          style={{ width: 200, height: 200, borderRadius: 10 }}
          resizeMode="cover"
        />
      </TouchableOpacity>

    ) : null;
  }

  const handleBackPress = () => {
    navigation.goBack();
  }

  const initials = groupName
    ? groupName
      .split(' ') // Split by spaces to get individual words
      .slice(0, 2) // Take the first two words
      .map(word => word.charAt(0)) // Get first character of each word
      .join('') // Join them together
      .toUpperCase() // Convert to uppercase
    : '';

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <CustomStatus />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={images.back} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Members',{groupName,groupId,members})} style={styles.headerTextContainer}>
          <Text style={styles.name}>{groupName}</Text>
          <Text style={styles.membersText}>
            {members.map(member => member.firstName).join(', ')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOptionModalVisible(true)}>
          <Image source={images.threeDots} style={styles.iconThree} />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: currentUser?.userId }}
        renderInputToolbar={renderInputToolBar}
        renderMessageImage={renderMessageImage}
        renderMessage={renderMessage}
        renderMessageAudio={renderMessageAudio}
        onLongPress={onLongPressMessage}
        forceUpdate={audioManager?.currentPosition}
      />
      {previewVisible && selectedImage && (
        <ImageViewing
          images={selectedImage}
          imageIndex={0}
          visible={previewVisible}
          onRequestClose={() => setPreviewVisible(false)}
          doubleTapToZoomEnabled={true}
        />
      )}
      <ReactionModal
        modalVisible={reactionModalVisible}
        isModalVisible={setReactionModalVisible}
        isConfirmDeleteModalVisible={setConfirmDeleteModalVisible}
        selectEmoji={selectEmoji}
        deleteMessage={deleteMessage}
      />
      <OptionModal
        optionModalVisible={optionModalVisible}
        deleteAllMessages={deleteAllMessages}
        isOptionModalVisible={setOptionModalVisible}
      />
    </View>
  );
};

export default GroupChat;