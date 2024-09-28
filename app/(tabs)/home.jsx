import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CustomButton from "../../components/CustomButton";
import {useGlobalContext} from "../../context/GlobalProvider";
import {router} from "expo-router";

const letters = "ChickPick".split('');

function Home() {
    const animatedValues = useRef(letters.map(() => new Animated.Value(0))).current;
    const fadeAnim = useRef(new Animated.Value(0)).current; // אנימציה של שקיפות
    const {user} = useGlobalContext();

    useEffect(() => {
        // אנימציה של הופעה לתמונה
        Animated.timing(fadeAnim, {
            toValue: 2,
            duration: 2000, // משך האנימציה
            useNativeDriver: true,
        }).start();

        const animations = letters.map((_, index) =>
            Animated.sequence([
                Animated.timing(animatedValues[index], {
                    toValue: 1,
                    duration: 500,
                    delay: index * 100,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValues[index], {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        );

        Animated.stagger(200, animations).start();
    }, [animatedValues, fadeAnim]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.Image
                // source={require('../../assets/images/hanger.jpg')}
                source={require('../../assets/images/hanger-logo.jpg')}
                // source={{ uri: 'https://logowik.com/content/uploads/images/waving-clothes-hanger1096.logowik.com.webp' }}
                style={[styles.image, { opacity: fadeAnim }]} // הוספת האנימציה לשקיפות
                resizeMode="cover"
            />
            <View style={styles.logoContainer}>
                {letters.map((letter, index) => (
                    <Animated.Text
                        key={index}
                        style={{
                            ...styles.logo,
                            transform: [{ translateY: animatedValues[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -15], // קפיצה של 15 פיקסלים
                                })}]
                        }}
                    >
                        {letter}
                    </Animated.Text>
                ))}
            </View>
            <Text style={styles.title}>Welcome {user.username}</Text>
            <Text style={styles.subtitle}>Discover the perfect outfit for any occasion!</Text>
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Explore Outfits"
                    handlePress={() => router.replace("/wardrobe")}
                    containerStyles={styles.button}
                    textStyles = {{color: "white"}}
                />
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // צבע רקע לבן
        padding: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ad4bcd', // צבע כחול
        marginHorizontal: 2, // רווח בין האותיות
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        marginHorizontal: 20,
    },
    buttonContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    button: {
        backgroundColor: '#e6ceae',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    // image: {
    //     width: '100%',
    //     height: 250,
    //     borderRadius: 10,
    // },
});

export default Home;