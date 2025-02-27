import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    initialsContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#7E50EA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 18,
        color: 'white',
    },
    userItem1: {
        flex: 1,
        alignSelf: 'center',
        margin: 20,
        flexDirection: 'row',
        backgroundColor: '#c5c9d4',
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between'
    },
    userName: {
        fontSize: 16,
        fontWeight: '600'
    },
    userInfo: {
        flex: 1,
        marginLeft: 10
    },
    lastMessage: {
        fontSize: 14,
        color: 'gray'
    },
    timeAgo: {
        fontSize: 12,
        color: 'gray'
    },
    user: {
        width: 30,
        height: 30,
    },
})

export default styles;