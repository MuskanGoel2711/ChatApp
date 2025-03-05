import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');

interface VideoItem {
  id: string;
  title: string;
}

interface YoutubePlayerProps {
  videos: VideoItem[];
  initialVideoId?: string;
  onVideoChange?: (videoId: string) => void;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ videos, initialVideoId, onVideoChange }) => {
  const [currentVideoId, setCurrentVideoId] = useState<string>(initialVideoId || videos[0]?.id);
  const playerRef = useRef(null);

  const handlePlayback = (event: string) => {
    if (event === 'playing') {
      console.log('Video is playing');
    } else if (event === 'paused') {
      console.log('Video is paused');
    }
  };

  const handleError = (error: any) => {
    console.error('Error occurred:', error);
  };

  const handleVideoSelect = (id: string) => {
    setCurrentVideoId(id);
    onVideoChange?.(id);
  };

  const renderItem = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleVideoSelect(item.id)}
    >
      <Text style={styles.videoTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <YoutubeIframe
        ref={playerRef}
        height={300}
        width={width}
        videoId={currentVideoId}
        play={true}
        onChangeState={handlePlayback}
        onError={handleError}
      />
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={false}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  videoItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 16,
  },
});

export default YoutubePlayer;
