import { StyleSheet } from "react-native";
import { vh, vw } from "../../utils/Dimensions";

const styles = StyleSheet.create({
    container: {
        padding: 12
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text1: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    edit: {
        fontSize: 18,
        fontWeight: 600,
    },
    icon: {
        width: vw(30),
        height: vh(30),
        tintColor: 'black'
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer: {
        padding: 40,
        borderRadius: 20,
        borderRadius: 100,
        backgroundColor: '#7E50EA',
        textAlign: 'center',
        marginVertical: 18
    },
    initials: {
        // fontWeight: "bold",
        fontSize: 25,
        color: 'white',
        alignSelf: 'center'
    },
    groupName: {
        fontWeight: 'bold',
        fontSize: 23,
    },
    number: {
        fontSize: 15
    },
    members: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7E50EA'
    },
    membersName: {
        margin: 23
    },
    iconContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addMember: {
        marginLeft: 10,
        fontSize: 16
    },
    flatListContainer: {
        marginVertical: 15
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    memberInitialsContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#7E50EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    memberInitials: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    memberName: {
        fontSize: 16,
        color: 'black',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonContainer: { flexDirection: 'row', width: '45%', columnGap: 10, justifyContent: 'center', }
})

export default styles;