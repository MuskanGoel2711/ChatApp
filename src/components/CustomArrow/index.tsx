import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

interface CustomImageProps {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    source: ImageSourcePropType;
}
const CustomImage: React.FC<CustomImageProps> = ({
    onPress,
    style,
    imageStyle,
    source
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <Image source={source} style={imageStyle} resizeMode='contain' />
        </TouchableOpacity>
    )
}

export default CustomImage;