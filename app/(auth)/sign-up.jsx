import {useState} from "react";
import { Link, router } from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet} from "react-native";

import {images} from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import axios from 'axios';
import {serverConstants} from '../../constants/serverConstants'
import {errorMessages} from "../../constants/errorMessages";
import {useGlobalContext} from "../../context/GlobalProvider";

const SignUp = () => {
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const { setUser, setIsLogged } = useGlobalContext();

    const submit = async () => {
        if (form.username && form.email && form.password) {
            setSubmitting(true);
            try {
                const response = await axios.post(`http://${serverConstants.serverIp}:${serverConstants.port}/sign-up`, null, {
                    params: {
                        username: form.username,
                        email: form.email,
                        password: form.password,
                    }
                });

                console.log(response.data);

                if (response.data.success) {
                    setUser(response.data.user);
                    setIsLogged(true);
                    router.replace("/home");
                } else {
                    if (errorMessages[response.data.errorCode]) {
                        Alert.alert('Error', errorMessages[response.data.errorCode]);
                    }
                }
            } catch (error) {
                console.error("Server Error", error);
                Alert.alert('Error', 'Server Error');
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
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>

                    <Text style={styles.title}>
                        Log up to ChicPick
                    </Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) => setForm({...form, username: e})}
                    />

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({...form, email: e})}
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({...form, password: e})}
                    />

                    <CustomButton
                        title="Sign Up"
                        handlePress={submit}
                        isLoading={isSubmitting}
                    />

                    <View style={styles.signinContainer}>
                        <Text style={styles.signinText}>
                            Have an account already?
                        </Text>
                        <Link
                            href="/sign-in"
                            style={styles.signinLink}
                        >
                            Sign in
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
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        marginTop: 40,
        fontFamily: 'Poppins-SemiBold',
    },
    signinContainer: {
        justifyContent: 'center',
        paddingTop: 20,
        flexDirection: 'row',
        gap: 8,
    },
    signinText: {
        fontSize: 16,
        color: '#7B7B8B',
        fontFamily: 'Poppins-Regular',
    },
    signinLink: {
        fontSize: 18,
        fontWeight: '600',
        color: '#B135C5',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default SignUp;
