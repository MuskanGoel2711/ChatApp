import React from 'react';
import { Image, ImageSourcePropType, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { styles } from './style';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  isButtonDisabled?: boolean;
  iconSource?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  key?: string | number;
  textStyle?: StyleProp<TextStyle>
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  isButtonDisabled = false,
  iconSource,
  style,
  key,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.submitButton, isButtonDisabled && [styles.disabledButton], style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isButtonDisabled} key={key}>
      <View
        style={[
          styles.contentContainer,
          iconSource && styles.rowContainer,
        ]}>
        {iconSource && <Image source={iconSource} style={styles.iconStyle} resizeMode='contain'/>}
        <Text
          style={[
            styles.submitButtonText,
            isButtonDisabled && styles.disabledButtonText,
            textStyle
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;