import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { getLinkPreview } from 'link-preview-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Image, Text, TextInput, TouchableOpacity, View, PermissionsAndroid, Platform, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import Slider from "@react-native-community/slider";
import ImagePicker from 'react-native-image-crop-picker';
import ImageViewing from "react-native-image-viewing";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { images } from '../../assets/index';
import OptionModal from './OptionModal';
import ReactionModal from './ReactionModal';
import styles from './style';
import Audio from '../../components/AudioPlayer';

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [playingMessageId, setPlayingMessageId] = React.useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  // const audioRecorderPlayer = new AudioRecorderPlayer();
  const [recording, setRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [audioManager, setAudioManager] = useState({
    currentPosition: 0,
    duration: 0
  }); // { [currentMsgId] : audioPath, isPause: false, duration: 0, currentPosition: 0, }
  // const sliderRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { data } = route.params;


  const chatId =
    route.params.id < route.params.data.userId
      ? `${route.params.id}_${route.params.data.userId}`
      : `${route.params.data.userId}_${route.params.id}`;
  useEffect(() => {
    if (!route.params?.id || !route.params?.data?.userId) return;
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const allMessages = querySnapshot.docs.map(item => {
          const data = item.data();
          let createdAt = new Date();
          if (data.createdAt) {
            if (typeof data.createdAt === 'object' && data.createdAt._seconds !== undefined) {
              createdAt = new Date(data.createdAt._seconds * 1000);
            } else if (typeof data.createdAt === 'number' && !isNaN(data.createdAt)) {
              createdAt = new Date(data.createdAt);
            } else {
              console.warn("Invalid createdAt:", data.createdAt);
            }
          } else {
            console.warn("Missing createdAt field in message:", data);
          }
          return {
            ...data,
            createdAt,
          };
        });
        setMessages(allMessages)
        querySnapshot.docs.forEach(doc => {
          const msgData = doc.data();
          if (msgData.sendTo === route.params.id && !msgData.read) {
            firestore()
              .collection('chats')
              .doc(chatId)
              .collection('messages')
              .doc(doc.id)
              .update({ read: true });
          }
        });
      })
    return () => unsubscribe();
  }, [route.params.id, route.params.data.userId])

  useEffect(() => {
    const typingListener = firestore()
      .collection('chats')
      .doc(chatId)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const data = snapshot.data();
          setIsOtherUserTyping(data?.typing === route.params.data.userId);
        }
      });

    return () => typingListener();
  }, [chatId]);

  console.log('player messge id', playingMessageId);


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
    await requestPermissions();
    setRecording(true);
    const path = `${RNFS.DocumentDirectoryPath}/audioMessage.mp3`;
    if (path.startsWith("file://")) {
      path = path.replace("file://", "");
    }
    const result = await audioRecorderPlayer.startRecorder(path);
    console.log("Recording started, file path:", result);
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
        user: { _id: route.params.id },
        audio: base64Audio,
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));

      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(newMessage._id)
        .set(newMessage);
      await firestore()
        .collection('chats')
        .doc(chatId)
        .set(
          {
            lastMessage: '🎵 Audio',
            lastMessageTime: new Date(),
            lastMessageSender: route.params.id,
            participants: [route.params.id, route.params.data.userId],
            typing: null,
          },
          { merge: true }
        );

      console.log("Audio message saved successfully!");
    } catch (error) {
      console.error("Error sending audio message:", error);
    }
  };

  const audioRecorderPlayer = React.useRef(new AudioRecorderPlayer()).current;
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

  const convertImageToBase64 = async (imagePath) => {
    try {
      const base64String = await RNFS.readFile(imagePath, 'base64');
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const updateTypingStatus = (isTyping) => {
    firestore().collection('chats').doc(chatId).set(
      { typing: isTyping ? route.params.id : null },
      { merge: true }
    );
  };

  const handleInputChange = (text) => {
    setInputText(text);
    updateTypingStatus(text.length > 0);
  };

  const onSend = useCallback(async (messages = [], base64Image = null) => {
    // if (!messages.length || !inputText.trim()) return;
    if (!messages.length && !base64Image) return;
    const msg = messages.length ? messages[0] : { text: '', image: base64Image };
    let previewData = null;

    const urlMatch = msg.text.match(/\bhttps?:\/\/\S+/gi);
    if (urlMatch) {
      try {
        const preview = await getLinkPreview(urlMatch[0]);
        previewData = {
          title: preview.title,
          description: preview.description,
          image: preview.images?.[0] || preview.favicons?.[0] || '',
          url: urlMatch[0]
        };
        msg.text = '';
      } catch (error) {
        console.error("Failed to fetch link preview:", error);
      }
    }

    const myMsg = {
      ...msg,
      _id: uuid.v4(),
      text: msg.text,
      createdAt: new Date(),
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      user: { _id: route.params.id },
      image: base64Image || msg.image || '',
      preview: previewData,
      read: false,
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));

    firestore().collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc(myMsg._id)
      .set(myMsg)
      .then(() => console.log("Message added successfully!"))
      .catch(err => console.error("Error adding message:", err));

    firestore().collection('chats')
      .doc(chatId)
      .set(
        {
          lastMessage: base64Image ? '📷 Image' : (myMsg.text || myMsg.preview?.url),
          lastMessageTime: new Date(),
          lastMessageSender: route.params.id,
          participants: [route.params.id, route.params.data.userId],
          typing: null,
        },
        { merge: true }
      );

    setInputText('');
  }, [inputText]);

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
          onSend([], base64Image);
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const choosePhotoFromLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      if (image.path) {
        const base64Image = await convertImageToBase64(image.path);
        if (base64Image) {
          onSend([], base64Image);
        }
      }
    } catch (error) {
      console.error("Gallery error:", error);
    }
  };

  const isModalVisible = () => {
    setModalVisible(false)
  }

  const isConfirmDeleteModalVisible = () => {
    setConfirmDeleteModalVisible(true)
  }

  const isOptionModalVisible = () => {
    if (selectedMessage?.image) {
      return (
        <OptionModal
          visible={optionModalVisible}
          onClose={() => setOptionModalVisible(false)}
          options={[
            { text: "Delete Image", onPress: deleteImageMessage },
            { text: "Cancel", onPress: () => setOptionModalVisible(false) },
          ]}
        />
      );
    }
  };

  const selectEmoji = (emoji) => {
    if (!selectedMessage) return;

    const newReaction = selectedMessage.reaction === emoji ? null : emoji;

    firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc(selectedMessage._id)
      .update({ reaction: newReaction })
      .then(() => console.log("Reaction added!"))
      .catch(err => console.error("Error updating reaction:", err));

    setReactionModalVisible(false);
  };

  const deleteMessage = () => {
    if (!selectedMessage) return;

    firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc(selectedMessage._id)
      .delete()
      .then(() => {
        console.log("Message deleted successfully!");
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== selectedMessage._id));
      })
      .catch(err => console.error("Error deleting message:", err));

    setSelectedMessage(null);
    setConfirmDeleteModalVisible(false);
  };

  const deleteAllMessages = () => {
    firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .get()
      .then(querySnapshot => {
        const batch = firestore().batch();
        querySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });

        return batch.commit();
      })
      .then(() => {
        console.log("All messages deleted successfully!");
        setMessages([]);
      })
      .catch(err => console.error("Error deleting all messages:", err));
  };

  const deleteImageMessage = async () => {
    if (!selectedMessage || !selectedMessage.image) return;

    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(selectedMessage._id)
        .delete();

      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== selectedMessage._id));

      console.log("Image message deleted successfully!");
    } catch (error) {
      console.error("Error deleting image message:", error);
    }
    setOptionModalVisible(false);
  };

  const onLongPressMessage = (context, message) => {
    console.log("Long pressed message:", message);
    setSelectedMessage(message);
    if (message.image || message.preview) {
      console.log("Opening reaction modal");
      setReactionModalVisible(true);
    }else{
      setReactionModalVisible(true);
    }
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isSentByCurrentUser = currentMessage.user._id === route.params.id;

    return (
      <View>
        {!currentMessage.audio && <Message {...props} />}
        {currentMessage.audio && (
          <View style={{
            alignItems: isSentByCurrentUser ? 'flex-end' : 'flex-start',
            marginHorizontal: 10,
            marginVertical: 5,
          }}>
            {renderMessageAudio(props)}
          </View>
        )}
        {currentMessage.preview && (
          <TouchableOpacity
            onPress={() => Linking.openURL(currentMessage.preview.url)}
            onLongPress={() => onLongPressMessage(null, currentMessage)}
            style={{ marginTop: 5, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd', width: '80%', alignSelf: isSentByCurrentUser ? 'flex-end' : 'flex-start', }}
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
        {isSentByCurrentUser && (
          <Text style={{ fontSize: 10, color: currentMessage.read ? 'blue' : 'gray', textAlign: 'right', marginRight: 10 }}>
            {currentMessage.read ? '✔✔ Seen' : '✔✔ Sent'}
          </Text>
        )}
        {currentMessage.reaction && (
          <Text style={{
            position: 'absolute',
            bottom: 10,
            right: isSentByCurrentUser ? 10 : 'auto',
            left: isSentByCurrentUser ? 'auto' : 60,
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 5,
            paddingVertical: 2
          }}>
            {currentMessage.reaction}
          </Text>
        )}
      </View>
    );
  };

  const renderMessageImage = (props) => {
    const { currentMessage, previousMessage } = props;
    const isSameUserAsPrevious = previousMessage?.user?._id === currentMessage?.user?._id;

    if (!currentMessage.image) return null;

    let imageGroup = [currentMessage.image];
    let messageRef = previousMessage;

    while (messageRef?.image && messageRef?.user?._id === currentMessage?.user?._id) {
      imageGroup.unshift(messageRef.image);
      messageRef = messageRef.previousMessage;
    }

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
        {imageGroup.map((imageUri, index) => (
          <TouchableOpacity key={index}
            onLongPress={() => {
              console.log("Long pressed image message:", currentMessage);
              setReactionModalVisible(true);
              setSelectedMessage(currentMessage);
            }}
            onPress={() => {
              setSelectedImage([{ uri: imageUri }]);
              setPreviewVisible(true);
            }}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: imageGroup.length > 1 ? 100 : 200,
                height: imageGroup.length > 1 ? 100 : 200,
                borderRadius: 10,
                margin: 2,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderInputToolBar = () => {
    return (
      <View style={styles.searchInputContainer}>
        <TouchableOpacity onPress={choosePhotoFromLibrary}>
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
              onSend([{ _id: uuid.v4(), text: inputText, createdAt: new Date(), user: { _id: route.params.id } }]);
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
            onSend([{ _id: uuid.v4(), text: inputText, createdAt: new Date(), user: { _id: route.params.id } }]);
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

  const handleBackPress = () => {
    navigation.goBack();
  }

  const initials = `${data.firstName?.charAt(0) ?? ''}${data.lastName?.charAt(0) ?? ''}`.toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f5f7' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={images.back} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{data.firstName}  {data.lastName}</Text>
        <TouchableOpacity onPress={() => setOptionModalVisible(true)}>
          <Image source={images.threeDots} style={styles.iconThree} />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
        renderMessage={renderMessage}
        renderInputToolbar={renderInputToolBar}
        isTyping={isOtherUserTyping}
        renderMessageImage={renderMessageImage}
        onLongPress={onLongPressMessage}
        renderMessageAudio={renderMessageAudio}
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
        setOptionModalVisible={setOptionModalVisible}
        optionModalVisible={optionModalVisible}
        deleteAllMessages={deleteAllMessages}
      />
    </View>
  )
}
export default Chat