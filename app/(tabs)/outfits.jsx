import {Alert, StyleSheet, Text, View, TextInput, FlatList, Image, Modal, ActivityIndicator, Animated} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {serverConstants} from "../../constants/serverConstants";
import CustomButton from "../../components/CustomButton";
import {useGlobalContext} from "../../context/GlobalProvider";
import RefreshButton from "../../components/RefreshButton";


function Outfits() {
    const [selectedOption, setSelectedOption] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const occasionOptions = ["Vacation", "Party", "Date", "Studies"];
    const typeOfStyle = ["Elegant", "Casual", "Bohemian", "Formal"]
    const [selectedStyles, setSelectedStyles] = useState("")
    const {user, outfitItems} = useGlobalContext();
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(false); // מצב טעינה


    const handleSelectItem = async (occasion) => {
        // Alert.alert("Option selected", `You selected: ${occasion}`);
        console.log(occasion);
        setLoading(true); // הפעלת מצב טעינה
        try {
            const response = await axios.post("http://" + serverConstants.serverIp + ":" + serverConstants.port + "/get-outfit-suggestions", null,
                {
                    params: {
                        occasion: selectedOption,
                        userId: user.id.toString(),
                        style:selectedStyles,
                    }
                });
            setSuggestions(response.data);
            console.log(suggestions);
            // Alert.alert("Suggestions received", `Suggestions: ${JSON.stringify(response.data)}`);
            console.log(JSON.stringify(response.data))


            const responseData = JSON.stringify(response.data);

            const parsedData = JSON.parse(responseData);

            const allNames = parsedData.map(outfitSet => {
                return outfitSet.outfit.map(item => item.name);
            });

            setNames(allNames);
            console.log(allNames);
            setSelectedOption(occasion);
            setSelectedStyles("");
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            Alert.alert("Error", "Failed to fetch suggestions from the server");
        } finally {
            setLoading(false); // הפסקת מצב טעינה
        }
    };

    const selectStyle = (style) => {
        if (selectedStyles.length === 0) {
            setSelectedStyles(style)
        }else {
            if (selectedStyles.includes(style)) {
                let words = selectedStyles.split('/');
                words = words.filter(word => word !== style);
                setSelectedStyles(words.join('/'));
            }else {
                setSelectedStyles(selectedStyles + "/" + style)
            }
        }
    }
    // יצירת URLs לתמונות עבור כל פריט
    const generateImageUrls = (outfit) => {
        return outfit.map(name => `https://i.imgur.com/${name}.jpeg`);
    };

    const OutfitItem = ({ imageUrl }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            {/*<Text>hi</Text>*/}
        </View>
    );

    const OutfitSuggestion = ({ outfit }) => {
        const imageUrls = generateImageUrls(outfit);
        return (
            <View style={styles.outfitContainer}>
                <FlatList
                    horizontal
                    data={imageUrls}
                    renderItem={({ item }) => <OutfitItem imageUrl={item} />}
                    keyExtractor={(item) => item}
                    style={styles.outfitList}
                />
            </View>
        );
    };

    // פונקציה לריענון
    const handleRefresh = () => {
        setSelectedOption("");
        setSuggestions([]);
        setNames([]);
        // Alert.alert("Refreshed", "The data has been reset.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Outfits</Text>
            <RefreshButton onRefresh={handleRefresh} />
            <Text style={styles.subtitle}>Where will you wear this outfit?</Text>

            <View style={styles.buttonContainer}>
                {
                    occasionOptions.map((option, id) => {
                        return <CustomButton key={id}
                                             title={option}
                                             handlePress={() => handleSelectItem(option)}
                                             containerStyles={{
                                                 margin: 5,
                                                 minHeight: 10,
                                                 alignSelf: 'flex-start',
                                                 borderRadius: 0,
                                                 borderTopRightRadius: 10,
                                                 borderBottomRightRadius: 10,
                                                 borderBottomLeftRadius: 10,
                                                 backgroundColor: '#FFFFFF',
                                                 borderWidth: 1,
                                                 borderColor: '#b135c5'
                                             }}
                                             textStyles={{fontSize: 13, padding: 3, color: '#b135c5',}}/>
                    })
                }
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="type the occasion..."
                    onChangeText={newText => setSelectedOption(newText)}
                    value={selectedOption}
                />
                <CustomButton title="Submit"
                              handlePress={() => handleSelectItem(selectedOption)}
                              containerStyles={{
                                  minHeight: 50,
                                  borderRadius: 0,
                                  borderTopRightRadius: 10,
                                  borderBottomRightRadius: 10
                              }}
                              textStyles={{fontSize: 13, padding: 2}}
                />
            </View>


            <View style={styles.buttonContainer}>
                {
                    typeOfStyle.map((option, id) => {
                        return <CustomButton key={id}
                                             title={option}
                                             handlePress={() => selectStyle(option)}
                                             containerStyles={{
                                                 margin: 5,
                                                 minHeight: 10,
                                                 alignSelf: 'flex-start',
                                                 borderRadius: 0,
                                                 borderTopRightRadius: 10,
                                                 borderBottomRightRadius: 10,
                                                 borderBottomLeftRadius: 10,
                                                 borderTopLeftRadius: 10,
                                                 backgroundColor: selectedStyles.includes(option) ? '#ebebeb' : '#FFFFFF',
                                                 borderWidth: 2,
                                                 borderColor: selectedStyles.includes(option) ? '#c4b29b' : '#E2D0B9'
                                             }}
                                             textStyles={{fontSize: 13, padding: 3, color: '#E2D0B9',}}/>
                    })
                }
            </View>

            <View style={{marginTop: 20}}>
                {names.length !== 0 && (
                    <FlatList
                        data={names}
                        renderItem={({ item }) => <OutfitSuggestion outfit={item} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
            </View>

            {/* Modal טעינה */}
            <Modal
                transparent={true}
                animationType="none"
                visible={loading}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Loading...</Text>
                    </View>
                </View>
            </Modal>

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
    subtitle: {
        fontSize: 16,
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
        fontSize: 15,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        // borderTopLeftRadius:10,
    },
    outfitContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
        // backgroundColor: '#c3c3c3',
        backgroundColor: "white",
        borderRadius: 10,
        // borderWidth: 3,
        // borderColor:'#b3b2b2',
        padding: 10,
        shadowColor: '#000', // צבע הצל
        shadowOffset: { width: 0, height: 2 }, // מיקום הצל
        shadowOpacity: 0.25, // שקיפות הצל
        shadowRadius: 3.84, // גודל ההתרחבות של הצל
        elevation: 5, // צל באנדרואיד
    },
    itemContainer: {
        marginRight: 10,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    outfitList: {
        flexDirection: 'row',

    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Outfits