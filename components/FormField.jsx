import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FormField = ({title, value, placeholder, handleChangeText, ...props}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{title}</Text>

            <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === "Password" && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {title === "Password" && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.iconContainer}
                    >
                        <MaterialCommunityIcons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={30}
                            color="#000"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#7B7B8B',
        fontFamily: 'Poppins-Medium',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
        paddingHorizontal: 16,
        backgroundColor: '#E2D0B9',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#CBB99F',
    },
    inputContainerFocused: {
        borderColor: '#000', // שינוי צבע הגבול לשחור בעת לחיצה
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FormField;
