import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { images } from '../../assets/index';
import CustomButton from '../../components/CustomButton';
import DOBPicker from '../../components/CustomDOB';
import CustomInput from '../../components/CustomInput';
import CustomMobileInputBox from '../../components/CustomMobile';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validations';
import { styles } from './style';
import CustomStatus from '../../components/CustomStatus/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

type RootStackParamListSignUp = {
  SignUp: undefined;
  VerifyOtp: undefined;
  Login: undefined;
};

type Country = {
  name: string;
  flag: string;
  calling_code: string;
};

type SignUpProps = NativeStackScreenProps<RootStackParamListSignUp, 'SignUp'>;

const SignUp = ({ navigation }: SignUpProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [callingCode, setCallingCode] = useState('+91');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const { height } = Dimensions.get('screen');
  const isSmallDevice = height <= 667;

  const insets = useSafeAreaInsets();

  const registerUser = () => {
    const userId = uuid.v4();
    firestore().collection('users').doc(userId).set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      userId: userId
    }).then(res => {
      navigation.navigate('Login')
      console.log('User created')
    }).catch(error => {
      console.log(error)
    })
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (text.length === 0) {
      setPasswordError(false);
    } else if (validatePassword(text)) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }, [password]);
  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
    if (text.length === 0) {
      setConfirmPasswordError(false);
    } else if (text !== password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  }, [confirmPassword]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const onSelect = (country: Country) => {
    setCallingCode(country.calling_code)
    setPickerVisible(false);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text === '') {
      setEmailError(false);
    } else if (validateEmail(text)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (text === '') {
      setFirstNameError(false);
    } else if (validateName(text)) {
      setFirstNameError(false);
    } else {
      setFirstNameError(true);
    }
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (text === '') {
      setLastNameError(false);
    } else if (validateName(text)) {
      setLastNameError(false);
    } else {
      setLastNameError(true);
    }
  };

  const handleNext = () => {
    if (!error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'VerifyOtp' }]
      })
    }
  };

  const handleFirstNameSubmit = () => lastNameRef.current?.focus();
  const handleLastNameSubmit = () => emailRef.current?.focus();
  const handleEmailSubmit = () => passwordRef.current?.focus();
  const handlePasswordSubmit = () => confirmPasswordRef.current?.focus();
  const handleConfirmPasswordSubmit = () => phoneRef.current?.focus();

  const isButtonDisabled =
    phoneNumber.length < 5 ||
    firstNameError ||
    lastNameError ||
    emailError ||
    passwordError ||
    confirmPasswordError ||
    !validateName(firstName) ||
    !validateName(lastName) ||
    !validateEmail(email) ||
    !validatePassword(password) ||
    confirmPassword !== password;
  return (
    <KeyboardAwareScrollView
      bounces={false}
      extraHeight={height * (isSmallDevice ? 0.38 : 0.41)}
      showsVerticalScrollIndicator={false} style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{ flex: 1 }}>
          <CustomStatus />
          <View style={styles.subContainer}>
            <View style={styles.contentHeader}>
              <Text style={styles.headerText}>Create Account</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailText}>
                Please enter your details to sign up.
              </Text>
            </View>

            <CustomInput
              name={firstName}
              label={'FirstName'}
              maxLength={25}
              keyboardType={'name-phone-pad'}
              onChangeText={handleFirstNameChange}
              Icon={images.user}
              Error={firstNameError}
              errorText={
                'Please use only alphabetical letters and minimum length is 3 characters.'
              }
              returnKeyType="next"
              onSubmitEditing={handleFirstNameSubmit}
            />
            <CustomInput
              name={lastName}
              label={'LastName'}
              maxLength={25}
              keyboardType="name-phone-pad"
              onChangeText={handleLastNameChange}
              Icon={images.user}
              Error={lastNameError}
              errorText={
                'Please use only alphabetical letters and minimum length is 3 characters.'
              }
              forwardRef={lastNameRef}
              returnKeyType="next"
              onSubmitEditing={handleLastNameSubmit}
            />
            <DOBPicker
              label="Date of Birth"
              Icon={images.birthday}
              calendarIcon={images.calendar}
              onDateChange={handleDateChange}
            />
            <CustomInput
              name={email}
              label={'Email Address'}
              maxLength={50}
              keyboardType={'email-address'}
              onChangeText={handleEmailChange}
              Icon={images.email}
              Error={emailError}
              errorText={'Please enter valid email'}
              forwardRef={emailRef}
              returnKeyType="next"
              onSubmitEditing={handleEmailSubmit}
            />
            <CustomInput
              forwardRef={passwordRef}
              name={password}
              label={'Password'}
              Icon={images.lock}
              isPassword
              isPasswordVisible={isPasswordVisible}
              togglePasswordVisibility={togglePasswordVisibility}
              Error={passwordError}
              onChangeText={handlePasswordChange}
              maxLength={50}
              errorText="Please enter at least one uppercase, lowercase, digit, special character and 8 characters long"
              returnKeyType="next"
              onSubmitEditing={handlePasswordSubmit}
            />
            <CustomInput
              forwardRef={confirmPasswordRef}
              name={confirmPassword}
              label={'Confirm Password'}
              Icon={images.lock}
              isPassword
              isPasswordVisible={isConfirmPasswordVisible}
              togglePasswordVisibility={toggleConfirmPasswordVisibility}
              Error={confirmPasswordError}
              onChangeText={handleConfirmPasswordChange}
              maxLength={50}
              errorText="Passwords do not match"
              returnKeyType="next"
              onSubmitEditing={handleConfirmPasswordSubmit}
            />
            <CustomMobileInputBox
              forwardRef={phoneRef}
              label={'Phone Number'}
              callingCode={callingCode}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSelect={onSelect}
              setPickerVisible={setPickerVisible}
              Icon={images.telephone}
              error={error}
              setError={setError}
              errorText={'Mobile no. should be min 5 digit and max 13 digit.'}
              returnKeyType="done"
            />

            <CustomButton
              title={'SignUp'}
              onPress={() => { registerUser(); }}
              isButtonDisabled={isButtonDisabled}
            />
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.accountText}>{'Already have an account?'}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}>
              <Text style={styles.loginText}>{'Login'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;