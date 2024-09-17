import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal} from 'react-native';
import axios from "axios";
import {serverConstants} from '../../constants/serverConstants'
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

function Wardrobe() {
    const [outfitItems, setOutfitItems] = useState([]);
    const [imageUri, setImageUri] = useState(null); // משתנה לשמירת URI של התמונה שנבחרה
    const [modalVisible, setModalVisible] = useState(false); // משתנה לניהול מצב התצוגה של ה-Modal


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


    // פונקציה לפתיחת גלריה ולבחירת תמונה
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
            // quality: 1,
            allowsEditing: false, // לא מאפשר עריכת התמונה
            quality: 1, // איכות מלאה
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // שמירת ה-URI של התמונה
            setModalVisible(false); // סגירת ה-Modal
        }
    };

    // פונקציה לפתיחת המצלמה ולצילום תמונה
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setModalVisible(false);
        }
    };

    // פונקציה למחיקת התמונה
    const deleteImage = () => {
        setImageUri(null);
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Wardrobe</Text>

            {/*/!* כפתור מותאם אישית *!/*/}
            {/*<TouchableOpacity onPress={pickImage} style={styles.button}>*/}
            {/*    <Text style={styles.buttonText}>Pick an image from gallery</Text>*/}
            {/*</TouchableOpacity>*/}

            {/*/!* כפתור לצילום תמונה *!/*/}
            {/*<TouchableOpacity onPress={takePhoto} style={styles.button}>*/}
            {/*    <Text style={styles.buttonText}>Take a photo</Text>*/}
            {/*</TouchableOpacity>*/}

            {/* כפתור לפתיחת ה-Modal */}
            <View style={styles.centeredButtonContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
                    <MaterialIcons name="add-photo-alternate" size={30} color="white" />
                </TouchableOpacity>
            </View>

            {/* Modal עם שני הכפתורים */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={pickImage} style={styles.iconButtonSquare}>
                                <MaterialIcons name="photo-library" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takePhoto} style={styles.iconButtonSquare}>
                                <MaterialIcons name="camera-alt" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.iconButtonSquare}>
                                <MaterialIcons name="close" size={30} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {imageUri && (
                <View style={styles.centeredButtonContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="contain" // שימוש ב-resizeMode כדי להציג את כל התמונה
                    />
                    <TouchableOpacity onPress={deleteImage} style={styles.deleteButton}>
                        <MaterialIcons name="delete" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            )}

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

        justifyContent: 'center', // הכפתורים יהיו ממורכזים בשורה
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
    image: {
        width: '100%',  // התמונה תתפרס על כל הרוחב הזמין
        height: 300,    // גובה קבוע של 300 פיקסלים (אפשר לשנות בהתאם לצרכים שלך)
        marginTop: 20,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '80%',
    },
    deleteButton: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        marginBottom: 20,
    },
    iconButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    iconButtonSquare: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        marginHorizontal: 10, // מרווח בין הכפתורים בשורה
    },
    centeredButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Wardrobe;
