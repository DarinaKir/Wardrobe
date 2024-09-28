import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RefreshButton = ({ onRefresh }) => {
    return (
        <TouchableOpacity onPress={onRefresh} style={styles.button}>
            <MaterialIcons name="refresh" size={24} color='white' />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 35,       // מיקום למעלה
        right: 10,     // מיקום מימין
        // backgroundColor: '#a96cf8', // צבע הכפתור
        padding: 10,
        borderRadius: 30,
        elevation: 5,  // הצללה
    },
});

export default RefreshButton;
