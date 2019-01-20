# FCF/Vue Users 

The FCF (Firebase Cloud Firestore) / Vue Users application is a research and demonstration project. 
It runs on the following technologies:

* The [Vue.js JavaScript](https://vuejs.org/) framework using:

    * Vue CLI 3.2
    
    * Vue Router 3.0.1
    
    * Vuex data store 3.0.1
    
* [Firebase](https://firebase.google.com/) authentication and the Firebase [Cloud Firestore](https://firebase.google.com/products/firestore/) 
  document datastore

* The [Bulma](https://bulma.io/) CSS framework.

The application allows you to create and authenticate user accounts and documents via Firebase's
email/password-based authentication API and the Cloud Firestore document and document collection API.  The goal was
to create something that could serve as an example for others to follow when starting out with Vue and with
Cloud Firestore, and to be a "canary" application that would expose breaking changes when either Vue
or (more likely) the beta Cloud Firestore API changes.

A lot of the initial architecture and code was based on or directly borrowed from the code from the following article, which was an excellent guide:

https://savvyapps.com/blog/definitive-guide-building-web-app-vuejs-firebase

## Installation and Setup

* Install the latest version of Vue CLI

* Checkout or download the code, then run "npm install" to install the needed packages.

* Create a Firebase Cloud Firestore project and add the configuration settings to the codebase:

    * Go to the Firebase website. Sign in using your Google credentials.
    
    * In the menu bar, click "Go to Console". Click on "Add Project". Give the project a name and click the "Continue" button. 
      Select any data sharing options you want and click "Create Project". When the project is ready, click "Continue"
    
    * The next screen will invite you to add Firebase to your app and display icons for iOS, Android, and the web. Click on the web icon.
  
    * A modal window will appear containing a code snippet. All you need from the snippet is the "config" object variable.
    
    * In the "src" directory of the codebase, create a file named "firebaseSettings.js". 
      Copy the "config" object into that file and end the file with the line "export default config".  Example:
      
      ```javascript
        var config = {
          apiKey: "YOUR_API_KEY",
          authDomain: "PROJECT_NAME.firebaseapp.com",
          databaseURL: "https://PROJECT_NAME.firebaseio.com",
          projectId: "PROJECT_NAME",
          storageBucket: "",
          messagingSenderId: "SOME_NUMBER"
        };
        
        export default config;
        ```
    * Return to the Firebase console view of your new Firebase project. In the left column, click on "Authentication". 
      In the Authentication panel, click on the "Sign-in method" menu item, then click on the "Email/Password" option 
      and enable it. This enables the authentication method used in this Vue application. Click "Save".
     
    * In the left column of the console window, select "Database". You will be prompted to create a Cloud Firestore database. 
      Click the "Create database" button.
      
    * A modal window will appear to let you choose the security rules for your database. Since this is a demo application, 
      select "Start in test mode", and click the "Enable" button.
      
    * The Firebase side of the application is now ready to go: you can either close the Firebase console, or leave it 
      open to observe the changes made as you use the application.
      
* Run the application using "npm run serve".

* Click the "Create First User" in the navigation bar to create the first user account / document.

## Features

This application:

* Exercises a number of Vue.js concepts and techniques (routing, state management, event broadcasting, component reuse)

* Demonstrates the use of some of the Firebase authentication API methods, and highlights some of the challenges 
  involved in managing/manipulating Firebase user accounts (mainly the requirement to have fresh user credentials to
  perform most operations).
  
* Provides an example of segregating incoming real-time data changes from the application when appropriate.

* Includes a development object that can be turned on to modify application behavior and examine application behavior
  via logging and data collections that can be examined via the browser console.
  
    

