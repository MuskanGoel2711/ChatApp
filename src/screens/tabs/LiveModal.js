import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { images } from '../../assets';
import { AgoraView, RtcEngine, createAgoraRtcEngine } from 'react-native-agora';

const LiveModal = ({ isVisible, closeModal, navigation }) => {
  // const [isMuted, setIsMuted] = useState(false);
  // const [isStreaming, setIsStreaming] = useState(false);
  // const [participants, setParticipants] = useState([]);
  // const [activeSpeaker, setActiveSpeaker] = useState(null);

  // b1003da446c54363b8d0eeae649e07dd - app id
  // 007eJxTYIgrX3mN+f4c77LW6omfJopMTHmru6HyoXbIz82q8R8s7dcqMCQZGhgYpySamJglm5oYmxknWaQYpKYmppqZWKYamKekMAcdTG8IZGS4zfeQkZEBAkF8HoaS1IqS+OSMxLy81BwGBgCxQiO4 - channel name

  // const APP_ID = 'b1003da446c54363b8d0eeae649e07dd';
  // const CHANNEL_NAME = 'text_channel';
  // const TOKEN = '007eJxTYIgrX3mN+f4c77LW6omfJopMTHmru6HyoXbIz82q8R8s7dcqMCQZGhgYpySamJglm5oYmxknWaQYpKYmppqZWKYamKekMAcdTG8IZGS4zfeQkZEBAkF8HoaS1IqS+OSMxLy81BwGBgCxQiO4';

  // useEffect(() => {
  //   let agoraEngine;

  //   const initAgora = async () => {
  //     try {
  //       const agoraEngine = createAgoraRtcEngine();
  //       await agoraEngine.initialize({ APP_ID });
  //       // engine = await RtcEngine.create(APP_ID);
  //       console.log('Agora engine initialized successfully:', agoraEngine);
  //       agoraEngine.enableAudio();
  //       agoraEngine.setChannelProfile(1);
  //       agoraEngine.setClientRole(1);
  //       agoraEngine.enableAudioVolumeIndication(500, 3, false);
  //     } catch (error) {
  //       console.error('Agora initialization failed:', error);
  //     }
  //   };

  //   initAgora();

  //   return () => {
  //     if (agoraEngine) {
  //       console.log('Destroying Agora engine');
  //       agoraEngine.destroy();
  //     } else {
  //       console.warn('Agora engine was not initialized, cannot destroy');
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const eventHandlers = {
  //     UserJoined: onUserJoined,
  //     UserOffline: onUserLeft,
  //     AudioVolumeIndication: onVolumeIndicator,
  //   };

  //   Object.entries(eventHandlers).forEach(([event, handler]) => {
  //     RtcEngine.on(event, handler);
  //   });

  //   return () => {
  //     Object.entries(eventHandlers).forEach(([event, handler]) => {
  //       RtcEngine.off(event, handler);
  //     });
  //   };
  // }, []);

  // const startStreaming = async () => {
  //   props.navigation;
  //   // try {
  //   //   const agoraEngine = createAgoraRtcEngine();
  //   //   await agoraEngine.joinChannel(TOKEN, CHANNEL_NAME, null, 0);
  //   //   setIsStreaming(true);
  //   // } catch (error) {
  //   //   console.error('Failed to join channel:', error);
  //   // }
  // };

  // const stopStreaming = async () => {
  //   try {
  //     const agoraEngine = createAgoraRtcEngine();
  //     await agoraEngine.leaveChannel();
  //     setIsStreaming(false);
  //     setParticipants([]);
  //     setActiveSpeaker(null);
  //   } catch (error) {
  //     console.error('Failed to leave channel:', error);
  //   }
  // };

  // const toggleMute = () => {
  //   const agoraEngine = createAgoraRtcEngine();
  //   agoraEngine.muteLocalAudioStream(!isMuted);
  //   setIsMuted(!isMuted);
  // };

  // const onUserJoined = (uid) => {
  //   setParticipants((prev) => [...prev, { uid, isSpeaking: false }]);
  // };

  // const onUserLeft = (uid) => {
  //   setParticipants((prev) => prev.filter((user) => user.uid !== uid));
  // };

  // const onVolumeIndicator = (speakers) => {
  //   const activeUid = speakers.find((speaker) => speaker.vad === 1)?.uid;
  //   setActiveSpeaker(activeUid);
  // };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.modalItem} onPress={navigation}>
          <Image source={images.liveSpace} style={styles.modalIcon} />
          <Text style={styles.modalText}>Start a Space</Text>
        </TouchableOpacity>
        {/* {!isStreaming ? (
          <TouchableOpacity style={styles.modalItem} onPress={navigation}>
            <Image source={images.liveSpace} style={styles.modalIcon} />
            <Text style={styles.modalText}>Start a Space</Text>
          </TouchableOpacity>
        ) : 
        (
          <>
            <TouchableOpacity style={styles.modalItem} onPress={toggleMute}>
              <Image
                source={isMuted ? images.micOff : images.micOn}
                style={styles.modalIcon}
              />
              <Text style={styles.modalText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={stopStreaming}>
              <Image source={images.stop} style={styles.modalIcon} />
              <Text style={styles.modalText}>Stop Streaming</Text>
            </TouchableOpacity>
          </>
        )
        } */}
        <TouchableOpacity style={styles.modalItem}>
          <Image source={images.liveStream} style={styles.modalIcon} />
          <Text style={styles.modalText}>Start a live stream</Text>
        </TouchableOpacity>
        {/* <FlatList
          data={participants}
          keyExtractor={(item) => item.uid.toString()}
          renderItem={({ item }) => (
            <View style={styles.participantItem}>
              <Text style={styles.participantText}>User {item.uid}</Text>
              {activeSpeaker === item.uid && (
                <Text style={styles.speakerText}>Speaking</Text>
              )}
            </View>
          )}
        /> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  modalText: {
    fontSize: 18,
    color: 'black',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  participantText: {
    fontSize: 16,
    color: 'black',
  },
  speakerText: {
    fontSize: 14,
    color: 'green',
  },
});

export default LiveModal;