import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';

const DeleteGroupModal = ({ visible, onDelete, onCancel }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View>
                        <Text style={styles.modalTitle}>Delete Group</Text>
                        <Text style={styles.modalDescription}>Are you sure you want to delete this group?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '60%', columnGap: 10, justifyContent: 'center' }}>
                        <CustomButton title="Delete" onPress={onDelete} style={{marginTop: 0}}/>
                        <CustomButton title="Cancel" onPress={onCancel} style={{marginTop: 0}}/>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalDescription: {
        marginBottom: 20
    }
});

export default DeleteGroupModal;
