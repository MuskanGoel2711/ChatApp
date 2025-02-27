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
  backButton: {
    width: vw(40),
    height: vw(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#acb0ad',
    borderRadius: 50,
  },
  Left: {
    width: vw(24),
    height: vw(24),
    resizeMode: 'contain',
  },
  contentHeader: {},
  headerText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'black',
    marginTop: vh(20),
  },
  detailTextContainer: {
    marginTop: vh(10),
    marginBottom: vh(10),
  },
  detailText: {
    fontSize: 16,
    color: 'gray',
  },
})
