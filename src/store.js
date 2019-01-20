// Import Vue and the Vuex store
import Vue from 'vue'
import Vuex from 'vuex'

// Call for the Firebase configuration file
const fb = require( "./firebaseConfig.js" );

Vue.use( Vuex );

fb.auth.onAuthStateChanged(user => {
    if( !store.state.dev ) {
        store.dispatch( "createDevObject" )
    }
    store.state.dev.addLog( "onAuthStateChange invoked" );
    store.state.dev.addData( "user", user );
    if ( user ) {
        // See if the user has a user document before setting them as the current user
        fb.userCollection.doc( user.uid ).get().then( result => {
            if( result.exists ) {
                store.commit( "setCurrentUser", user );
                store.dispatch( "fetchUserProfile" )
            } else {
                store.state.dev.addLog( "No user document for user " + user.email );
            }
        });
    }

    // Retrieve the user collection
    fb.userCollection.orderBy( "lastName", "asc" ).onSnapshot( querySnapshot => {

        let createdByCurrentUser;
        if( store.state.currentUser && querySnapshot.docs.length && querySnapshot.docChanges()[0] ) {
            createdByCurrentUser = store.state.currentUser.uid == querySnapshot.docChanges()[0].doc.data().createdByUserId ? true : false;
        }

        if( querySnapshot.docChanges().length !== querySnapshot.docs.length && querySnapshot.docChanges()[0].type == "added" & !createdByCurrentUser ) {
            let incomingUser = querySnapshot.docChanges()[0].doc.data();
            incomingUser.id = querySnapshot.docChanges()[0].doc.id;

            store.commit( "setIncomingUsers", incomingUser );
        } else {
            let userArray = [];

            querySnapshot.forEach( doc => {
                let userObj = doc.data();
                userObj.id = doc.id; // The unique id of the document is segregated from rest of data retreived by data()
                userArray.push( userObj )
            });

            store.commit( "setUsers", userArray );
        }

        store.commit( "setUserDataRetrieved", true );

    })

});

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        users: [],
        incomingUsers: [],
        userDataRetrieved: false,
        reauthenticate: false,
        dev: null
    },
    mutations: {
        setCurrentUser( state, val ) {
            state.currentUser = val;
        },
        setUserProfile(state, val) {
            state.dev.addData( "userProfile", val );
            state.userProfile = val;
        },
        setUsers( state, val ) {
            state.users = val;
        },
        setUserDataRetrieved( state, val ) {
            state.userDataRetrieved = val;
        },
        setIncomingUsers( state, val ) {
            if( val ) {
                // Add if not currently in incomingUsers collection
                if( !state.incomingUsers.some( addedUser => addedUser.id === val.id ) ){
                    if( state.dev ) {
                        state.dev.addLog( "Incoming user added: " + val.emailAddress )
                    }
                    state.incomingUsers.unshift( val )
                }
            } else {
                state.incomingUsers = [];
            }
        },
        setReauthenticate( state, val ) {
            state.reauthenticate = val;
        },
        setDevObject( state, val ) {
            state.dev = val;
        }
    },
    actions: {
        clearData( { commit } ) {
            commit( "setCurrentUser", null );
            commit( "setUserProfile", {} );
            commit( "setUsers", [] );
        },
        /*
         The object as the argument is applying argument deconstruction to get at properties/methods of the
         "context" object of the store.  See https://vuex.vuejs.org/guide/actions.html
        */
        fetchUserProfile({ commit, state }) {
            fb.userCollection.doc( state.currentUser.uid ).get().then( res => {
                commit( "setUserProfile", res.data() )
            }).catch( err => {
                console.log( err );
            })
        },
        /*
         This method creates a "dev" object attached to the window that a developer can activate to track
         application behavior and expose certain functionality that otherwise is only available in certain
         scenarios.
        */
        createDevObject( { commit } ) {
            window.dev = {
                active: false,
                data: {},
                logs: [],
                addLog: function( msg ) {
                    if( this.active ) {
                        this.logs.unshift( msg );
                    }
                },
                addData: function( collection, value ) {
                    if( this.active ) {
                        if( !this.data[ collection ] ) {
                            this.data[ collection ] = [];
                        }
                        this.data[ collection ].unshift( value );
                    }
                },
                clearAll: function() {
                    this.data = {};
                    this.logs = [];
                    return "All dev data and logs cleared"
                },
                clearLogs: function() {
                    this.logs = [];
                    return "All dev log messages cleared"
                },
                clearData: function() {
                    this.data = {};
                    return "All dev data cleared"
                }
            };
            commit( "setDevObject", window.dev );
        }
    }
});
