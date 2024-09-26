import React, { useState } from 'react';
import {FlatList, Image, StyleSheet, View, Modal, TouchableOpacity, Alert} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import {serverConstants} from "../constants/serverConstants";

const ImageList = ({ outfitItems, setOutfitItems }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const numColumns = 4; // Number of columns


    // Open the modal with the clicked image
    const openImage = (index) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    };

    // Close the modal
    const closeModal = () => {
        setModalVisible(false);
    };

    // Navigate to the previous image
    const goToPreviousImage = () => {
        // const newIndex = selectedImageIndex === 0 ? outfitItems.length - 1 : selectedImageIndex - 1;
        // setSelectedImageIndex(newIndex);
        if (selectedImageIndex > 0) { // הוסף בדיקה
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    // Navigate to the next image
    const goToNextImage = () => {
        // const newIndex = selectedImageIndex === outfitItems.length - 1 ? 0 : selectedImageIndex + 1;
        // setSelectedImageIndex(newIndex);
        if (selectedImageIndex < outfitItems.length - 1) { // הוסף בדיקה
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => openImage(index)}>
            <Image
                key={item.id}
                source={{ uri: "https://i.imgur.com/" + item.name + ".jpeg" }}
                style={styles.image}
            />
        </TouchableOpacity>
    );

    const confirmDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this image?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: handleDelete,
                },
            ]
        );
    };

    const handleDelete = async () => {
        try {
            const imageId = outfitItems[selectedImageIndex].id;

            // Make the API call to delete the image
            const response = await axios.post(`http://${serverConstants.serverIp}:${serverConstants.port}/delete-image`, {
                    imageId: imageId
            });

            if (response.status === 200) {
                // Successfully deleted, close the modal and refresh the list
                closeModal();
                // Filter out the deleted item from the list
                const updatedItems = outfitItems.filter(item => item.id !== imageId);
                setOutfitItems(updatedItems); // Set new state
            } else {
                console.error('Failed to delete the image');
            }
        } catch (error) {
            console.error('Error during deletion:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
            <FlatList
                key={numColumns}
                data={outfitItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                contentContainerStyle={styles.imageList}
                // הגדרת גובה קבוע ל-FlatList
                style={{ flexGrow: 1 }} // מאפשר ל-FlatList לגדול על פי התוכן
            />

            <Modal visible={modalVisible} transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <MaterialIcons name="close" size={40} color='rgba(255,255,255,0.7)' />
                    </TouchableOpacity>

                    {outfitItems.length > 0 && (
                        <Image
                            source={{ uri: "https://i.imgur.com/" + outfitItems[selectedImageIndex]?.name + ".jpeg" }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    )}

                    {/* Delete Button */}
                    <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                        <MaterialIcons name="delete" size={40} color="white" />
                    </TouchableOpacity>

                    <View style={styles.navigationContainer}>
                        <View style={styles.arrowContainer}>
                            <View style={selectedImageIndex > 0 ? styles.arrowButton : {}}>
                                {selectedImageIndex > 0 && (
                                    <TouchableOpacity onPress={goToPreviousImage}>
                                        <MaterialIcons name="arrow-back" size={40} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={selectedImageIndex < outfitItems.length - 1 ? styles.arrowButton : {}}>
                                {selectedImageIndex < outfitItems.length - 1 && (
                                    <TouchableOpacity onPress={goToNextImage}>
                                        <MaterialIcons name="arrow-forward" size={40} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1, // יחס 1:1
        width: '22%',
        height: 78,
        margin: 1,
        borderRadius: 10, // עיגול פינות
        borderWidth: 2,
        borderColor: '#ddd', // מסגרת בהירה
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 4,
    },
    imageList: {
        // justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: 20, // מרווח בתחתית
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        borderRadius: 15, // עיגול פינות לתמונה במודל
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        // right: 35,
        left: 33,
        zIndex: 1,
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 30,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    arrowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    arrowButton: {
        width: 60,
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.31)', // חצים על רקע בהיר
        borderRadius: 30, // עיגול לפינות הכפתור
        opacity: 0.8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 1, height: 2 },
        shadowRadius: 3,
    },
    deleteButton: {
        position: 'absolute',
        bottom: 30, // שינוי המיקום לפי הצורך
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // צבע אדום עם שקיפות
        padding: 15,
        borderRadius: 30, // עיגול לפינות
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100, // רוחב קבוע
        alignSelf: 'center', // למרכז את הכפתור
    },
});

export default ImageList;