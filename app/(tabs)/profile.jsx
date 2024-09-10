import { StatusBar } from 'expo-status-bar';
import {Text, View } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";


function Profile() {
    return (
        <SafeAreaView>
            <Text>Profile</Text>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

export default Profile

