// import React, { useEffect, useState } from "react";
// import { TouchableOpacity, Text, Image, View } from 'react-native';
// import RNFS from 'react-native-fs';
// import { images } from "../../assets";
// import styles from './style'
// import DottedProgressBar from "./Dotted";

// const Audio = ({
//     messageProps,
//     audioRecorderPlayer,
//     // playingMessageId,
//     // setPlayingMessageId,
//     isSentByCurrentUser
// }) => {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentPosition, setCurrentPosition] = useState(0);
//     const [playingMessageId, setPlayingMessageId] = React.useState(null);
//     const [duration, setDuration] = useState(0);
//     const { currentMessage } = messageProps;

//     const handlePlayPause = async () => {
//         if (!currentMessage.audio) return;

//         try {
//             if (isPlaying) {
//                 // Stop the current playback
//                 console.log("Stopping playback...");
//                 await audioRecorderPlayer.stopPlayer();
//                 audioRecorderPlayer.removePlayBackListener();
//                 setIsPlaying(false);
//                 setPlayingMessageId(null);
//             } else {
//                 // Stop any previously playing audio
//                 console.log("first", playingMessageId, currentMessage._id)
//                 if (playingMessageId && playingMessageId !== currentMessage._id) {
//                     console.log("Stopping previous playback...");
//                     await audioRecorderPlayer.stopPlayer();
//                     audioRecorderPlayer.removePlayBackListener();
//                     // setPlayingMessageId(null);
//                 }

//                 // Write the audio file to a temporary path
//                 const audioPath = `${RNFS.DocumentDirectoryPath}/temp_audio_${currentMessage._id}.mp3`;
//                 await RNFS.writeFile(audioPath, currentMessage.audio, "base64");

//                 // Start playing the new audio
//                 console.log("Starting playback...");
//                 setIsPlaying(true);
//                 setCurrentPosition(0);
//                 setPlayingMessageId(currentMessage._id);
//                 console.log("second", playingMessageId)

//                 await audioRecorderPlayer.startPlayer(audioPath);

//                 // Add a playback listener to handle completion
//                 audioRecorderPlayer.addPlayBackListener((e) => {
//                     setCurrentPosition(e.currentPosition);
//                     setDuration(e.duration);
//                     console.log("Playback progress:", e.currentPosition, "/", e.duration);
//                     if (e.currentPosition >= e.duration) {
//                         console.log("Playback finished.");
//                         audioRecorderPlayer.stopPlayer();
//                         audioRecorderPlayer.removePlayBackListener();
//                         setIsPlaying(false);
//                         setPlayingMessageId(null);
//                         setCurrentPosition(0);
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("Error handling audio:", error);
//             setIsPlaying(false);
//             setPlayingMessageId(null);
//         }
//     };

//     // Reset isPlaying if another audio message is playing
//     useEffect(() => {
//         if (playingMessageId !== currentMessage._id) {
//             setIsPlaying(false);
//         }
//     }, [playingMessageId]);

//     const formatTime = (millis) => {
//         const totalSeconds = Math.floor(millis / 1000);
//         const minutes = Math.floor(totalSeconds / 60);
//         const seconds = totalSeconds % 60;
//         return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//     };

//     return (
//         <View style={[styles.container, { backgroundColor: isSentByCurrentUser ? "#b6c1db" : '' }]}>
//             <TouchableOpacity
//                 style={styles.container1}
//                 onPress={handlePlayPause}
//             >
//                 <Image style={styles.image} source={images.user} />
//                 <Text style={{ fontSize: 18 }}>{isPlaying ? "⏸" : "▶"}</Text>
//                 <View style={styles.progressContainer}>
//                     <DottedProgressBar progress={(currentPosition / duration) * 100 || 0} />
//                     {/* <View style={[styles.progressBar, { width: `${(currentPosition / duration) * 100 || 0}%` }]} /> */}
//                 </View>
//                 {/* <Image style={styles.audio} source={images.audio} /> */}
//             </TouchableOpacity>
//             <Text style={styles.timer}>{formatTime(currentPosition)} / {formatTime(duration)}</Text>
//         </View>

//     );
// };

// export default Audio;

import React, { useEffect, useState, useCallback } from "react";
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { images } from "../../assets";
import styles from './style'
import DottedProgressBar from "./Dotted";

const Audio = ({
    messageProps,
    audioRecorderPlayer,
    playingMessageId,
    setPlayingMessageId,
    isSentByCurrentUser,
    playAudio,
    audioManager,
    stopPlayback,
    onLongPress
}) => {
    const { currentMessage } = messageProps;
    const messageState = audioManager[currentMessage._id] || {
        isPause: true,
        currentPosition: 0,
        duration: 0,
    };

    const { isPause, currentPosition, duration } = messageState;
    const handlePlayPause = useCallback(() => {
        if (playingMessageId === currentMessage._id && !isPause) {
            stopPlayback(currentMessage);
        } else {
            playAudio(currentMessage);
        }
    }, [playingMessageId, currentMessage, isPause, playAudio, stopPlayback]);

    console.log("playing messege id and current meesge id", audioManager)

    const formatTime = (millis) => {
        if (typeof millis !== 'number' || isNaN(millis) || millis < 0) {
            return '0:00'; // Default value for invalid input
        }
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    };

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: isSentByCurrentUser ? "#b6c1db" : '' }]} onLongPress={onLongPress}>
            <TouchableOpacity
                style={styles.container1}
                onPress={handlePlayPause}
                onLongPress={onLongPress}
            >
                <Image style={styles.image} source={images.user} />
                <Text style={{ fontSize: 18 }}>
                    {playingMessageId === currentMessage._id && !isPause ? "⏸" : "▶"}</Text>
                <View style={styles.progressContainer}>
                    <DottedProgressBar progress={(currentPosition / duration) * 100 || 0} />
                </View>
            </TouchableOpacity>
            <Text style={styles.timer}>{formatTime(currentPosition)} / {formatTime(duration)}</Text>
            <Text style={styles.timestamp}>
                {formatTimestamp(currentMessage.createdAt)}
            </Text>
        </TouchableOpacity>
    );
};

export default Audio;
