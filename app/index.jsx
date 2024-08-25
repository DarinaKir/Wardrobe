import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";

function Welcome() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.innerContainer}>

                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Image
                        source={images.cards}
                        style={styles.image}
                        resizeMode='contain'
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.subtitle}>
                            Discover Endless{"\n"}
                            Possibilities with{" "}
                            <Text style={styles.highlight}>Wardrobe</Text>
                        </Text>

                        <Text style={styles.description}>
                            Unleash Your Style: Discover Endless Outfit Combinations with Wardrobe
                        </Text>
                        <CustomButton
                            title="Continue with Email"
                            handlePress={() => router.push("/sign-in")}
                            containerStyles={styles.buttonContainer}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2D0B9',
    },
    scrollViewContent: {
        height: '100%',
    },
    innerContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '85vh',
        paddingHorizontal: 16,
    },
    logo: {
        width: 300,
        height: 60,
    },
    image: {
        maxWidth: 380,
        width: '100%',
        height: 300,
    },
    textContainer: {
        position: 'relative',
        marginTop: 20,
    },
    subtitle: {
        color: '#000000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    },
    highlight: {
        color: '#b135c5',
    },
    description: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
        color: '#7B7B8B',
        marginTop: 28,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 28,
    },
});

export default Welcome;
