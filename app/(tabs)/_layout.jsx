import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, StyleSheet } from 'react-native';
import {Tabs, Redirect} from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const TabIcon = ({ color, iconName, tabName, focused }) => {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name={iconName} size={30} color={color} />
            <Text
                style={[
                    styles.text,
                    { color: color, fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular' },
                ]}
            >
                {tabName}
            </Text>
        </View>
    );
};


function TabsLayout() {
    return (
       <>
       <Tabs screenOptions={{
           tabBarActiveTintColor: "#958bd2",
           tabBarInactiveTintColor: "#CDCDE0",
           tabBarShowLabel: false,
           tabBarStyle: {
               // backgroundColor: "#161622",
               borderTopWidth: 1,
               // borderTopColor: "#232533",
               height: 60,
           },
       }}>
           <Tabs.Screen
               name="home"
               options={{
                   title: "Home",
                   headerShown: false,
                   tabBarIcon: (
                       { color, focused }) => (
                       <TabIcon
                           color={color}
                           iconName="home-outline"
                           tabName="Home"
                           focused={focused}
                       />
                   ),
               }}
           />

           <Tabs.Screen
               name="outfits"
               options={{
                   title: "Outfits",
                   headerShown: false,
                   tabBarIcon: ({ color, focused }) => (
                       <TabIcon
                           color={color}
                           iconName="hanger"
                           tabName="Outfits"
                           focused={focused}
                       />
                   ),
               }}
           />

           <Tabs.Screen
               name="wardrobe"
               options={{
                   title: "Wardrobe",
                   headerShown: false,
                   tabBarIcon: ({ color, focused }) => (
                       <TabIcon
                           color={color}
                           iconName="wardrobe-outline"
                           tabName="Wardrobe"
                           focused={focused}
                       />
                   ),
               }}
           />

           <Tabs.Screen
               name="profile"
               options={{
                   title: "Profile",
                   headerShown: false,
                   tabBarIcon: ({ color, focused }) => (
                       <TabIcon
                           color={color}
                           iconName="account-outline"
                           tabName="Profile"
                           focused={focused}
                       />
                   ),
               }}
           />
       </Tabs>
       </>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 12,
    },
});
export default TabsLayout

