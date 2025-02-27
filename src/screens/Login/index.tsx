import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets/index';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomStatus from '../../components/CustomStatus';
import { validateEmail, validatePassword } from '../../utils/validations';
import { styles } from './style';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamListLogin = {
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  HomeScreen: undefined
};

type LoginProps = NativeStackScreenProps<RootStackParamListLogin, 'Login'>;

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);

  const { height } = Dimensions.get('screen');
  const isSmallDevice = height <= 667;

  const loginUser = () => {
    firestore().collection('users').where("email", "==", email).get().then(res => {
      if (!res.empty) { 
        console.log(JSON.stringify(res.docs[0].data()));
        goToNext(res.docs[0].data().firstName, res.docs[0].data().email, res.docs[0].data().userId)
      } else {
        console.log("No user found with that email");
        setError(true);
      }
    }).catch(error => {
      console.log(error)
    })
  }

  const goToNext = async(firstName, email, userId) => {
    await AsyncStorage.setItem("NAME", firstName);
    await AsyncStorage.setItem("EMAIL", email);
    await AsyncStorage.setItem("USERID", userId);
    navigation.navigate('HomeScreen')
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length === 0) {
      setPasswordError(false);
    } else if (validatePassword(text)) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleNext = () => {
    if (!error) {
      navigation.navigate('HomeScreen')
    }
  };

  const isButtonDisabled = emailError || !validateEmail(email) || passwordError || !validatePassword(password);
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
              <Text style={styles.headerText}>{'Sign In'}</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailText}>
                {'Welcome back! Please enter your details.'}
              </Text>
            </View>

            <CustomInput
              name={email}
              label={'Email Address'}
              maxLength={50}
              keyboardType={'email-address'}
              onChangeText={handleEmailChange}
              // setName={setEmail}
              Icon={images.email}
              Error={emailError}
              // setError={setEmailError}
              errorText={'Please enter valid email'}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <CustomInput
              forwardRef={passwordInputRef}
              name={password}
              label={'Password'}
              Icon={images.lock}
              isPassword
              isPasswordVisible={isPasswordVisible}
              togglePasswordVisibility={togglePasswordVisibility}
              Error={passwordError}
              onChangeText={handlePasswordChange}
              maxLength={50}
              keyboardType="default"
              errorText="Please enter at least one uppercase, lowercase, digit, special character and 8 characters long"
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.forgotPass}
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}>
              <Text style={styles.forgotPassText}>{'Forgot Password?'}</Text>
            </TouchableOpacity>

            <CustomButton
              title={'Sign In'}
              onPress={() => { loginUser(); }}
              isButtonDisabled={isButtonDisabled}
            />
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.accountText}>{'Donot have an account?'}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp')
              }
              }>
              <Text style={styles.loginText}>{'Sign up'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default Login;