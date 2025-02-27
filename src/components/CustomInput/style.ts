import { StyleSheet } from 'react-native';
import { vh, vw } from '../../utils/Dimensions';

export const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: vw(14),
    borderColor: 'black',
    borderRightWidth: 1,
    marginRight: vw(4),
    borderWidth: 1
  },
  iconStyle: {
    width: vw(20),
    height: vw(20),
    resizeMode: 'contain',
  },
  phoneInput: {
    width: '100%',
    marginTop: 23,
    fontSize: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  eyeImg: {
    width: vw(24),
    height: vw(24),
    resizeMode: 'contain',
    // marginTop: vh(7),
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
})
