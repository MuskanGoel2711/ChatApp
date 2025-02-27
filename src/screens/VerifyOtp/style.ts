import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    leftIcon: {
        paddingVertical: 20
    },
    leftArrow: {
        width: 30,
        height: 30,
        tintColor: 'black'
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    subtitle: {
        fontSize: 16,
        color: '#929493'
    },
    subtitle1: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'black'
    },
    otpContainer: {
        marginBottom: 10,
        paddingHorizontal: 50
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'gray',
        textAlign: 'center',
        fontSize: 18,
    },
    pinCodeText: {
        fontSize: 16,
        color: 'black'
    },
    errorView: {
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    buttonContainer: {
        backgroundColor: '#2f71a3',
        padding: 15,
        marginTop: 60,
        borderRadius: 15,
        marginBottom: 40
    },
    buttonDisabled: {
        backgroundColor: 'gray',
        padding: 15,
        marginTop: 60,
        borderRadius: 15,
        marginBottom: 40,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonResendDisabled: {
        color: 'lightBlue',
        backgroundColor: 'gray',
        padding: 15,
        marginTop: 60,
        borderRadius: 15,
        marginBottom: 40,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    resend: {
        color: 'black'
    },
    resendContainer: {
        paddingLeft: 5
    },
    signUpText: {
        color: '#2f71a3',
        fontWeight: 'bold'
    },
    signUpView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerView: {
        padding: 27
    },
    timerText: {
        textAlign: 'center',
        color: 'black'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        height: '40%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalText1: {
        color: '#525559'
    }
})
