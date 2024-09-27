import { StatusBar } from 'expo-status-bar';
import {Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useGlobalContext} from "../../context/GlobalProvider";
import {style} from "twrnc";
import {useContext, useState} from "react";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import {serverConstants} from "../../constants/serverConstants";
import {router} from "expo-router";
import {errorMessages} from "../../constants/errorMessages";



function Profile() {
    const {user, setUser} = useGlobalContext();
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
                const response = await axios.post(`http://${serverConstants.serverIp}:${serverConstants.port}/`, null, {
                    params: {
                        email: newUser.email,
                        password: newUser.password,
                        username: newUser.username,
                    }
                });

                console.log(response.data);

                if (response.data.success) {
                    setUser(response.data.user)
                    console.log("user updated successfully!")
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



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.header}>
                    Hello, {user.username}!</Text>
                <Text> Here you can customize and manage your account easily. </Text>

                <TouchableOpacity onPress={handlePress}>
                    <Text style={styles.details_button}>
                        Modify your account details here
                    </Text>
                </TouchableOpacity>

                {
                    isModifying && (
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
                                    editable={isUsernameDisabled} // Disable if the checkbox is checked
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
                                    editable={isEmailDisabled} // Disable if the checkbox is checked
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
                                    editable={isPasswordDisabled} // Disable if the checkbox is checked
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
                    )
                }

            </ScrollView>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
        flexDirection: 'row',  // Aligns children of View in a horizontal row
        alignItems: 'center',  // Centers children vertically in the container
        margin: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginLeft: 10,  // Adds spacing between the label and the input box
        flex: 1,  // Takes up the remaining space in the row
    },
    switch: {
        marginRight: 20,
    },
    submitButton: {
        marginTop: 15,
    }

});



export default Profile

