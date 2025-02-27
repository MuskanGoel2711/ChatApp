import { StyleSheet } from "react-native";
import { vh, vw } from '../../utils/Dimensions';

export const styles = StyleSheet.create({
        disabledButton: {
            backgroundColor: 'white',
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3,
            elevation: 5,
        },
        submitButton: {
            backgroundColor: '#3260a8',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            width: '85%',
            marginTop: vh(44),
            paddingVertical: vh(16),
            borderRadius: 10,
            shadowColor: 'white',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3,
            elevation: 5,
        },
        submitButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        disabledButtonText: {
            color: '#E2E2E2',
        },
        contentContainer: {
            // alignItems: 'center',
            // justifyContent: 'center',
        },
        rowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconStyle: {
            width: vw(24),
            height: vh(24),
            marginRight: 8,
        },
    });