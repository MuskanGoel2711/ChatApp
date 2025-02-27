import { StyleSheet } from 'react-native';
import { vh, vw } from '../../utils/Dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  phoneInputMobile: {
    flex: 1,
    borderEndEndRadius: 10,
    borderTopEndRadius: 10,
    fontSize: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginRight: 2,
    borderColor: 'black'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vh(16),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white'
  },
  telephoneButton: {
    paddingHorizontal: vw(14),
    borderColor: 'black',
    borderRightWidth: 1,
    marginRight: vw(4),
  },
  iconStyle: {
    width: vw(20),
    height: vw(20),
    tintColor: 'gray',
    resizeMode: 'contain',
  },
  flagButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8
  },
  flagText: {
    fontSize: 18,
    marginRight: 4,
  },
  callingCodeText: {
    fontSize: 15,
    color: 'black',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  errorContainer: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: vh(4),
    textAlign: 'left',
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  searchTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  countryText: {
    fontSize: 18,
    marginRight: 8,
  },
  countryName: {
    fontSize: 16,
    color: "#333",
  },
  searchInput: {
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 15,
    color: 'black',
  },
  closeButton: {
    marginTop: 16,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
})
