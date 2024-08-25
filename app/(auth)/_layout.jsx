import { StatusBar } from 'expo-status-bar';
import {Text, View } from 'react-native';
import { Stack } from "expo-router";

function AuthLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen
                name="sign-in"
                options={{
                    headerShown:false,
                }}
                />
                <Stack.Screen
                    name="sign-up"
                    options={{
                        headerShown:false,
                    }}
                />
            </Stack>
            <StatusBar backgroundColor="#f4dfc7"></StatusBar>
        </>
    );
}

export default AuthLayout

