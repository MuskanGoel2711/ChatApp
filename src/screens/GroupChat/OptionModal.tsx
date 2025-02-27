import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import styles from './style';
import { images } from '../../assets/index';

interface OptionModalProps {
  optionModalVisible: boolean;
  deleteAllMessages: () => void;
  isOptionModalVisible: (visible: boolean) => void;
}

const OptionItem = ({
  icon,
  text,
  onPress,
}: {
  icon?: any;
  text?: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.modalContainerIcon} onPress={onPress}>
    <Image source={icon} style={styles.modalIcon} />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const OptionModal: React.FC<OptionModalProps> = ({ optionModalVisible, deleteAllMessages, isOptionModalVisible }) => {
  const closeModal = () => isOptionModalVisible(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={optionModalVisible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <OptionItem icon={images.eye} text="View Details" onPress={closeModal} />
            <OptionItem icon={images.pinNot} text="Unpin Chat" onPress={closeModal} />
            <OptionItem icon={images.searchInterfaceSymbol} text="Search Chat" onPress={closeModal} />
            <OptionItem
              icon={images.delete}
              text="Delete"
              onPress={() => {
                deleteAllMessages();
                closeModal();
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default OptionModal;
