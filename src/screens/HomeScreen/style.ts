import { StyleSheet } from "react-native";
import { vh, vw } from "../../utils/Dimensions";

export const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: 'white'
    },
    bottomView: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height:50,
      // backgroundColor: '#3d7cb3',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    image:{
      width: 30,
      height: 30,
    },
    qrCode: {
      width: 22,
      height: 22
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: 'center',
  },
  modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      width: '100%',
  },
  modalIcon: {
      width: vw(30),
      height: vh(30),
      marginRight: 15,
  },
  modalText: {
      fontSize: 18,
  },
})