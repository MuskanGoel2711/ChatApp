import { vh, vw } from "../../utils/Dimensions";

const styles = {
    container: {
        flex: 1,
        padding: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedUserItem: {
        backgroundColor: '#e0f7fa',
    },
    icon: {
        width: vw(30),
        height: vh(30),
        tintColor: 'black'
    },
    userIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        tintColor: '#7E50EA'
    },
    userName: {
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
};

export default styles;