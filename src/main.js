// Import the Vue framework and the root component
import Vue from "vue"
import App from "./App.vue"

// Import the Vue router configuration file
import router from "./router"

// Import the Vuex store
import { store } from "./store"

/*
 Import the Bulma framework CSS file.  If you want to modify the Bulma styles, you would be better off
 importing Bulma as a SCSS library.
*/
import "../node_modules/bulma/css/bulma.css";

// Call for the Firebase configuration file
const fb = require( "./firebaseConfig.js" );

Vue.config.productionTip = false;

/*
 By having Firebase's onAuthStateChange action be responsible for rendering the Vue app,
 you ensure that Firebase is up and ready before the app is loaded or the user refreshes the
 web page via the browser
*/
let app;
fb.auth.onAuthStateChanged( user => {
    if( !app ) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount("#app")
    }
});