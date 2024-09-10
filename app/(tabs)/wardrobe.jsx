import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, Alert, FlatList} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import {serverConstants} from '../../constants/serverConstants'
import {SafeAreaView} from "react-native-safe-area-context";

function Wardrobe() {
    const [outfitItems, setOutfitItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://" + serverConstants.serverIp + ":" + serverConstants.port + "/get-outfit-items");
                setOutfitItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);





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
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
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
