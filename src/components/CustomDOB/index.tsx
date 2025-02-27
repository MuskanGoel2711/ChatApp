import { format, parse } from 'date-fns';
import React, { useState, Ref } from 'react';
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from 'react-native-paper';
import { styles } from './style';

interface DOBPickerProps {
  label?: string;
  Icon?: ImageSourcePropType;
  calendarIcon: ImageSourcePropType;
  onDateChange: (selectedDate: Date | undefined) => void;
  dateFormat?: string;
  clearIcon?: ImageSourcePropType;
  onClear?: () => void;
  returnKeyType?: 'done' | 'next'; 
  onSubmitEditing?: () => void;
  forwardRef?: Ref<RNTextInput>;
}

const DOBPicker = ({
  label,
  Icon,
  calendarIcon,
  clearIcon,
  onDateChange,
  onClear,
  dateFormat = 'dd/mm/yyyy h:mm',
  returnKeyType,
  onSubmitEditing,
  forwardRef
}: DOBPickerProps) => {
  const [dob, setDob] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    console.log("date", isDatePickerVisible)
    setDatePickerVisibility(true);
    console.log("isDate", isDatePickerVisible);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    const formattedDate = format(date, dateFormat);
    setDob(formattedDate);
    onDateChange(date);
    hideDatePicker();
  };

  const handleDateInput = (input: string) => {
    setDob(input);

    const parsedDate = parse(input, 'dd/mm/yyyy h:mm', new Date());
    if (!isNaN(parsedDate.getTime())) {
      onDateChange(parsedDate);
    }
  };

  const clearDate = () => {
    setDob('');
    onDateChange(undefined); 
    if (onClear) {
      onClear(); 
    }
  };

  return (
    <TouchableOpacity onPress={dob ? clearDate : showDatePicker}>
      <TextInput
        style={styles.phoneInput}
        label={label}
        value={dob}
        onChangeText={handleDateInput}
        editable={false}
        textColor={'black'}
        selectTextOnFocus={false}
        keyboardType="numeric"
        mode="outlined"
        returnKeyType={returnKeyType} 
        onSubmitEditing={onSubmitEditing} 
        ref={forwardRef}
        underlineStyle={{
          display: 'none',
        }}
        placeholderTextColor={'black'}
        right={
          <TextInput.Icon
            icon={() => (
              <TouchableOpacity onPress={dob ? clearDate : showDatePicker}>
                <Image
                  source={dob ? clearIcon : calendarIcon}
                  style={[styles.calendarImg]}
                />
              </TouchableOpacity>
            )}
          />
        }
        left={
          Icon && (
            <TextInput.Icon
              icon={() => (
                <TouchableOpacity activeOpacity={1} style={styles.iconButton}>
                  <Image
                    source={Icon}
                    style={[styles.iconStyle]}
                  />
                </TouchableOpacity>
              )}
            />
          )
        }
        theme={{
          colors: {
            primary: 'gray',
            placeholder: 'grey',
            background: 'transparent',
            disabled: 'transparent',
          },
        }}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      // maximumDate={new Date()}
      />
    </TouchableOpacity>
  );
};

export default DOBPicker;