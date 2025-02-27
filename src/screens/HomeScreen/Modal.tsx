import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, Image } from 'react-native';
import { styles } from './style';
import { images } from '../../assets/index';

interface ModalsProps {
    isModalVisible: boolean;
    closeModal: () => void;
    navigateToScreen: () => void;
}

const Modals: React.FC<ModalsProps> = ({ isModalVisible, closeModal, navigateToScreen }) => {
    const modalOptions = [
        { icon: images.newChat, text: 'New Chat', onPress: () => { } },
        { icon: images.newGroup, text: 'New Group Chat', onPress: navigateToScreen },
        { icon: images.newAnnouncement, text: 'New Announcement', onPress: () => { } }
    ];
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
        >
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {modalOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.modalOption}
                                onPress={option.onPress}
                            >
                                <Image source={option.icon} style={styles.modalIcon} />
                                <Text style={styles.modalText}>{option.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default React.memo(Modals);