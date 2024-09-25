import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ImageList = ({ outfitItems }) => {
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


    return (
        <View>
            <FlatList
                key={numColumns} // Add key prop based on numColumns
                data={outfitItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                contentContainerStyle={styles.imageList}
            />

            <Modal visible={modalVisible} transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <MaterialIcons name="close" size={40} color="white" />
                    </TouchableOpacity>

                    {outfitItems.length > 0 && (
                        <Image
                            source={{ uri: "https://i.imgur.com/" + outfitItems[selectedImageIndex]?.name + ".jpeg" }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    )}

                    <View style={styles.navigationContainer}>
                        <View style={styles.arrowContainer}>
                            <View style={styles.arrowButton}>
                                {selectedImageIndex > 0 && (
                                    <TouchableOpacity onPress={goToPreviousImage}>
                                        <MaterialIcons name="arrow-back" size={40} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.arrowButton}>
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
        width: 80,
        height: 80,
        margin: 3,
    },
    imageList: {
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 12,
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
        width: 60, // הגדר רוחב קבוע עבור הכפתורים
        alignItems: 'center',
    },
});

export default ImageList;