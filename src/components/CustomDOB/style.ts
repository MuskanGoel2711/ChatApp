import { StyleSheet } from 'react-native';
import { vw } from '../../utils/Dimensions';

export const styles = StyleSheet.create({
    iconButton: {
      paddingHorizontal: vw(14),
      borderColor: 'black',
      borderRightWidth: 1,
      marginRight: vw(4),
    },
    iconStyle: {
      width: vw(20),
      height: vw(20),
      resizeMode: 'contain',
      tintColor: 'gray',
    },
    phoneInput: {
      width: '100%',
      marginTop: 23,
      fontSize: 15,
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    errorContainer: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      fontSize: 13,
      marginTop: vw(4),
      textAlign: 'left',
    },
    calendarImg: {
      width: vw(22),
      height: vw(22),
      resizeMode: 'contain',
    },
  });