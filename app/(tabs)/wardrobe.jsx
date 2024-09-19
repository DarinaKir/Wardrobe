import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal, Animated, Alert} from 'react-native';
import axios from "axios";
import {serverConstants} from '../../constants/serverConstants'
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

function Wardrobe() {
    const [outfitItems, setOutfitItems] = useState([]);
    const [imageUri, setImageUri] = useState(null); // משתנה לשמירת URI של התמונה שנבחרה
    // const [modalVisible, setModalVisible] = useState(false); // משתנה לניהול מצב התצוגה של ה-Modal
    const [isExpanded, setIsExpanded] = useState(false); // ניהול מצב הרחבת הכפתורים
    const animationValue = useRef(new Animated.Value(0)).current; // ערך האנימציה
    // const [loading, setLoading] = useState(false);

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
            // setModalVisible(false); // סגירת ה-Modal
            toggleButtons(); // סגירת הכפתורים לאחר בחירת התמונה
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
            // setModalVisible(false);
            toggleButtons(); // סגירת הכפתורים לאחר בחירת התמונה
        }
    };

    const toggleButtons = () => {
        setIsExpanded(!isExpanded);
        Animated.timing(animationValue, {
            toValue: isExpanded ? 0 : 1, // אם פתוח סוגר ולהיפך
            duration: 300, // משך האנימציה
            useNativeDriver: false, // נשתמש במנוע של React Native
        }).start();
    };

    const libraryButtonPositionY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -70],
    });

    const libraryButtonPositionX = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -5],
    });

    const cameraButtonPositionY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -40],
    });

    const cameraButtonPositionX = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -57],
    });

    // פונקציה למחיקת התמונה
    const deleteImage = () => {
        setImageUri(null);
    };

// // Function to handle sending the URI
//     const sendImageUri = async () => {
//         if (!imageUri) {
//             Alert.alert("No Image", "Please select an image first.");
//             return;
//         }
//         const formData = new FormData();
//         formData.append('photo', {
//             uri: imageUri,
//             type: 'image/jpeg', // Make sure to set the correct MIME type
//             name: 'photo.jpg', // or whatever name you want
//         });
//         setLoading(true);
//         try {
//             const response = await axios.post(`http://${serverConstants.serverIp}:${serverConstants.port}/upload-image`,{
//                 uri: imageUri,
//             });
//             Alert.alert('Success', 'Image sent successfully!');
//             Alert.alert(imageUri + ", ");
//         } catch (error) {
//             Alert.alert('Error', 'Failed to send the image.');
//         } finally {
//             setLoading(false);
//         }
//     };

    const sendImage = async () => {
        if (!imageUri) {
            Alert.alert('No Image', 'Please select an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', {
            uri: imageUri,
            type: 'image/jpeg', // Ensure this matches the actual MIME type
            name: 'photo.jpg', // Or any name you prefer
        });

        try {
            const response = await axios.post(`http://${serverConstants.serverIp}:${serverConstants.port}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Success', 'Image sent successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to send the image.');
        }
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

            {/*/!* Modal עם שני הכפתורים *!/*/}
            {/*<Modal*/}
            {/*    animationType="slide"*/}
            {/*    transparent={true}*/}
            {/*    visible={modalVisible}*/}
            {/*    onRequestClose={() => setModalVisible(false)}*/}
            {/*>*/}
            {/*    <View style={styles.modalContainer}>*/}
            {/*        <View style={styles.modalContent}>*/}
            {/*            <View style={styles.row}>*/}
            {/*                <TouchableOpacity onPress={pickImage} style={styles.iconButtonSquare}>*/}
            {/*                    <MaterialIcons name="photo-library" size={30} color="white" />*/}
            {/*                </TouchableOpacity>*/}
            {/*                <TouchableOpacity onPress={takePhoto} style={styles.iconButtonSquare}>*/}
            {/*                    <MaterialIcons name="camera-alt" size={30} color="white" />*/}
            {/*                </TouchableOpacity>*/}
            {/*                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.iconButtonSquare}>*/}
            {/*                    <MaterialIcons name="close" size={30} color="white" />*/}
            {/*                </TouchableOpacity>*/}
            {/*            </View>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</Modal>*/}


            {/*{imageUri && (*/}
            {/*    <View style={styles.centeredButtonContainer}>*/}
            {/*        <Image*/}
            {/*            source={{ uri: imageUri }}*/}
            {/*            style={styles.image}*/}
            {/*            resizeMode="contain" // שימוש ב-resizeMode כדי להציג את כל התמונה*/}
            {/*        />*/}
            {/*        <TouchableOpacity onPress={deleteImage} style={styles.deleteButton}>*/}
            {/*            <MaterialIcons name="delete" size={30} color="white" />*/}
            {/*        </TouchableOpacity>*/}
            {/*    </View>*/}
            {/*)}*/}

            {imageUri && (
                <View style={styles.centeredButtonContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <TouchableOpacity onPress={deleteImage} style={styles.deleteButton}>
                        <MaterialIcons name="delete" size={30} color="white" />
                    </TouchableOpacity>
                    {/*<TouchableOpacity onPress={sendImageUri} style={styles.button} disabled={loading}>*/}
                    {/*    <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send'}</Text>*/}
                    {/*</TouchableOpacity>*/}
                    <TouchableOpacity onPress={sendImage} style={styles.sendButton}>
                        <MaterialIcons name="send" size={30} color="white" />
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

            {/*/!* כפתור לפתיחת ה-Modal *!/*/}
            {/*<TouchableOpacity onPress={() => setModalVisible(true)} style={styles.floatingButton}>*/}
            {/*    <MaterialIcons name="add-photo-alternate" size={24} color="white" />*/}
            {/*</TouchableOpacity>*/}

            {/* כפתור בחירת תמונה */}
            <Animated.View style={[styles.animatedButton, { transform: [{ translateX: libraryButtonPositionX }, {translateY: libraryButtonPositionY}] }]}>
                <TouchableOpacity onPress={pickImage} style={styles.iconButtonSquare}>
                    <MaterialIcons name="photo-library" size={24} color="white" />
                </TouchableOpacity>
            </Animated.View>

            {/* כפתור צילום תמונה */}
            <Animated.View style={[styles.animatedButton, { transform: [{ translateX: cameraButtonPositionX }, {translateY: cameraButtonPositionY}] }]}>
                <TouchableOpacity onPress={takePhoto} style={styles.iconButtonSquare}>
                    <MaterialIcons name="camera-alt" size={24} color="white" />
                </TouchableOpacity>
            </Animated.View>

            {/* הכפתור הראשי */}
            <TouchableOpacity onPress={toggleButtons} style={styles.floatingButton}>
                <MaterialIcons name={isExpanded ? "close" : "add-photo-alternate"} size={34} color="white" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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
    // modalContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    // },
    // modalContent: {
    //     backgroundColor: '#fff',
    //     borderRadius: 10,
    //     padding: 20,
    //     alignItems: 'center',
    //     width: '80%',
    // },
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
    floatingButton: {
        position: 'absolute',
        bottom: 10,         // מיקום תחתון
        right: 10,          // מיקום מימין
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,       // הצללה כדי להבליט את הכפתור
        // zIndex: 999,        // תמיד למעלה
    },
    iconButtonSquare: {
        backgroundColor: '#469efb',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        marginHorizontal: 10, // מרווח בין הכפתורים בשורה
    },
    centeredButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedButton: {
        position: 'absolute',
        bottom: 10,
        right: 5,
    },
    sendButton: {
        backgroundColor: '#28a745', // Choose a color for the send button
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        marginBottom: 20,
    },
});

export default Wardrobe;
