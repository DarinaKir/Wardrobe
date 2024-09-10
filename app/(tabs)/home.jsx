import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

function Home() {
    return (
        <SafeAreaView>
            <Text>Home</Text>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

export default Home

