import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal, Animated, Alert} from 'react-native';
import axios from "axios";
import {serverConstants} from '../../constants/serverConstants'
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

import {useGlobalContext} from "../contex/globalProvider";
import {useNavigation, useRouter} from "expo-router";
import {Cloudinary} from "cloudinary-core";


function Wardrobe() {
    const [outfitItems, setOutfitItems] = useState([]);
    const [imageUri, setImageUri] = useState(null); // משתנה לשמירת URI של התמונה שנבחרה
    const [modalVisible, setModalVisible] = useState(false); // משתנה לניהול מצב התצוגה של ה-Modal
    const [isExpanded, setIsExpanded] = useState(false); // ניהול מצב הרחבת הכפתורים
    const animationValue = useRef(new Animated.Value(0)).current; // ערך האנימציה

    const [suggestions, setSuggestions] = useState([]);
    const navigation = useNavigation();
    const router = useRouter();
    const {user} = useGlobalContext();

    // const [facing, setFacing] = useState('back');
    // const [photo, setPhoto] = useState(null);
    // const [uploadResult, setUploadResult] = useState(null);
    // const [photoUri, setPhotoUri] = useState(null)
    // const [permission, requestPermission] = useCameraPermissions();
    // const cameraRef = useRef(null);


    const cloudinary = new Cloudinary({cloud_name: 'dcfqbqckg', secure: true});




    useEffect(() => {

        if (!user) {
            console.log('User is not logged in yet');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    "http://" + serverConstants.serverIp + ":" + serverConstants.port + "/get-user-clothes",null,
                    { params: {userId: user.id.toString()} }
                );
                setOutfitItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <Image
            key={item.id}
            source={{ uri: "https://i.imgur.com/" + item.name + ".jpeg" }}
            style={styles.image}
        />
    );

    // useEffect(() => {
    //     console.log('PhotoUri state updated:', imageUri);
    // }, [imageUri]);

    useEffect(() => {
        (async () => {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            // setPermission(status === 'granted');
        })();
    }, []);

    // פונקציה לפתיחת גלריה ולבחירת תמונה
    const pickImage = async () => {
        // בקשת הרשאות גישה לגלריה
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        // פתיחת הגלריה ובחירת תמונה
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
            // quality: 1,
            allowsEditing: false, // לא מאפשר עריכת התמונה
            quality: 0.1, // איכות מלאה
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // שמירת ה-URI של התמונה
            setModalVisible(true); // סגירת ה-Modal
            toggleButtons(); // סגירת הכפתורים לאחר בחירת התמונה
        }
    };

    // פונקציה לפתיחת המצלמה ולצילום תמונה
    const takePhoto = async () => {
        const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermissionResult.granted === false) {
            alert("You've denied access to the camera.");
            return;
        }


        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.3,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setModalVisible(true);
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

    const upload = async () => {
        console.log("userId: " + user.id)
        let formData = new FormData();
        formData.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.png' });
        formData.append('userId', user.id.toString());
        try {
            const response = await axios.post("http://" + serverConstants.serverIp + ":" + serverConstants.port + '/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 10000, // הגדר זמן המתנה ל-10 שניות (10000 מילישניות)
            });
            const res = response.data;
            console.log('Image uploaded successfully,URL:', res);
            Alert.alert("Image uploaded successfully")

        } catch (error) {
            if (error.response) {
                console.log('Server responded with error:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error setting up request:', error.message);
            }
        }
    }

    // const renderItem = ({ item }) => (
    //     <View style={styles.row}>
    //         <Text style={styles.cell}>{item.type}</Text>
    //         <Text style={styles.cell}>{item.style}</Text>
    //         <Text style={styles.cell}>{item.color}</Text>
    //         <Text style={styles.cell}>{item.season}</Text>
    //         <Text style={styles.cell}>{item.description}</Text>
    //     </View>
    //
    // );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Wardrobe</Text>

            {imageUri && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={deleteImage} style={styles.deleteButton}>
                                    <MaterialIcons name="delete" size={30} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={upload} style={styles.sendButton}>
                                    <MaterialIcons name="send" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <FlatList
                data={outfitItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // To display two images per row
                contentContainerStyle={styles.imageList}
            />
            <StatusBar style="auto" />

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
        marginHorizontal: 5,
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
        marginHorizontal: 5,
    },
    buttonContainer: {
        flexDirection: 'row', // ודא שהכפתורים יהיו בשורה
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20, // רווח מעל הכפתורים
    },
    imageList:{
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Wardrobe;
