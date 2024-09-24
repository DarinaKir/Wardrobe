import {CameraView, useCameraPermissions} from 'expo-camera';
import {useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import Button from '../components/Button'
import {Cloudinary} from 'cloudinary-core';
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import {serverConstants} from "../constants/serverConstants";
import {useGlobalContext} from "../app/contex/globalProvider";

export default function UploadImage() {
    const [facing, setFacing] = useState('back');
    const [photo, setPhoto] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);
    const [photoUri, setPhotoUri] = useState(null)
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const {user} = useGlobalContext();


    const cloudinary = new Cloudinary({cloud_name: 'dcfqbqckg', secure: true});


    useEffect(() => {
        console.log('Photo state updated:', photo);
    }, [photo]);

    useEffect(() => {
        console.log('PhotoUri state updated:', photoUri);
    }, [photoUri]);

    useEffect(() => {
        (async () => {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            // setPermission(status === 'granted');
        })();
    }, []);


    const takePicture = async () => {
        try {
            const data = await cameraRef.current.takePictureAsync();

            console.log(data.uri)
            setPhoto(data.uri);


            // await upload(data.uri);

            // await callOpenAI("https://i.imgur.com/Mpuz5xM.jpeg")
        } catch (error) {
            console.log(error);
        }
    };
    const upload = async (imageUri) => {
        console.log("userId: " + user.id)
        let formData = new FormData();
        formData.append('file', { uri: imageUri, type: 'image/png', name: 'photo.png' });
        formData.append('userId', user.id.toString());
        try {
            const response = await axios.post("http://" + serverConstants.serverIp + ":" + serverConstants.port + '/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const res = response.data;
            console.log('Image uploaded successfully,URL:', res);
            Alert.alert("Image uploaded successfully")

        } catch (error) {
            if (error.response) {
                console.log('Server responded with error:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error setting up request:', error.message);
            }
        }
    }


    if (!permission) {
        // Camera permissions are still loading.
        return <View/>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                {/*<FaBeer className='beer' />*/}

                <Text style={{textAlign: 'center'}}>We need your permission to show the camera</Text>
                <Button title="grant permission" onPress={requestPermission} />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            {
                !photo ?
                    <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                        <View style={styles.buttonContainer}>
                            <Button title="Flip" onPress={toggleCameraFacing}></Button>
                            <Button title="take pic" onPress={takePicture}></Button>
                        </View>
                    </CameraView>
                    : (
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={{uri: photo}} style={{width: 300, height: 600}}/>
                            <Button title="Upload" onPress={() => upload(photo)}/>
                            <Button title="Retake" onPress={() => setPhoto(null)}/>
                        </View>
                    )
            }
            {uploadResult && (
                <View style={{marginTop: 20}}>
                    <Image source={{uri: uploadResult.secure_url}} style={{width: 300, height: 300, marginTop: 10}}/>
                    {/*<Text>{uploadResult}</Text>*/}
                </View>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
})