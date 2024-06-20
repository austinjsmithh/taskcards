import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

/* Handle Login */
async function postLogin(url = '', data = {}) {

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.json();
}

/* Login with user's email and password */
function login(email, password, navigation) {

    // call and handle postLogin
    postLogin(`${global.route}/login`, {email: email, password: password})
        .then(responseData => {

            // check the response status and send alerts as necessary
            if (responseData.status == 400)
            {
                Alert.alert('Missing Email or Password');
            } else if (responseData.status == 401) {
                Alert.alert('Incorrect Password')
            } else if (responseData.status == 200) {

                // save username and whether or not they are administrators
                global.user = responseData.user,
                global.isAdmin = responseData.isAdmin,

                // redirect to home page
                navigation.navigate('Home')
            }
        })
        .catch(function(error) {
            console.log(error);
        })
}

/* Render login page */
const LoginScreen = ({ navigation }) => {

    // initialize email and password states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    global.email = email;
    global.isAdmin = 'false';

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.content}>

            {/* UAM Logo */}
            <View>
                <Image 
                    source={ require('../../assets/Images/loginLogo.png') } 
                    style={styles.logo}
                />
            </View>

            {/* Login input fields (email and password) */}
            <TextInput 
                placeholder="Email"
                autoCorrect={false}
                style={styles.fields}
                onEndEditing={(value) => setEmail(value.nativeEvent.text)}     
            />
            <TextInput 
                placeholder="Password"
                autoCorrect={false}
                secureTextEntry={true}
                style={styles.fields}
                onEndEditing={(value) => setPassword(value.nativeEvent.text)}
            />

            {/* Login button */}
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => login(email, password, navigation)}
            >
                <Text style={{color: '#ffffff', fontSize: 32}}>
                    Log in
                </Text>
            </TouchableOpacity>

        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    logo: {
        resizeMode: 'contain',
        width: imageWidth,
        height: imageHeight,
        alignSelf: 'center',
    },
    fields: {
        height: 50,
        width: '80%',
        borderBottomWidth: 1,
        borderColor: '#cccccc'
    },
    loginButton: {
        marginTop: 50,
        height: 50,
        width: 200,
        backgroundColor: '#1175bc',
        alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 20
    }
});

export default LoginScreen;
