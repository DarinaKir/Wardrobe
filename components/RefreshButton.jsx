import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RefreshButton = ({ onRefresh }) => {
    const rotateValue = useRef(new Animated.Value(0)).current;

    // פונקציה לסיבוב האייקון
    const rotateIcon = () => {
        // מפעיל את האנימציה של הסיבוב
        Animated.timing(rotateValue, {
            toValue: 1, // סיבוב של 360 מעלות
            duration: 500, // משך הסיבוב במילישניות
            useNativeDriver: true, // משפר ביצועים
        }).start(() => {
            rotateValue.setValue(0); // מחזיר את ערך האנימציה לאפס לסיבוב הבא
            if (onRefresh) {
                onRefresh(); // מבצע את הפעולה שהועברה ב-props לאחר הסיבוב
            }
        });
    };

    // ערך האנימציה שמגדיר את הסיבוב
    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <TouchableOpacity onPress={rotateIcon} style={styles.button}>
            <Animated.View style={{ transform: [{ rotate }] }}>
                <MaterialIcons style={{color: '#464646'}} name="refresh" size={24} color='white' />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 35,
        right: 10,
        padding: 20,
        borderRadius: 30,
    },
});

export default RefreshButton;
