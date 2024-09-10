import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import axios from "axios";
import {errorMessages} from '../../constants/errorMessages'

const SignIn = () => {
    const serverIp = "192.168.238.156";
    const port = "9128";
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        if (form.email && form.password) {
            setSubmitting(true);
            try {
                const response = await axios.post("http://" + serverIp + ":" + port + "/login", null, {
                    params: {
                        email: form.email,
                        password: form.password,
                    }
                });

                console.log(response.data);

                if (response.data.success) {
                    router.replace("/home");
                } else {
                    if (errorMessages[response.data.errorCode]) {
                        Alert.alert('Error', errorMessages[response.data.errorCode]);
                    }
                }
            } catch (error) {
                console.error("Server Error", error);
                Alert.alert('Error', 'An error occurred while trying to log in.');
            } finally {
                setSubmitting(false);
            }
        } else {
            Alert.alert('Error', 'Please fill in all the fields');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.innerContainer}>
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        style={styles.logo}
                    />

                    <Text style={styles.title}>
                        Log in to Wardrobe
                    </Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        isLoading={isSubmitting}
                    />

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            style={styles.signupLink}
                        >
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7E7CE',
    },
    innerContainer: {
        width: '100%',
        justifyContent: 'center',
        minHeight: Dimensions.get("window").height - 100,
        paddingHorizontal: 16,
        marginVertical: 24,
    },
    logo: {
        width: 200,
        height: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        marginTop: 40,
        fontFamily: 'Poppins-SemiBold',
    },
    signupContainer: {
        justifyContent: 'center',
        paddingTop: 20,
        flexDirection: 'row',
        gap: 8,
    },
    signupText: {
        fontSize: 16,
        color: '#7B7B8B',
        fontFamily: 'Poppins-Regular',
    },
    signupLink: {
        fontSize: 18,
        fontWeight: '600',
        color: '#B135C5',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default SignIn;
