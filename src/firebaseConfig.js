// Import Firebase
import firebase from 'firebase'

/*
 Import the settings file containing the Firebase API key and settings for your Firebase project.
 The settings file can then be held out of your version control collection so you can share your
 code

 You can obtain the code for your settings from the Firebase console.  At this time, the settings should look
 something like this:

 config = {
    apiKey: "YOUR_API_KEY",
    authDomain: "PROJECT_NAME.firebaseapp.com",
    databaseURL: "https://PROJECT_NAME.firebaseio.com",
    projectId: "PROJECT_NAME",
    storageBucket: "",
    messagingSenderId: "SOME_NUMBER"
}
*/
import config from './firebaseSettings'
import 'firebase/firestore'

firebase.initializeApp(config);

// Firebase utils
const db = firebase.firestore();
const auth = firebase.auth();

/*
 A quirk of the process of creating a new user account in your Firebase app (at least apps using email/password
 authentication) is that the process leaves you logged in as the user you just created.  To avoid this, you can
 create a second Firebase app object and corresponding auth object in order to create a user without
 logging out the current user

 Source:  https://stackoverflow.com/questions/37517208/firebase-kicks-out-current-user/38013551#38013551
*/
const userCreateFirebaseApp = firebase.initializeApp( config, "userCreation" );
const userCreationAuth = userCreateFirebaseApp.auth();
const currentUser = auth.currentUser;

/*
 According to https://savvyapps.com/blog/definitive-guide-building-web-app-vuejs-firebase,
 these settings need to be set to deal with a date issue with Firebase at the time the article was
 written (supposedly 5/22/18 )
*/
const settings = {
    timestampsInSnapshots: true
};
db.settings( settings );

// Declare your Firebase collections.  In this case, we only have the User collection
const userCollection = db.collection( "users" );

// Export these objects for use in other files
export {
    db,
    auth,
    userCreationAuth,
    currentUser,
    userCollection
}
