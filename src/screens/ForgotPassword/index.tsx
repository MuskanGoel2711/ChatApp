import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { images } from '../../assets/index';
import CustomImage from '../../components/CustomArrow';
import CustomButton from '../../components/CustomButton/index';
import CustomMobileInputBox from '../../components/CustomMobile/index';
import { styles } from './style';
import CustomStatus from '../../components/CustomStatus';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Country = {
  name: string;
  flag: string;
  calling_code: string;
};

type RootStackParamListForgotPassword = {
  ForgotPassword: undefined;
  VerifyOtp: undefined;
};

type ForgotPasswordProps = NativeStackScreenProps<RootStackParamListForgotPassword, 'ForgotPassword'>;

const ForgotPassword = ({ navigation }: ForgotPasswordProps) => {
  const insets = useSafeAreaInsets();
  const [callingCode, setCallingCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [error, setError] = useState(false);

  const onSelect = (country: any) => {
    console.log('country', country)
    // setCallingCode(`+${country.callingCode}`);
    setCallingCode(country.calling_code)
    setPickerVisible(false);
  };
  
  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!error) {
      navigation.navigate('VerifyOtp');
    }
  };

  const isButtonDisabled = phoneNumber.length < 5;
  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
          <ScrollView style={{ flex: 1 }}>
            <CustomStatus />
            <View style={styles.subContainer}>
              <CustomImage source={images.back} imageStyle={styles.Left} style={styles.backButton} onPress={handleBack} />
              <View style={styles.contentHeader}>
                <Text style={styles.headerText}>Forgot Password</Text>
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailText}>
                No worries, we'll send an otp on your registered mobile number for verification.
                </Text>
              </View>
              <CustomMobileInputBox
                label='Mobile Number'
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onSelect={onSelect}
                setPickerVisible={setPickerVisible}
                Icon={images.telephone}
                error={error}
                setError={setError}
                errorText={'Mobile no. should be min 5 digit and max 13 digit.'}
              />
              <CustomButton
                title='Verify OTP'
                onPress={handleNext}
                isButtonDisabled={isButtonDisabled}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
};
export default ForgotPassword;