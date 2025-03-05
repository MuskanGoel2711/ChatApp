// import React, { useRef, useState, useEffect } from 'react';
// import { RadioButton } from 'react-native-paper';
// import {
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     AppState,
//     Image,
//     Alert
// } from 'react-native';
// import { PermissionsAndroid, Platform } from 'react-native';
// import {
//     createAgoraRtcEngine,
//     ChannelProfileType,
//     ClientRoleType,
//     IRtcEngine,
//     IRtcEngineEventHandler,
//     AudienceLatencyLevelType,
//     AudioProfileType,
//     AudioScenarioType,
//     VideoSourceType,
// } from 'react-native-agora';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { images } from '../../assets';
// import { vh, vw } from '../../utils/Dimensions';
// import CustomButton from '../../components/CustomButton';

// const appId = 'b1003da446c54363b8d0eeae649e07dd';
// const channelName = 'text_channel';
// const token = '007eJxTYDBP4nj6wZrnc1kR48+yFn0Rkz11PW/yHxe7t70TetzLkq3AkGRoYGCckmhiYpZsamJsZpxkkWKQmpqYamZimWpgnpKirnEkvSGQkcF6RzcLIwMEgvg8DCWpFSXxyRmJeXmpOQwMABvoIfo=';
// const localUid = 0;

// const App = ({ navigation }) => {
//     const insets = useSafeAreaInsets();
//     const agoraEngineRef = useRef<IRtcEngine>();
//     const [isJoined, setIsJoined] = useState(false);
//     const [isHost, setIsHost] = useState(true);
//     const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
//     const [muted, setMuted] = useState(false);
//     const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
//     const [isScreenSharing, setIsScreenSharing] = useState(false);
//     const [userRoles, setUserRoles] = useState<{ [uid: number]: 'host' | 'audience' }>({});
//     const eventHandler = useRef<IRtcEngineEventHandler>();

//     useEffect(() => {
//         const init = async () => {
//             await setupAudioSDKEngine();
//             setupEventHandler();
//         };
//         init();

//         const appStateListener = AppState.addEventListener('change', handleAppStateChange);
//         return () => {
//             appStateListener.remove();
//             cleanupAgoraEngine();
//         };
//     }, []);

//     const setupEventHandler = () => {
//         eventHandler.current = {
//             onJoinChannelSuccess: () => {
//                 setIsJoined(true);
//             },
//             onUserJoined: (_, uid) => {
//                 console.log(`User ${uid} joined`);

//                 setRemoteUsers(prevUsers => {
//                     if (!prevUsers.includes(uid)) {
//                         return [...prevUsers, uid];
//                     }
//                     return prevUsers;
//                 });
//                 setUserRoles(prevRoles => ({
//                     ...prevRoles,
//                     [uid]: isHost ? 'host' : 'audience',
//                 }));
//                 // setUserRoles(prevRoles => ({
//                 //     ...prevRoles,
//                 //     [uid]: 'audience', // Default role for remote users
//                 // }));
//             },
//             onUserOffline: (_, uid) => {
//                 console.log(`User ${uid} left the channel`);
//                 setRemoteUsers(prevUsers => prevUsers.filter(user => user !== uid));
//                 setUserRoles(prevRoles => {
//                     const newRoles = { ...prevRoles };
//                     delete newRoles[uid];
//                     return newRoles;
//                 })
//             },
//             onActiveSpeaker: (_, uid) => {
//                 setActiveSpeaker(uid);
//             },
//         };
//         agoraEngineRef.current?.registerEventHandler(eventHandler.current);
//     };

//     const setupAudioSDKEngine = async () => {
//         try {
//             if (Platform.OS === 'android') await getPermission();
//             agoraEngineRef.current = createAgoraRtcEngine();
//             const agoraEngine = agoraEngineRef.current;
//             await agoraEngine.initialize({ appId });
//             agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
//             agoraEngine.setAudioProfile(
//                 AudioProfileType.AudioProfileSpeechStandard,
//                 AudioScenarioType.AudioScenarioGameStreaming
//             );
//             // agoraEngine.enableInEarMonitoring(true);
//             agoraEngine.enableAudioVolumeIndication(200, 3, false);
//         } catch (e) {
//             console.error(e);
//         }
//     };

//     const join = async () => {
//         if (isJoined) {
//             console.log("already joined")
//             return;
//         }
//         try {
//             console.log("joined the channel")
//             await agoraEngineRef.current?.joinChannel(token, channelName, localUid, {
//                 channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
//                 clientRoleType: isHost ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience,
//                 publishMicrophoneTrack: isHost,
//                 autoSubscribeAudio: true,
//                 // audienceLatencyLevel: AudienceLatencyLevelType.audienceLatencyLevelUltraLowLatency,
//             });
//             if (isHost) {
//                 agoraEngineRef.current?.muteLocalAudioStream(false); // Ensure microphone is active
//             }
//             Alert.alert('Success', 'User joined the channel');
//             setIsJoined(true);
//             console.log("joined", isJoined)
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const leave = () => {
//         console.log("leaving the channel")
//         agoraEngineRef.current?.leaveChannel();
//         setRemoteUsers([]);
//         setIsJoined(false);
//         setUserRoles({});
//         Alert.alert('Success', 'User left the channel');
//     };

//     const toggleMute = () => {
//         setMuted(!muted);
//         agoraEngineRef.current?.muteLocalAudioStream(!muted);
//     };

//     const startScreenSharing = async () => {
//         if (isScreenSharing) return;

//         try {
//             console.log("Starting screen sharing...");

//             await agoraEngineRef.current?.startScreenCapture({
//                 type: VideoSourceType.VideoSourceScreen, // Use screen capture as the source
//                 captureParams: {
//                     dimensions: { width: 1280, height: 720 }, // Adjust for better performance
//                     frameRate: 15, // Lower frame rate to optimize performance
//                     bitrate: 1130,
//                     captureMouseCursor: true,
//                     windowFocus: true,
//                 },
//             });

//             setIsScreenSharing(true);
//             console.log("Screen sharing started successfully");
//         } catch (e) {
//             console.error("Failed to start screen sharing:", e);
//         }
//     };

//     const stopScreenSharing = async () => {
//         if (!isScreenSharing) return;

//         try {
//             console.log("Stopping screen sharing...");
//             await agoraEngineRef.current?.stopScreenCapture();
//             setIsScreenSharing(false);
//             console.log("Screen sharing stopped successfully");
//         } catch (e) {
//             console.error("Failed to stop screen sharing:", e);
//         }
//     };

//     const handleAppStateChange = (nextAppState: string) => {
//         if (nextAppState === 'background') {
//             agoraEngineRef.current?.enableAudio();
//         }
//     };

//     const cleanupAgoraEngine = () => {
//         agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
//         agoraEngineRef.current?.release();
//     };

//     // const allowAudienceToSpeak = (uid: number) => {
//     //     if (!isHost) return; // Only the host can grant permission to speak
//     //     agoraEngineRef.current?.setClientRole(ClientRoleType.ClientRoleBroadcaster, uid);
//     //     setUserRoles(prevRoles => ({ ...prevRoles, [uid]: 'host' }));
//     //     console.log(`User ${uid} is now allowed to speak`);
//     // };

//     const muteAudienceMember = (uid: number, mute: boolean) => {
//         if (!isHost) return; // Only host can control this
//         agoraEngineRef.current?.muteRemoteAudioStream(uid, mute);
//         console.log(`User ${uid} has been ${mute ? 'muted' : 'unmuted'}`);
//     };


//     const handleBackPress = () => {
//         navigation.goBack();
//     }

//     return (
//         <SafeAreaView style={[styles.main, { paddingTop: insets.top }]}>
//             <TouchableOpacity onPress={handleBackPress}>
//                 <Image source={images.back} style={styles.icon} />
//             </TouchableOpacity>
//             <Text style={styles.head}>Audio Live Streaming</Text>
//             <View style={styles.btnContainer}>
//                 <TouchableOpacity onPress={join} style={styles.button}><Text>Join</Text></TouchableOpacity>
//                 <TouchableOpacity onPress={leave} style={styles.button}><Text>Leave</Text></TouchableOpacity>
//                 <TouchableOpacity onPress={toggleMute} style={styles.button}>
//                     <Text>{muted ? 'Unmute' : 'Mute'}</Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.radioContainer}>
//                 <RadioButton.Group
//                     onValueChange={(value) => {
//                         setIsHost(value === 'host');
//                         if (isJoined) leave();
//                     }}
//                     value={isHost ? 'host' : 'audience'}
//                 >
//                     <View style={styles.radioItem}>
//                         <RadioButton value="audience" />
//                         <Text>Audience</Text>
//                     </View>
//                     <View style={styles.radioItem}>
//                         <RadioButton value="host" />
//                         <Text>Host</Text>
//                     </View>
//                 </RadioButton.Group>
//             </View>
//             {isHost && (
//                 <View style={styles.btnContainer}>
//                     <TouchableOpacity onPress={startScreenSharing} style={styles.button}>
//                         <Text>Start Screen Sharing</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={stopScreenSharing} style={styles.button}>
//                         <Text>Stop Screen Sharing</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//             <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
//                 <Text>Active Speaker: {activeSpeaker || 'None'}</Text>
//                 <Text>Remote Users:</Text>
//                 {remoteUsers.length > 0 && (
//                     <View>
//                         {remoteUsers.map(uid => (
//                             <View key={uid} style={styles.userContainer}>
//                                 <Image source={images.user} style={styles.icon} />
//                                 <Text style={activeSpeaker === uid ? styles.activeUser : styles.user}>
//                                     {uid} ({userRoles[uid] || 'unknown'})
//                                 </Text>
//                                 {isHost && userRoles[uid] === 'audience' && (
//                                     <View style={styles.btnContainer}>
//                                         <TouchableOpacity onPress={() => muteAudienceMember(uid, true)} style={styles.button}>
//                                             <Text>Mute</Text>
//                                         </TouchableOpacity>
//                                         <TouchableOpacity onPress={() => muteAudienceMember(uid, false)} style={styles.button}>
//                                             <Text>Unmute</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 )}
//                             </View>
//                         ))}
//                     </View>
//                 )}
//             </ScrollView>


//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     button: { padding: 10, backgroundColor: '#0055cc', margin: 5, borderRadius: 10 },
//     main: { flex: 1, padding: 15 },
//     icon: {
//         width: vw(35),
//         height: vh(35),
//         tintColor: 'black'
//     },
//     radioContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
//     radioItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
//     scroll: { flex: 1, width: '100%' },
//     scrollContainer: { padding: 20 },
//     btnContainer: { flexDirection: 'row', justifyContent: 'center' },
//     head: { fontSize: 20 },
//     user: { padding: 5 },
//     activeUser: { padding: 5, fontWeight: 'bold', color: 'red' },
// });

// const getPermission = async () => {
//     if (Platform.OS === 'android') {
//         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
//         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
//         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
//     }
// };

// export default App;

// import React, { useRef, useState, useEffect } from 'react';
// import { RadioButton } from 'react-native-paper';
// import {
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     AppState,
//     Image,
//     Alert,
// } from 'react-native';
// import { PermissionsAndroid, Platform } from 'react-native';
// import {
//     createAgoraRtcEngine,
//     ChannelProfileType,
//     ClientRoleType,
//     IRtcEngine,
//     IRtcEngineEventHandler,
//     AudioProfileType,
//     AudioScenarioType,
//     VideoSourceType,
//     RtcSurfaceView,
// } from 'react-native-agora';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { images } from '../../assets';
// import { vh, vw } from '../../utils/Dimensions';

// const appId = 'b1003da446c54363b8d0eeae649e07dd'; // Replace with your App ID
// const channelName = 'text_channel'; // Replace with your channel name
// const token = '007eJxTYLh8fcGLLb/dXsgKPlTKNVQSMez7EnTDqJ7hmY6Rs9vEXBUFhiRDAwPjlEQTE7NkUxNjM+MkixSD1NTEVDMTy1QD85SUpWFH0xsCGRmeu7gyMEIhiM/DUJJaURKfnJGYl5eaw8AAACvkIgA='; // Replace with your token
// const localUid = 0;

// const App = ({ navigation }) => {
//     const insets = useSafeAreaInsets();
//     const agoraEngineRef = useRef<IRtcEngine>();
//     const [isJoined, setIsJoined] = useState(false);
//     const [isHost, setIsHost] = useState(true);
//     const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
//     const [muted, setMuted] = useState(false);
//     const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
//     const [isScreenSharing, setIsScreenSharing] = useState(false);
//     const [userRoles, setUserRoles] = useState<{ [uid: number]: 'host' | 'audience' }>({});
//     const eventHandler = useRef<IRtcEngineEventHandler>();

//     useEffect(() => {
//         const init = async () => {
//             await setupVideoSDKEngine();
//             setupEventHandler();
//         };
//         init();

//         const appStateListener = AppState.addEventListener('change', handleAppStateChange);
//         return () => {
//             appStateListener.remove();
//             cleanupAgoraEngine();
//         };
//     }, []);

//     const setupEventHandler = () => {
//         eventHandler.current = {
//             onJoinChannelSuccess: () => {
//                 console.log('Joined channel successfully');
//                 setIsJoined(true);
//             },
//             onUserJoined: (_, uid) => {
//                 console.log(`User ${uid} joined`);
//                 setRemoteUsers(prevUsers => {
//                     if (!prevUsers.includes(uid)) {
//                         return [...prevUsers, uid];
//                     }
//                     return prevUsers;
//                 });
//                 setUserRoles(prevRoles => ({
//                     ...prevRoles,
//                     [uid]: isHost ? 'host' : 'audience',
//                 }));
//             },
//             onUserOffline: (_, uid) => {
//                 console.log(`User ${uid} left the channel`);
//                 setRemoteUsers(prevUsers => prevUsers.filter(user => user !== uid));
//                 setUserRoles(prevRoles => {
//                     const newRoles = { ...prevRoles };
//                     delete newRoles[uid];
//                     return newRoles;
//                 });
//             },
//             onActiveSpeaker: (_, uid) => {
//                 console.log(`Active speaker: ${uid}`);
//                 setActiveSpeaker(uid);
//             },
//         };
//         agoraEngineRef.current?.registerEventHandler(eventHandler.current);
//     };

//     const setupVideoSDKEngine = async () => {
//         try {
//             if (Platform.OS === 'android') await getPermission();
//             agoraEngineRef.current = createAgoraRtcEngine();
//             const agoraEngine = agoraEngineRef.current;
//             await agoraEngine.initialize({ appId });
//             console.log('Agora engine initialized');

//             agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
//             agoraEngine.setAudioProfile(
//                 AudioProfileType.AudioProfileSpeechStandard,
//                 AudioScenarioType.AudioScenarioGameStreaming
//             );
//             agoraEngine.enableVideo();
//             agoraEngine.enableAudioVolumeIndication(200, 3, false);
//             console.log('Video and audio enabled');
//         } catch (e) {
//             console.error('Error setting up Agora engine:', e);
//         }
//     };

//     const join = async () => {
//         if (isJoined) {
//             console.log('Already joined');
//             return;
//         }
//         try {
//             console.log('Joining channel...');
//             await agoraEngineRef.current?.joinChannel(token, channelName, localUid, {
//                 channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
//                 clientRoleType: isHost ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience,
//                 publishMicrophoneTrack: isHost,
//                 publishCameraTrack: isHost,
//                 autoSubscribeAudio: true,
//                 autoSubscribeVideo: true,
//             });
//             if (isHost) {
//                 agoraEngineRef.current?.muteLocalAudioStream(false);
//                 agoraEngineRef.current?.startPreview();
//                 console.log('Local preview started');
//             }
//             Alert.alert('Success', 'User joined the channel');
//             setIsJoined(true);
//             console.log('Joined channel successfully');
//         } catch (e) {
//             console.error('Error joining channel:', e);
//         }
//     };

//     const leave = () => {
//         console.log('Leaving channel...');
//         agoraEngineRef.current?.leaveChannel();
//         setRemoteUsers([]);
//         setIsJoined(false);
//         setUserRoles({});
//         Alert.alert('Success', 'User left the channel');
//         console.log('Left channel successfully');
//     };

//     const toggleMute = () => {
//         setMuted(!muted);
//         agoraEngineRef.current?.muteLocalAudioStream(!muted);
//         console.log(`Local audio ${muted ? 'muted' : 'unmuted'}`);
//     };

//     const startScreenSharing = async () => {
//                 if (isScreenSharing) return;

//                 try {
//                     console.log("Starting screen sharing...");

//                     await agoraEngineRef.current?.startScreenCapture({
//                         type: VideoSourceType.VideoSourceScreen, // Use screen capture as the source
//                         captureParams: {
//                             dimensions: { width: 1280, height: 720 }, // Adjust for better performance
//                             frameRate: 15, // Lower frame rate to optimize performance
//                             bitrate: 1130,
//                             captureMouseCursor: true,
//                             windowFocus: true,
//                         },
//                     });

//                     setIsScreenSharing(true);
//                     console.log("Screen sharing started successfully");
//                 } catch (e) {
//                     console.error("Failed to start screen sharing:", e);
//                 }
//             };

//             const stopScreenSharing = async () => {
//                 if (!isScreenSharing) return;

//                 try {
//                     console.log("Stopping screen sharing...");
//                     await agoraEngineRef.current?.stopScreenCapture();
//                     setIsScreenSharing(false);
//                     console.log("Screen sharing stopped successfully");
//                 } catch (e) {
//                     console.error("Failed to stop screen sharing:", e);
//                 }
//             };

//     const handleAppStateChange = (nextAppState: string) => {
//         if (nextAppState === 'background') {
//             agoraEngineRef.current?.enableAudio();
//         }
//     };

//     const cleanupAgoraEngine = () => {
//         agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
//         agoraEngineRef.current?.release();
//         console.log('Agora engine cleaned up');
//     };

//     const handleBackPress = () => {
//         navigation.goBack();
//     };

//     return (
//         <SafeAreaView style={[styles.main, { paddingTop: insets.top }]}>
//             <TouchableOpacity onPress={handleBackPress}>
//                 <Image source={images.back} style={styles.icon} />
//             </TouchableOpacity>
//             <Text style={styles.head}>Video Live Streaming</Text>
//             <View style={styles.btnContainer}>
//                 <TouchableOpacity onPress={join} style={styles.button}>
//                     <Text>Join</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={leave} style={styles.button}>
//                     <Text>Leave</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={toggleMute} style={styles.button}>
//                     <Text>{muted ? 'Unmute' : 'Mute'}</Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.radioContainer}>
//                  <RadioButton.Group
//                     onValueChange={(value) => {
//                         setIsHost(value === 'host');
//                         if (isJoined) leave();
//                     }}
//                     value={isHost ? 'host' : 'audience'}
//                 >
//                     <View style={styles.radioItem}>
//                         <RadioButton value="audience" />
//                         <Text>Audience</Text>
//                     </View>
//                     <View style={styles.radioItem}>
//                         <RadioButton value="host" />
//                         <Text>Host</Text>
//                     </View>
//                 </RadioButton.Group>
//             </View>
//             {isHost && (
//                 <View style={styles.btnContainer}>
//                     <TouchableOpacity onPress={startScreenSharing} style={styles.button}>
//                         <Text>Start Screen Sharing</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={stopScreenSharing} style={styles.button}>
//                         <Text>Stop Screen Sharing</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//             <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
//                 <Text>Active Speaker: {activeSpeaker || 'None'}</Text>
//                 <Text>Remote Users:</Text>
//                 {remoteUsers.map(uid => (
//                     <View key={uid} style={styles.userContainer}>
//                         <RtcSurfaceView
//                             style={styles.videoView}
//                             canvas={{ uid, renderMode: 'hidden' }}
//                         />
//                         <Text style={activeSpeaker === uid ? styles.activeUser : styles.user}>
//                             {uid} ({userRoles[uid] || 'unknown'})
//                         </Text>
//                     </View>
//                 ))}
//             </ScrollView>
//             {isHost && (
//                 <RtcSurfaceView
//                     style={styles.localVideoView}
//                     canvas={{ uid: 0, renderMode: 'hidden' }}
//                 />
//             )}
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     button: { padding: 10, backgroundColor: '#0055cc', margin: 5, borderRadius: 10 },
//     main: { flex: 1, padding: 15 },
//     icon: { width: vw(35), height: vh(35), tintColor: 'black' },
//     scroll: { flex: 1, width: '100%' },
//     scrollContainer: { padding: 20 },
//     radioContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
//     radioItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
//     btnContainer: { flexDirection: 'row', justifyContent: 'center' },
//     head: { fontSize: 20 },
//     user: { padding: 5 },
//     activeUser: { padding: 5, fontWeight: 'bold', color: 'red' },
//     videoView: { width: vw(100), height: vh(100) },
//     localVideoView: { width: vw(100), height: vh(100), position: 'absolute', bottom: 10, right: 10 },
// });

// const getPermission = async () => {
//     if (Platform.OS === 'android') {
//         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
//         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
//         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
//     }
// };

// export default App;

import React, { useRef, useState, useEffect } from 'react';
import { RadioButton } from 'react-native-paper';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    AppState,
    Image,
    Alert,
} from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    IRtcEngine,
    IRtcEngineEventHandler,
    AudioProfileType,
    AudioScenarioType,
    VideoSourceType,
    RtcSurfaceView,
    RenderModeType
} from 'react-native-agora';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets';
import { vh, vw } from '../../utils/Dimensions';

const appId = 'b1003da446c54363b8d0eeae649e07dd'; // Replace with your App ID
const channelName = 'text_channel'; // Replace with your channel name
const token = '007eJxTYFhbyr9//gt/pxWJaz3bJ2qvqDAReR75YbmGPsurC/OPOlxQYEgyNDAwTkk0MTFLNjUxNjNOskgxSE1NTDUzsUw1ME9JyTx/LL0hkJHB4NIcBkYoBPF5GEpSK0rikzMS8/JScxgYAJfaI+0=';
const localUid = 0;

const App = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const agoraEngineRef = useRef<IRtcEngine>();
    const [isJoined, setIsJoined] = useState(false);
    const [isHost, setIsHost] = useState(true);
    const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
    const [muted, setMuted] = useState(false);
    const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [userRoles, setUserRoles] = useState<{ [uid: number]: 'host' | 'audience' }>({});
    const eventHandler = useRef<IRtcEngineEventHandler>();

    useEffect(() => {
        const init = async () => {
            await setupVideoSDKEngine();
            setupEventHandler();
        };
        init();

        const appStateListener = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            appStateListener.remove();
            cleanupAgoraEngine();
        };
    }, []);

    const setupEventHandler = () => {
        eventHandler.current = {
            onJoinChannelSuccess: () => {
                console.log('Joined channel successfully');
                setIsJoined(true);
            },
            onUserJoined: (_, uid) => {
                console.log(`User ${uid} joined`);
                setRemoteUsers(prevUsers => {
                    if (!prevUsers.includes(uid)) {
                        return [...prevUsers, uid];
                    }
                    return prevUsers;
                });
                setUserRoles(prevRoles => ({
                    ...prevRoles,
                    [uid]: isHost ? 'host' : 'audience',
                }));
                if (uid >= 100000) { // Adjust this based on your Agora settings
                    console.log(`User ${uid} is sharing screen`);
                    setIsScreenSharing(true);
                }
            },
            onUserOffline: (_, uid) => {
                console.log(`User ${uid} left the channel`);
                setRemoteUsers(prevUsers => prevUsers.filter(user => user !== uid));
                setUserRoles(prevRoles => {
                    const newRoles = { ...prevRoles };
                    delete newRoles[uid];
                    return newRoles;
                });
                if (uid === activeSpeaker) {
                    setActiveSpeaker(null);
                }
                if (isScreenSharing && remoteUsers.length === 0) {
                    setIsScreenSharing(false);
                }
            },
            onActiveSpeaker: (_, uid) => {
                console.log(`Active speaker: ${uid}`);
                setActiveSpeaker(uid);
            },
        };
        agoraEngineRef.current?.registerEventHandler(eventHandler.current);
    };

    const setupVideoSDKEngine = async () => {
        try {
            if (Platform.OS === 'android') await getPermission();
            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;
            await agoraEngine.initialize({ appId });
            console.log('Agora engine initialized');

            agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
            agoraEngine.setAudioProfile(
                AudioProfileType.AudioProfileSpeechStandard,
                AudioScenarioType.AudioScenarioGameStreaming
            );
            agoraEngine.enableVideo();
            agoraEngine.enableAudioVolumeIndication(200, 3, false);
            console.log('Video and audio enabled');
        } catch (e) {
            console.error('Error setting up Agora engine:', e);
        }
    };

    const join = async () => {
        if (isJoined) {
            console.log('Already joined');
            return;
        }
        try {
            console.log('Joining channel...');
            await agoraEngineRef.current?.joinChannel(token, channelName, localUid, {
                channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
                clientRoleType: isHost ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience,
                publishMicrophoneTrack: isHost,
                publishCameraTrack: isHost,
                autoSubscribeAudio: true,
                autoSubscribeVideo: true,
            });
            if (isHost) {
                agoraEngineRef.current?.muteLocalAudioStream(false);
                agoraEngineRef.current?.startPreview();
                console.log('Local preview started');
            }
            Alert.alert('Success', 'User joined the channel');
            setIsJoined(true);
            console.log('Joined channel successfully');
        } catch (e) {
            console.error('Error joining channel:', e);
        }
    };

    const leave = () => {
        console.log('Leaving channel...');
        agoraEngineRef.current?.leaveChannel();
        setRemoteUsers([]);
        setIsJoined(false);
        setUserRoles({});
        Alert.alert('Success', 'User left the channel');
        console.log('Left channel successfully');
    };

    const toggleMute = () => {
        setMuted(!muted);
        agoraEngineRef.current?.muteLocalAudioStream(!muted);
        console.log(`Local audio ${muted ? 'muted' : 'unmuted'}`);
    };

    // const startScreenSharing = async () => {
    //     if (isScreenSharing) return;

    //     try {
    //         if (Platform.OS === 'android') {
    //             console.log("Starting screen sharing on Android...");

    //             // Use startScreenCapture instead of getScreenCaptureDisplayId
    //             await agoraEngineRef.current?.startScreenCapture({
    //                 type: VideoSourceType.VideoSourceScreen,
    //                 captureParams: {
    //                     dimensions: { width: 1280, height: 720 },
    //                     frameRate: 15,
    //                     bitrate: 1130,
    //                 },
    //             });

    //             console.log("Screen sharing started successfully on Android.");
    //         } else {
    //             console.log("Starting screen sharing on iOS...");

    //             await agoraEngineRef.current?.startScreenCapture({
    //                 type: VideoSourceType.VideoSourceScreen,
    //                 captureParams: {
    //                     dimensions: { width: 1280, height: 720 },
    //                     frameRate: 15,
    //                     bitrate: 1130,
    //                     captureMouseCursor: true,
    //                     windowFocus: true,
    //                 },
    //             });

    //             console.log("Screen sharing started successfully on iOS.");
    //         }

    //         setIsScreenSharing(true);
    //     } catch (e) {
    //         console.error("Failed to start screen sharing:", e);
    //     }
    // };

    const startScreenSharing = async () => {
        if (isScreenSharing) return;

        try {
            if (Platform.OS === 'android') {
                console.log("Starting screen sharing on Android...");

                // Define screen capture region
                const screenRect = { x: 0, y: 0, width: 1280, height: 720 };
                const regionRect = { x: 0, y: 0, width: 1280, height: 720 };

                // Define capture parameters
                const captureParams = {
                    frameRate: 15,
                    bitrate: 1130,
                };

                await agoraEngineRef.current?.startScreenCaptureByScreenRect(screenRect, regionRect, captureParams);

                console.log("Screen sharing started successfully on Android.");
            } else {
                console.log("Starting screen sharing on iOS...");

                const displayId = 0; // Default main screen display ID
                await agoraEngineRef.current?.startScreenCaptureByDisplayId(
                    displayId,
                    { x: 0, y: 0, width: 1280, height: 720 }, // Screen region
                    {
                        frameRate: 15,
                        bitrate: 1130,
                        captureMouseCursor: true,
                        windowFocus: true,
                    } // Capture parameters
                );

                console.log("Screen sharing started successfully on iOS.");
            }

            setIsScreenSharing(true);
        } catch (e) {
            console.error("Failed to start screen sharing:", e);
        }
    };

    const stopScreenSharing = async () => {
        if (!isScreenSharing) return;

        try {
            console.log("Stopping screen sharing...");
            if (Platform.OS === 'android') {
                await agoraEngineRef.current?.stopScreenCapture();
            } else {
                await agoraEngineRef.current?.stopScreenCapture();
            }
            setIsScreenSharing(false);
            console.log("Screen sharing stopped successfully.");
        } catch (e) {
            console.error("Failed to stop screen sharing:", e);
        }
    };

    const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'background') {
            agoraEngineRef.current?.enableAudio();
        }
    };

    const cleanupAgoraEngine = () => {
        agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
        agoraEngineRef.current?.release();
        console.log('Agora engine cleaned up');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.main, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={handleBackPress}>
                <Image source={images.back} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.head}>Video Live Streaming</Text>
            <View style={styles.btnContainer}>
                <TouchableOpacity onPress={join} style={styles.button}>
                    <Text>Join</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={leave} style={styles.button}>
                    <Text>Leave</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMute} style={styles.button}>
                    <Text>{muted ? 'Unmute' : 'Mute'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.radioContainer}>
                <RadioButton.Group
                    onValueChange={(value) => {
                        setIsHost(value === 'host');
                        if (isJoined) leave();
                    }}
                    value={isHost ? 'host' : 'audience'}
                >
                    <View style={styles.radioItem}>
                        <RadioButton value="audience" />
                        <Text>Audience</Text>
                    </View>
                    <View style={styles.radioItem}>
                        <RadioButton value="host" />
                        <Text>Host</Text>
                    </View>
                </RadioButton.Group>
            </View>
            {isHost && (
                <View style={styles.btnContainer}>
                    <TouchableOpacity onPress={startScreenSharing} style={styles.button}>
                        <Text>Start Screen Sharing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={stopScreenSharing} style={styles.button}>
                        <Text>Stop Screen Sharing</Text>
                    </TouchableOpacity>
                </View>
            )}
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                <Text>Active Speaker: {activeSpeaker || 'None'}</Text>
                <Text>Remote Users:</Text>
                {remoteUsers.map(uid => (
                    <View key={uid} style={styles.userContainer}>
                        <RtcSurfaceView
                            style={styles.videoView}
                            canvas={{ uid, renderMode: RenderModeType.RenderModeFit }}
                        />
                        <Text style={activeSpeaker === uid ? styles.activeUser : styles.user}>
                            {uid} ({userRoles[uid] || 'unknown'})
                        </Text>
                    </View>
                ))}
            </ScrollView>
            {isScreenSharing && (
                <View style={styles.userContainer}>
                    <RtcSurfaceView
                        style={styles.videoView}
                        canvas={{ uid: localUid, renderMode: RenderModeType.RenderModeFit }}
                    />
                    <Text style={styles.user}>Screen Sharing (Host)</Text>
                </View>
            )}
            {isHost && (
                <RtcSurfaceView
                    style={styles.localVideoView}
                    canvas={{ uid: 0, renderMode: RenderModeType.RenderModeFit }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button: { padding: 10, backgroundColor: '#0055cc', margin: 5, borderRadius: 10 },
    main: { flex: 1, padding: 15 },
    icon: { width: vw(35), height: vh(35), tintColor: 'black' },
    scroll: { flex: 1, width: '100%' },
    scrollContainer: { padding: 20 },
    radioContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    radioItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
    btnContainer: { flexDirection: 'row', justifyContent: 'center' },
    head: { fontSize: 20 },
    user: { padding: 5 },
    activeUser: { padding: 5, fontWeight: 'bold', color: 'red' },
    videoView: { width: vw(100), height: vh(100) },
    localVideoView: { width: vw(100), height: vh(100), position: 'absolute', bottom: 10, right: 10 },
});

const getPermission = async () => {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    }
};

export default App;