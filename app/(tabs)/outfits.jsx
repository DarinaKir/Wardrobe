import {Alert, StyleSheet, Text, View, TextInput} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState} from "react";
import axios from "axios";
import {serverConstants} from "../../constants/serverConstants";
import CustomButton from "../../components/CustomButton";

function Outfits() {
    const [selectedOption, setSelectedOption] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const occasionOptions = ["Vacation","Party","Date","Studies"];


    const handleSelectItem = async (occasion) => {
        Alert.alert("Option selected", `You selected: ${occasion}`);
        console.log(occasion)

        try {
            const response = await axios.post("http://" + serverConstants.serverIp + ":" + serverConstants.port + "/get-outfit-suggestions", {
                occasion: selectedOption
            });
            setSuggestions(response.data);
            console.log(suggestions);
            Alert.alert("Suggestions received", `Suggestions: ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            Alert.alert("Error", "Failed to fetch suggestions from the server");
        }
    };
    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.header}>Outfits</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Where will you wear this outfit?"
                    onChangeText={newText => setSelectedOption(newText)}
                    value={selectedOption}
                />
                <CustomButton title="Submit"
                              handlePress={()=> handleSelectItem(selectedOption)}
                              containerStyles={{minHeight: 50,borderRadius: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10}}
                              textStyles={{fontSize: 13, padding:2}}/>
            </View>

            <View style={styles.buttonContainer}>
            {
                occasionOptions.map((option,id) => {
                    return <CustomButton key={id}
                                         title={option}
                                         handlePress={()=> handleSelectItem(option)}
                                         containerStyles={{margin: 5,minHeight: 10,alignSelf: 'flex-start',borderRadius: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10,borderBottomLeftRadius: 10, backgroundColor:'#FFFFFF',borderWidth: 1, borderColor: '#b135c5'}}
                                         textStyles={{fontSize: 13, padding:3,color: '#b135c5',}}/>
                })
            }
            </View>
            {/*<Text>{suggestions}</Text>*/}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 5,
    },
    headerCell: {
        flex: 1,
        padding: 5,
        fontWeight: 'bold',
    },
    pickerContainer: {
        marginTop: 20,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    textInput: {
        flex: 1,
        height: 50,
        borderColor: '#b135c5',
        borderWidth: 1,
        fontSize:15,
        paddingHorizontal: 10,
        borderBottomLeftRadius:10,
        // borderTopLeftRadius:10,
    },
});

export default Outfits

