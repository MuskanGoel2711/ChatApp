import { StyleSheet } from 'react-native';
import { vh, vw } from '../../utils/Dimensions';

export const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'white',
      // backgroundColor: 'white'
    },
    subContainer: {
      // paddingVertical: vh(35),
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
    loginContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: 23
    },
    accountText: {
      fontSize: 15,
      fontWeight: '400',
      color: 'gray'
    },
    loginText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'blue',
      paddingLeft: 5
    },
    forgotPass: {
      marginTop: vw(14),
      alignSelf: 'flex-end',
    },
    forgotPassText: {
      fontSize: 16,
      color: '#3797EF',
    }
  });