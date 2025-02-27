import { View, Text, StyleSheet, SafeAreaView} from 'react-native'
import React, { useState } from 'react'
import CustomImage from '../../components/CustomArrow';
import { images } from '../../assets';
import Users from '../tabs/Users';
import Setting from '../tabs/Setting';
import CustomStatus from '../../components/CustomStatus';
import { styles } from './style';

const HomeScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      {selectedTab == 0 ? (<Users navigateToChat={(item,id)=> {
        navigation.navigate('Chat', {data:item, id: id})
      }} navigateToGroups={()=>navigation.navigate('Groups')}/>) : (<Setting/>)}
      <CustomStatus />
      <View style={styles.bottomView}>
        <CustomImage source={images.user} imageStyle={[styles.image,{
          tintColor: selectedTab == 0 ? '#7E50EA' : 'black'
        }]} onPress={()=>{
          setSelectedTab(0);
        }}/>
        <CustomImage source={images.qrCode} imageStyle={[styles.qrCode,{
          tintColor: selectedTab == 1 ? '#7E50EA' : 'black'
        }]} onPress={()=>{
          setSelectedTab(1);
        }}/>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen;