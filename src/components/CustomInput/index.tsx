import React, { Ref } from 'react';
import {
  Image,
  ImageSourcePropType,
  KeyboardTypeOptions,
  Text,
  TouchableOpacity,
  View,
  TextInput as RNTextInput
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { styles } from './style';

interface CustomInputProps {
  name: string;
  label: string;
  Icon?: ImageSourcePropType;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  togglePasswordVisibility?: () => void;
  Error?: boolean;
  errorText?: string;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (text: string) => void;
  returnKeyType?: 'done' | 'next';
  onSubmitEditing?: () => void;
  forwardRef?: Ref<RNTextInput>;
  editable?: boolean;
  selectTextOnFocus?: boolean;
  style?: any;
}

const CustomInput = ({
  name,
  label,
  Icon,
  isPassword = false,
  isPasswordVisible,
  togglePasswordVisibility,
  Error,
  errorText,
  maxLength,
  keyboardType,
  onChangeText,
  forwardRef,
  returnKeyType,
  onSubmitEditing,
  editable = true,
  selectTextOnFocus = false,
  style
}: CustomInputProps) => {

  return (
    <View>
      <TextInput
        style={[styles.phoneInput, Error ? styles.errorContainer : null, style]}
        label={label}
        keyboardType={keyboardType}
        value={name}
        maxLength={maxLength}
        secureTextEntry={isPassword && !isPasswordVisible}
        textColor={'black'}
        onChangeText={onChangeText}
        mode="outlined"
        underlineStyle={{ display: 'none' }}
        theme={{
          colors: {
            primary: Error ? 'red' : 'gray',
            placeholder: 'grey',
            background: 'transparent',
          },
        }}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        ref={forwardRef}
        editable={editable}
        selectTextOnFocus={selectTextOnFocus}
        left={
          Icon && (
            <TextInput.Icon
              icon={() => (
                <Image
                  source={Icon}
                  style={[styles.iconStyle, { tintColor: Error ? 'red' : 'grey' }]}
                />
              )}
            />
          )
        }
        right={
          isPassword && (
            <TextInput.Icon
              icon={() => (
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Image
                    source={
                      isPasswordVisible
                        ? require('../../assets/images/eye_off.png')
                        : require('../../assets/images/eye.png')
                    }
                    style={[styles.eyeImg, { tintColor: 'grey' }]}
                  />
                </TouchableOpacity>
              )}
            />
          )
        }
      />
      {Error && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

export default CustomInput;