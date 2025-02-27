import { StyleSheet } from 'react-native';
import { vh, vw } from '../../utils/Dimensions';

export const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    subContainer: {
      paddingHorizontal: vw(20),
    },
    contentHeader: {},
    headerText: {
      fontSize: 23,
      fontWeight: 'bold',
      color: 'black',
    },
    detailTextContainer: {
      marginTop: vh(10),
      marginBottom: vh(10),
    },
    detailText: {
      fontSize: 16,
      color: 'gray',
    },
    focusedInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: vh(24),
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'red',
      width: '100%',
    },
    telephoneButton: {
      paddingHorizontal: vw(14),
      borderColor: 'black',
      borderRightWidth: 1,
      marginRight: vw(4),
    },

    countryCodeButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    consentContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: vh(15),
      paddingRight: vw(24),
    },
    consentButton: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'black',
    },
    consentText: {
      lineHeight: vh(19),
      fontSize: 15,
      color: 'gray',
      marginLeft: vw(4),
    },
    uncheckedImg: {
      width: vw(18),
      height: vw(18),
      resizeMode: 'cover',
    },
    disabledButton: {
      backgroundColor: 'white',
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.8,
      shadowRadius: 3,
      elevation: 5,
    },
    loginContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: 23
    },
    accountText: {
      fontSize: 16,
      fontWeight: '400',
      color: 'gray',
    },
    loginText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2f71a3',
      paddingLeft: 6
    },
  });