import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets/index';
import CustomImage from '../../components/CustomArrow/index';
import CustomButton from '../../components/CustomButton/index';
import CustomStatus from '../../components/CustomStatus';
import { styles } from './style';

interface OtpScreenProps {
    navigation: {
        goBack: () => void;
        dispatch: (action: CommonActions.Action) => void;
    };
}

const VerifyOtp: React.FC<OtpScreenProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [predefinedCode] = useState('1234');
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [enteredCode, setEnteredCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resendEnabled, setResendEnabled] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [timer, setTimer] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
        if (timer > 0) {
            timerInterval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsButtonDisabled(true);
            setResendEnabled(true);
        }

        return () => clearInterval(timerInterval);
    }, [timer])

    const handleCodeChange = (code: string) => {
        setEnteredCode(code);
        setIsButtonDisabled(code.length !== 4 || timer > 0);
    };

    const handleConfirmCode = () => {
        if (enteredCode === predefinedCode) {
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigation.navigate('HomeScreen')
            }, 1000);
        } else {
            setAttemptsLeft((prevAttempts) => {
                const remainingAttempts = prevAttempts - 1;
                if (remainingAttempts > 0) {
                    setErrorMessage(
                        `Incorrect code. You have ${remainingAttempts} attempt(s) remaining.`
                    );
                } else {
                    setErrorMessage('Too many failed attempts. Please resend the code.');
                    setResendEnabled(true);
                }
                return remainingAttempts;
            });
        }
    };

    const handleResendCode = () => {
        setAttemptsLeft(3);
        setErrorMessage('');
        setEnteredCode('');
        setTimer(30);
        setResendEnabled(false);
        setIsButtonDisabled(true);
    };

    const goBack = () => {
        navigation.goBack();
    };

    const buttonStyle = isButtonDisabled ? styles.buttonDisabled : styles.buttonContainer;

    return (
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
            <CustomStatus />
            <CustomImage style={styles.leftIcon} onPress={goBack} imageStyle={styles.leftArrow} source={images.back} />
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>Enter the 4-digit code sent to your mobile number</Text>
            <Text style={styles.subtitle1}>+1 (4**) *** *732</Text>
            <View>
                <OtpInput
                    numberOfDigits={4}
                    focusColor="#2f71a3"
                    placeholder="0000"
                    value={enteredCode}
                    onTextChange={handleCodeChange}
                    theme={{
                        containerStyle: styles.otpContainer,
                        pinCodeContainerStyle: [
                            styles.otpInput,
                            errorMessage ? { borderColor: 'red' } : {},
                        ],
                        pinCodeTextStyle: styles.pinCodeText,

                    }}
                    placeholderTextStyle={[
                        styles.otpInput,
                        attemptsLeft < 3 ? { borderColor: 'red' } : null,
                    ]}
                    type="numeric"
                    autoFocus
                />
                {errorMessage && (
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                )}
            </View>
            <CustomButton style={buttonStyle} onPress={handleConfirmCode} textStyle={styles.buttonText} title='Verify OTP' isButtonDisabled={isButtonDisabled} />
            <View style={styles.signUpView}>
                <Text style={styles.resend}>Didn't receive the code?</Text>
                <TouchableOpacity style={[
                    styles.resendContainer,
                    resendEnabled ? null : styles.buttonResendDisabled,
                ]} onPress={handleResendCode} disabled={!resendEnabled}>
                    <Text>Resend</Text>
                </TouchableOpacity>
            </View>
            {resendEnabled ? "" :
                <View style={styles.timerView}>
                    <Text style={styles.timerText}>00:{timer < 10 ? `0${timer}` : timer}</Text>
                </View>}
            <Modal
                animationType="fade"
                visible={showModal}
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Successfully</Text>
                        <Text style={styles.modalText1}>Your mobile number has been successfully verified.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default VerifyOtp;