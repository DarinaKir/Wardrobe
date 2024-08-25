import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={[
                styles.button,
                containerStyles,
                isLoading && styles.disabled
            ]}
            disabled={isLoading}
        >
            <Text style={[styles.text, textStyles]}>
                {title}
            </Text>

            {isLoading && (
                <ActivityIndicator
                    animating={isLoading}
                    color="#fff"
                    size="small"
                    style={styles.loading}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#b135c5',
        borderRadius: 10,
        minHeight: 62,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#F7E7CE',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
    },
    loading: {
        marginLeft: 8,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default CustomButton;
