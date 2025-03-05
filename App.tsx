import React from 'react';
// import HomeScreen from './src/components/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NativeStack from './src/navigation';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Task Manager' }} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <NativeStack />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import YoutubePlayer from './src/components/YoutubePlayer';

// const App = () => {
//   const videos = [
//     { id: 'dQw4w9WgXcQ', title: 'Video 1' },
//     { id: '9bZkp7q19f0', title: 'Video 2' },
//     { id: 'kJQP7kiw5Fk', title: 'Video 3' },
//   ];

//   const handleVideoChange = (id: string) => {
//     console.log('Currently playing video ID:', id);
//   };

//   return (
//     <View style={styles.container}>
//       <YoutubePlayer
//         videos={videos}
//         initialVideoId={videos[0].id}
//         onVideoChange={handleVideoChange} 
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });

// export default App;
