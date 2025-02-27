import React, { Ref, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  TextInput as RNTextInput,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from 'react-native-paper';
import countries from "../../assets/countries/countries";
import { validatePhoneNumber } from '../../utils/validations';
import { styles } from './style';

type Country = {
  name: string;
  flag: string;
  calling_code: string;
};

interface CustomMobileInputBoxProps {
  callingCode?: string;
  label: string;
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
  onSelect?: (country: Country) => void;
  setPickerVisible?: any;
  Icon: ImageSourcePropType;
  error: boolean;
  setError: (hasError: boolean) => void;
  errorText?: string;
  returnKeyType?: 'done' | 'next';
  onSubmitEditing?: () => void;
  forwardRef?: Ref<RNTextInput>;
}

const CustomMobileInputBox = ({
  label,
  phoneNumber,
  setPhoneNumber,
  onSelect,
  setPickerVisible,
  Icon,
  error,
  setError,
  errorText,
  returnKeyType,
  onSubmitEditing,
  forwardRef
}: CustomMobileInputBoxProps) => {

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (text === '') {
      setError(false);
    } else if (validatePhoneNumber(text)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsModalVisible(false);
    if (onSelect) {
      onSelect(country);
    }
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error ? styles.errorContainer : null]}>
        <TouchableOpacity activeOpacity={1} style={styles.telephoneButton}>
          <Image
            source={Icon}
            style={[styles.iconStyle, { tintColor: error ? 'red' : 'grey' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flagButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.flagText}>{selectedCountry.flag}</Text>
          <Text style={styles.callingCodeText}>{selectedCountry.calling_code}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.phoneInputMobile}
          label={label}
          keyboardType="phone-pad"
          textColor={'black'}
          maxLength={13}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          mode="flat"
          underlineStyle={{
            display: 'none',
          }}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          ref={forwardRef}
          theme={{
            colors: {
              primary: error ? 'red' : 'gray',
              placeholder: 'grey',
              background: 'transparent',
              disabled: 'transparent',
            },
          }}
        />
      </View>
      {error && <Text style={styles.errorText}>{errorText}</Text>}

      <Modal visible={isModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContainer}>
          <Text style={styles.searchTitle}>Select Country</Text>
          <RNTextInput
            style={styles.searchInput}
            placeholder="Search country..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryButton}
                onPress={() => handleSelectCountry(item)}
              >
                <Text style={styles.countryText}>{item.flag}</Text>
                <Text style={styles.countryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default CustomMobileInputBox;