import React from "react";
import { View } from "react-native";
import Dots from 'react-native-dots-pagination';

const DottedProgressBar = ({ progress }) => {
    const totalDots = 20; // Total dots in the progress bar
    const filledDots = Math.round((progress / 100) * totalDots);

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {Array.from({ length: totalDots }).map((_, index) => (
                <View
                    key={index}
                    style={{
                        width: 4,
                        height: 4,
                        borderRadius: 3,
                        marginHorizontal: 1,
                        backgroundColor: index < filledDots ? "black" : "gray",
                    }}
                />
            ))}
        </View>
    );
};

export default DottedProgressBar;