import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Modal, Animated, ActivityIndicator, Alert} from 'react-native';
import axios from "axios";
import {serverConstants} from '../../constants/serverConstants'
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import {useGlobalContext} from "../../context/GlobalProvider";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import ImageList from "../../components/ImageList";
import OutfitFilter from "../../components/OutfitFilter";
import RefreshButton from "../../components/RefreshButton";



function Wardrobe() {
    const [outfitItems, setOutfitItems] = useState([]);
    const [imageUri, setImageUri] = useState(null); // משתנה לשמירת URI של התמונה שנבחרה
    const [modalVisible, setModalVisible] = useState(false); // משתנה לניהול מצב התצוגה של ה-Modal
    const [isExpanded, setIsExpanded] = useState(false); // ניהול מצב הרחבת הכפתורים
    const animationValue = useRef(new Animated.Value(0)).current; // ערך האנימציה
    const {user} = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false); // מצב טעינה להצגת התמונה
    const [isUploading, setIsUploading] = useState(false); // מצב טעינה להעלאת התמונה
    const [filteredItems, setFilteredItems] = useState(outfitItems);
    const filterRef = useRef(null); // יצירת רפרנס ל-OutfitFilter

    const handleFilter = (filteredItems) => {
        setFilteredItems(filteredItems);
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    "http://" + serverConstants.serverIp + ":" + serverConstants.port + "/get-user-clothes",null,
                    { params: {userId: user.id.toString()} }
                );
                setOutfitItems(response.data);
                setFilteredItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [imageUri, setOutfitItems]);

    const refreshData = async () => {
        setFilteredItems(outfitItems); // מחזיר את כל האייטמים
        if (filterRef.current) {
            filterRef.current.resetFilters(); // קריאה לפונקציה resetFilters
        }
    };

    // פונקציה להפחתת גודל התמונה כך שתהיה קרובה ל-2MB
    const reduceImageSize = async (uri) => {
        const targetSize = 2 * 1024 * 1024; // 2MB בבתים
        let quality = 1; // להתחיל באיכות מלאה
        let imageInfo = await FileSystem.getInfoAsync(uri);

        // לולאה להקטנת איכות התמונה עד לגודל הקרוב ל-2MB
        while (imageInfo.size > targetSize && quality > 0.1) {
            quality -= 0.1;
            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [], // אין צורך בשינוי רזולוציה בשלב זה
                { compress: quality } // דחיסת התמונה
            );
            imageInfo = await FileSystem.getInfoAsync(manipResult.uri);
            uri = manipResult.uri;
        }

        return { uri, size: imageInfo.size };
    };

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
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setModalVisible(true);
            setIsLoading(true); // התחלת טעינה
            // דחיסת התמונה ושינוי האיכות שלה ל-2MB או פחות
            const { uri, size } = await reduceImageSize(result.assets[0].uri);
            console.log(`Final image size: ${size} bytes`); // הדפסה של הגודל הסופי
            setImageUri(uri);
            setIsLoading(false); // סיום טעינה
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
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setModalVisible(true);
            setIsLoading(true); // התחלת טעינה
            // דחיסת התמונה ושינוי האיכות שלה ל-2MB או פחות
            const { uri, size } = await reduceImageSize(result.assets[0].uri);
            console.log(`Final image size: ${size} bytes`); // הדפסה של הגודל הסופי
            setImageUri(uri);
            setIsLoading(false); // סיום טעינה
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
        setModalVisible(false);
        setImageUri(null);
    };

    const upload = async () => {
        setIsUploading(true); // התחלת טעינה בעת ההעלאה
        console.log("userId: " + user.id)
        let formData = new FormData();
        formData.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.png' });
        formData.append('userId', user.id.toString());
        try {
            const response = await axios.post("http://" + serverConstants.serverIp + ":" + serverConstants.port + '/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const res = response.data;
            setModalVisible(false);
            setImageUri(null);
            setIsUploading(false); // סיום טעינה
            console.log('Image uploaded successfully,URL:', res);
            Alert.alert(
                "Image Upload",
                "Your image has been uploaded successfully!",
                [{ text: "OK", style: "default" }]
            );
        } catch (error) {
            setIsUploading(false); // סיום טעינה
            if (error.response) {
                console.log('Server responded with error:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error setting up request:', error.message);
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Wardrobe</Text>
            <RefreshButton onRefresh={refreshData} />

            {modalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {isLoading ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#565867"
                                    style={[styles.loader, { transform: [{ scale: 1.5 }] }]} // כאן מוגדל האייקון
                                />
                            ) : (
                                <>
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={styles.modalImage}
                                        resizeMode="contain"
                                    />
                                    {isUploading ? (
                                        <View style={styles.loaderContainer}>
                                            <ActivityIndicator
                                                size="large"
                                                color="#565867"
                                                style={[{ transform: [{ scale: 1.2 }] }]} // גם כאן האייקון מוגדל
                                            />
                                            <Text style={styles.loadingText}>Uploading ...</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity onPress={deleteImage} style={styles.deleteButton}>
                                                <MaterialIcons name="delete" size={30} color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={upload} style={styles.saveButton}>
                                                <MaterialIcons name="save" size={30} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
            {/* הוספת קומפוננטת סינון */}
            <OutfitFilter ref={filterRef} outfitItems={outfitItems} onFilter={handleFilter} />
            {
                filteredItems.length === 0 ? (
                    <View style={styles.centeredContainer}>
                        <Text style={styles.noItemsText}>No items available ...</Text>
                    </View>                ) : (
                    <ImageList outfitItems={filteredItems} setOutfitItems={setOutfitItems} />
                )
            }

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
    modalImage: {
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
        backgroundColor: '#565867',
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
        backgroundColor: '#8354bf',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,       // הצללה כדי להבליט את הכפתור
    },
    iconButtonSquare: {
        backgroundColor: '#a96cf8',
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
    saveButton: {
        backgroundColor: '#899fe1', // Choose a color for the send button
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
    loader: {
        marginBottom: 20,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center', // ממרכז את הטקסט אנכית
        alignItems: 'center', // ממרכז את הטקסט אופקית
        marginTop: -50,
    },
    noItemsText: {
        fontSize: 20, // מגדיל את גודל הפונט
        fontWeight: 'bold', // מדגיש את הטקסט
    },
});

export default Wardrobe;
