import { StyleSheet } from "react-native";
import { vw } from "../../utils/Dimensions";

const styles = StyleSheet.create({
    container1: { borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
    container: {
        width: vw(150),
        borderRadius: 10,
    },
    image: { width: 25, height: 25, tintColor: 'grey', marginRight: 5 },
    audio: { width: 50, height: 35, tintColor: '#396ead' },
    timer: { textAlign: 'right', fontSize: 10, color: 'black', paddingRight: 8 },
    progressContainer: {
        width: '70%',
        height: 5,
        // backgroundColor: 'black',
        borderRadius: 5,
        overflow: 'hidden',
        paddingRight: 5,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007bff',
    },
    imageContainer: {
        flexDirection: 'row',
        position: 'relative',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
        borderRadius: 25, // Match the image shape
    },
    timestamp: {
        fontSize: 10,
        color: '#666',
        alignSelf: 'flex-end',
        margin: 3,
    }
})

export default styles;