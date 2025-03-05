import React from 'react';
import HomeScreen from '../screens/HomeScreen/index';
import Chat from '../screens/Chat/index';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../screens/SignUp';
import Login from '../screens/Login';
import Splash from '../screens/Splash';
import Users from '../screens/tabs/Users';
import GroupChat from '../screens/GroupChat';
import Groups from '../screens/Groups';
import CreateGroup from '../screens/CreateGroup';
import ForgotPassword from '../screens/ForgotPassword';
import VerifyOtp from '../screens/VerifyOtp';
import Members from '../screens/Members';
import AddMembers from '../screens/AddMembers';
import LiveSpaceSetupScreen from '../screens/tabs/LiveSpaceSetUpScreen';
import LiveSpaceScreen from '../screens/tabs/LiveSpaceScreen';

const Stack = createNativeStackNavigator();

const NativeStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* <Stack.Screen name="Chat" component={Chat} options={{ gestureEnabled: false }} /> */}
                <Stack.Screen name="Splash" component={Splash} options={{ gestureEnabled: false }} />
                <Stack.Screen name="Login" component={Login} options={{ gestureEnabled: false }} />
                <Stack.Screen name="SignUp" component={SignUp} options={{ gestureEnabled: false }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="Chat" component={Chat} options={{ gestureEnabled: false }} />
                <Stack.Screen name="Users" component={Users} options={{ gestureEnabled: false }} />
                <Stack.Screen name="GroupChat" component={GroupChat} options={{ gestureEnabled: false }} />
                <Stack.Screen name="Groups" component={Groups} options={{ gestureEnabled: false }} />
                <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ gestureEnabled: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ gestureEnabled: false }} />
                <Stack.Screen name="VerifyOtp" component={VerifyOtp} options={{ gestureEnabled: false }} />
                <Stack.Screen name="Members" component={Members} options={{ gestureEnabled: false }} />
                <Stack.Screen name="AddMembers" component={AddMembers} options={{ gestureEnabled: false }} />
                <Stack.Screen name="LiveSpaceSetUpScreen" component={LiveSpaceSetupScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="LiveSpace" component={LiveSpaceScreen} options={{ gestureEnabled: false }} />
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NativeStack;