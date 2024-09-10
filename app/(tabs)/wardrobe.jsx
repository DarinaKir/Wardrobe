import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, Alert, FlatList} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";

function Wardrobe() {
    const [outfitItems, setOutfitItems] = useState([]);

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const serverIp = "192.168.238.156";
    const port = "9128";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://" + serverIp + ":" + port + "/get-outfit-items");
                setOutfitItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const predefinedOptions = [
        { label: 'Vacation', value: 'vacation' },
        { label: 'Party', value: 'party' },
        { label: 'Date', value: 'date' },
        { label: 'Studies', value: 'studies' },
    ];

    const handleSelectItem = async () => {
        // Alert.alert("Option selected", `You selected: ${selectedOption}`);
        // setPickerVisible(false);
        try {
            const response = await axios.post("http://" + serverIp + ":" + port + "/get-outfit-suggestions", {
                occasion: selectedOption
            });
            setSuggestions(response.data); // מציג את התוצאה שהשרת החזיר
            Alert.alert("Suggestions received", `Suggestions: ${JSON.stringify(suggestions)}`);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            Alert.alert("Error", "Failed to fetch suggestions from the server");
        }

        setPickerVisible(false);


    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.type}</Text>
            <Text style={styles.cell}>{item.style}</Text>
            <Text style={styles.cell}>{item.color}</Text>
            <Text style={styles.cell}>{item.season.join(', ')}</Text>
            <Text style={styles.cell}>{item.description}</Text>
        </View>

    );

    // return (
    //     <View style={styles.container}>
    //         <Text style={styles.header}>Wardrobe</Text>
    //         <View style={styles.table}>
    //             <View style={styles.row}>
    //                 <Text style={styles.headerCell}>Type</Text>
    //                 <Text style={styles.headerCell}>Style</Text>
    //                 <Text style={styles.headerCell}>Color</Text>
    //                 <Text style={styles.headerCell}>Season</Text>
    //                 <Text style={styles.headerCell}>Description</Text>
    //             </View>
    //             <FlatList
    //                 data={outfitItems}
    //                 renderItem={renderItem}
    //                 keyExtractor={(item) => item.id.toString()}
    //             />
    //
    //         </View>
    //         <StatusBar style="auto" />
    //     </View>
    // );

    return (
        <View style={styles.container}>

            <Button title="Outfit Suggestion" onPress={() => setPickerVisible(true)} />

            {isPickerVisible && (
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedOption}
                        onValueChange={(itemValue) => setSelectedOption(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select an item" value="" />
                        {predefinedOptions.map((option, index) => (
                            <Picker.Item key={index} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                    <Button title="Submit" onPress={handleSelectItem} />
                </View>
            )}

            <Text style={styles.header}>Wardrobe</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>Type</Text>
                    <Text style={styles.headerCell}>Style</Text>
                    <Text style={styles.headerCell}>Color</Text>
                    <Text style={styles.headerCell}>Season</Text>
                    <Text style={styles.headerCell}>Description</Text>
                </View>
                <FlatList
                    data={outfitItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
});

export default Wardrobe;
