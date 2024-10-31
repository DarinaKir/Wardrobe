import { StatusBar } from 'expo-status-bar';
import {Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useGlobalContext} from "../../context/GlobalProvider";
import {style} from "twrnc";
import {useContext, useEffect, useState} from "react";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import {serverConstants} from "../../constants/serverConstants";
import {router} from "expo-router";
import {errorMessages} from "../../constants/errorMessages";



function Profile() {
    const {setIsLogged, user, setUser} = useGlobalContext();
    const [isModifying, setIsModifying] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    // State to track if the input fields are disabled (checkbox status)
    const [isUsernameDisabled, setIsUsernameDisabled] = useState(false);
    const [isEmailDisabled, setIsEmailDisabled] = useState(false);
    const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [greeting, setGreeting] = useState('Hello');

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 4) {
            setGreeting('Good Night');
        }else if (currentHour < 12) {
            setGreeting('Good Morning');
        } else if (currentHour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    const onTextChange = (fieldName, value) => {
        setNewUser({
            ...newUser,
            [fieldName]: value, // Dynamically update the specific field
        });
    };

    const handlePress = () => {
        setIsModifying(!isModifying);
    };

    // Toggles the switch and clears input if the field is disabled
    const handleToggleSwitch = (fieldName, isEnabled) => {
        if (!isEnabled) {
            setNewUser({
                ...newUser,
                [fieldName]: '', // Clear the field when the switch is turned off
            });
        }
    };

    const submit = async () => {
        if (Object.values(newUser).some(value => value)) {
            setSubmitting(true);
            try {
                const response = await axios.post(`http://${serverConstants.serverIp}:${serverConstants.port}/modify-user`, null, {
                    params: {
                        //backend does not recognize sending 'user' directly, so we send its field
                        username: user.username,
                        //new fields to be updated if not empty
                        newEmail: newUser.email,
                        newPassword: newUser.password,
                        newUsername: newUser.username,
                    }
                });

                console.log(response.data);

                if (response.data.success) {
                    setUser(response.data.user)
                    console.log("user updated successfully!")
                    Alert.alert('Account Updated', "Your account details have been updated successfully!");
                    setNewUser({
                        username: "",
                        email: "",
                        password: "",
                    });
                    setIsEmailDisabled(false);
                    setIsPasswordDisabled(false);
                    setIsUsernameDisabled(false);
                } else {
                    if (errorMessages[response.data.errorCode]) {
                        Alert.alert('Error', errorMessages[response.data.errorCode]);
                    }
                }
            } catch (error) {
                console.error("Server Error", error);
                Alert.alert('Error', 'An error occurred while trying to submit.');
            } finally {
                setSubmitting(false);
            }
        } else {
            Alert.alert('Error', 'Please fill the fields you would like to modify.');
        }
    };

    const logout = () => {
        const user = {
            username: "",
            email: "",
            password: "",
        };
        setIsLogged(false);
        setUser(user);
        router.replace("/sign-in");
    };

    const confirmLogout = () => {
        Alert.alert(
            "Logout Confirmation", // כותרת
            "Are you sure you want to logout?", // הודעה
            [
                {
                    text: "Cancel", // טקסט הכפתור
                    onPress: () => console.log("Logout cancelled"), // פעולה במקרה של ביטול
                    style: "cancel", // סטייל הכפתור (Cancel)
                },
                {
                    text: "Logout", // טקסט הכפתור
                    onPress: () => logout(), // פעולה במקרה של אישור
                    style: "destructive", // סטייל הכפתור (Logout) כדי לתת תחושה הרסנית
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <ScrollView>
                    <Text style={styles.header}>
                        {greeting}, {user.username}!
                    </Text>
                    <Text>Here you can customize and manage your account easily.</Text>

                    <TouchableOpacity onPress={handlePress}>
                        <Text style={styles.details_button}>
                            Modify your account details here
                        </Text>
                    </TouchableOpacity>

                    {isModifying && (
                        <>
                            <View style={styles.inputContainer}>
                                <Switch style={styles.switch}
                                        value={isUsernameDisabled}
                                        onValueChange={() => {
                                            setIsUsernameDisabled(!isUsernameDisabled);
                                            handleToggleSwitch('username', !isUsernameDisabled);
                                        }}
                                />
                                <Text>Username:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => onTextChange('username', text)}
                                    value={newUser.username}
                                    placeholder="Enter new username"
                                    editable={isUsernameDisabled}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Switch style={styles.switch}
                                        value={isEmailDisabled}
                                        onValueChange={() => {
                                            setIsEmailDisabled(!isEmailDisabled);
                                            handleToggleSwitch('email', !isEmailDisabled);
                                        }}
                                />
                                <Text>Email:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => onTextChange('email', text)}
                                    value={newUser.email}
                                    placeholder="Enter new email"
                                    editable={isEmailDisabled}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Switch style={styles.switch}
                                        value={isPasswordDisabled}
                                        onValueChange={() => {
                                            setIsPasswordDisabled(!isPasswordDisabled);
                                            handleToggleSwitch('password', !isPasswordDisabled);
                                        }}
                                />
                                <Text>Password:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => onTextChange('password', text)}
                                    value={newUser.password}
                                    placeholder="Enter new password"
                                    secureTextEntry
                                    editable={isPasswordDisabled}
                                />
                            </View>
                            <View style={styles.submitButton}>
                                <CustomButton
                                    title="Submit"
                                    handlePress={submit}
                                    isLoading={isSubmitting}
                                />
                            </View>
                        </>
                    )}
                </ScrollView>

                {/* Logout Button */}
                <View style={styles.logoutButtonContainer}>
                    <CustomButton
                        title="Logout"
                        handlePress={confirmLogout} // קריאה לפונקציית האישור
                        containerStyles={styles.logoutButton}
                        textStyles={{color: "white"}}
                    />
                </View>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    details_button: {
        color: '#0000ff',
        marginTop: 20,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginLeft: 10,
        flex: 1,
    },
    switch: {
        marginRight: 20,
    },
    submitButton: {
        marginTop: 15,
    },
    submitText: {
        marginTop: 10,
    },
    logoutButtonContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end', // ממקם בתחתית המסך
        paddingVertical: 20,
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
});

export default Profile