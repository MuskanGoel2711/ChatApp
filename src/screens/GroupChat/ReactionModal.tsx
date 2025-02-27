import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, TouchableHighlight, Image, StyleSheet } from 'react-native';
import { images } from '../../assets/index';
import { vh, vw } from '../../utils/Dimensions';

interface ReactionModalProps {
  modalVisible: boolean;
  isModalVisible: (visible: boolean) => void;
  isConfirmDeleteModalVisible: (visible: boolean) => void;
  selectEmoji: any;
  deleteMessage: any;
}

const ReactionModal: React.FC<ReactionModalProps> = ({ modalVisible, isModalVisible, selectEmoji, deleteMessage,isConfirmDeleteModalVisible }) => {
  const optionImages = [
    images.reply,
    images.forward,
    images.copy,
    images.star,
    images.edit,
    images.deleteIcon,
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      // onRequestClose={() => isModalVisible}
    >
      <TouchableWithoutFeedback onPress={() =>isModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.reactionContainer}>
              {["👍", "❤️", "😢", "🎉", "👎"].map((emoji) => (
                <TouchableHighlight
                  key={emoji}
                  onPress={() => selectEmoji(emoji)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableHighlight>
              ))}
            </View>
            <View style={styles.optionContainer}>
              {["Reply", "Forward", "Copy", "Star", "Edit", "Delete"].map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionButton}
                  onPress={() => {
                    if (option === "Delete") {
                      isModalVisible(false);
                      isConfirmDeleteModalVisible(true);
                      deleteMessage();
                    }
                  }}
                >
                  <Image source={optionImages[index]} style={styles.modalIcon} />
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReactionModal;

const styles = StyleSheet.create({
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
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'column',
    // justifyContent: 'space-around',
  },
  optionButton: {
    padding: 17,
    flexDirection: 'row'
  },
  sendIcon: {
    marginBottom: 10,
    marginRight: 10,
  },
  sendButton: {
    marginBottom: 10,
    marginRight: 10,
  },
  optionText: {
    paddingLeft: 15
  },
  modalIcon: {
    width: vw(20),
    height: vh(20)
  },
  emoji: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 5,
  },
})
