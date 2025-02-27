import { StyleSheet } from "react-native";
import { vh, vw } from '../../utils/Dimensions';

const styles = StyleSheet.create({
    plus: { marginLeft: 8, width: vw(35), height: vh(35) },
    searchInput: {
        flex: 1,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    sendInputIcon: { marginHorizontal: 8, width: vw(22), height: vh(22) },
    searchInputContainer: {
        marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    header: {
        width: '100%',
        flexDirection: "row",
        paddingHorizontal: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: "#DDDDDD",
        paddingVertical: 8,
        // backgroundColor: "#3d7cb3",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        width: vw(35),
        height: vh(35),
        tintColor: 'black'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'black',
        marginLeft: -70
    },
    avatarContainer: { borderRadius: 100, padding: 6, backgroundColor: '#b6c1db', marginLeft: -70},
    initials: {
        fontWeight: "bold",
        fontSize: 18,
        // color: 'white'
    },
    iconThree: {
        width: vw(30),
        height: vh(30),
        marginLeft: 50
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
    },
    optionText: {
        paddingLeft: 15
    },
    modalIcon: {
        width: vw(20),
        height: vh(20)
    },
    modalContainerIcon: {
        flexDirection: 'row',
        margin: 20
    },
})

export default styles;