<template>
    <div id="vueCreateUser">
        <div class="columns">
            <div class="column is-6">
                <h3 class="is-size-3">{{ firstUser ? "Create First User" : "Create User "}}</h3>

                <p v-if="firstUser">Create your first user using the form below.  Regardless of the button you click, you
                will be logged in as that user.</p>

                <form id="createUserForm" class="viewForm" @submit.prevent>

                    <div class="columns">
                        <div class="column is-half">
                            <div class="field">
                                <label class="label" for="firstName">First Name</label>
                                <div class="control">
                                    <input v-model.trim="createUserForm.firstName" id="firstName" class="input" type="text" placeholder="First name">
                                </div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="field">
                                <label class="label" for="lastName">Last Name</label>
                                <div class="control">
                                    <input v-model.trim="createUserForm.lastName" id="lastName" class="input" type="text" placeholder="Last name">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="email">Email</label>
                        <div class="control">
                            <input v-model.trim="createUserForm.email" id="email" class="input" type="text" placeholder="emailId@email.com" autocomplete="username">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="password">Password</label>
                        <div class="control">
                            <input v-model.trim="createUserForm.password" id="password" class="input" type="password" placeholder="*************" autocomplete="new-password">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="passwordConfirmation">Confirm Password</label>
                        <div class="control">
                            <input v-model.trim="createUserForm.passwordConfirmation" id="passwordConfirmation" class="input" type="password" placeholder="*************" autocomplete="new-password">
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column is-5">
                            <button @click="createUser( true )" id="createWitProfileButton" class="button is-info">Create User And Continue to Profile</button>
                        </div>
                        <div class="column is-1">
                            &nbsp;
                        </div>
                        <div class="column is-5">
                            <button @click="createUser( false )" id="createWithoutProfileButton" class="button is-info">Create User And Skip Profile</button>
                        </div>
                    </div>

                    <transition name="fade">
                        <form-errors :errors="errors"></form-errors>
                    </transition>
                </form>


            </div>
            <div class="column">
                <transition name="fade">
                    <div v-if="performingRequest">
                        <p>Loading...</p>
                    </div>
                </transition>
            </div>
        </div>

    </div>
</template>

<script>
    import FormErrors from "../components/FormErrors";
    import { mapState } from "vuex";
    const fb = require( "../firebaseConfig.js" );
    export default {
        name: "CreateUser",
        props: {
            firstUser: Boolean  // This value is provided via the route
        },
        computed: {
            ...mapState([ "currentUser", "dev" ])
        },
        components: { FormErrors },
        data: function() {
            return {
                createUserForm: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    passwordConfirmation: "",
                    createdByUserId: ""
                },
                performingRequest: false,
                errors: []
            }
        },
        methods: {
            isFormValid() {
                this.errors = [];
                let isValid = true;
                if( this.createUserForm.firstName === "" ) {
                    this.errors.push( "First name required" );
                    isValid = false;
                }
                if( this.createUserForm.lastName === "" ) {
                    this.errors.push( "Last name required" );
                    isValid = false;
                }
                if ( this.createUserForm.email === "" ) {
                    this.errors.push( "Email required" );
                    isValid = false;
                }
                if( this.createUserForm.password !== this.createUserForm.passwordConfirmation ) {
                    this.errors.push( "Passwords are not the same" );
                    isValid = false;
                }
                return isValid;
            },
            createUser( continueToProfile ) {
                if( !this.isFormValid() ) {
                    return;
                }
                /*
                 Unless we're creating the first user, we don't want to create the new user with the same authentication
                 context used throughout the app, because that will result in being logged in as the new user.  So for
                 all other users we use an authentication context added solely for the purpose of creating a new user.
                */
                let authObj = this.firstUser ? fb.auth : fb.userCreationAuth;
                this.performingRequest = true;
                authObj.createUserWithEmailAndPassword( this.createUserForm.email, this.createUserForm.password ).then( userCredential => {
                    if( this.firstUser ) {
                        this.$store.commit( "setCurrentUser", userCredential.user );
                    } else {
                        // Sign out of the user creation authentication context
                        authObj.signOut();
                    }
                    this.dev.addLog( "New user created: " + this.createUserForm.email );
                    this.dev.addData( "createdUsers", userCredential.user );

                    // Modify the returned user object
                    fb.userCollection.doc( userCredential.user.uid ).set({
                        firstName: this.createUserForm.firstName,
                        lastName: this.createUserForm.lastName,
                        emailAddress: this.createUserForm.email, // Adding email to the corresponding user document
                        createdByUserId: this.currentUser.uid
                    }).then(() => {
                        if( this.firstUser ) {
                            this.$store.dispatch( "fetchUserProfile" ) ;
                        }
                        this.performingRequest = false;
                        if( continueToProfile ) {
                            this.$router.push( "/user-document/" + userCredential.user.uid );
                        } else {
                            this.$router.push( "/users" );
                        }

                    }).catch(err => {
                        this.dev.addData( "errorObjects", err );
                        this.errors.push( err.message );
                        this.performingRequest = false;
                    })
                }).catch(err => {
                    this.dev.addData( "errorObjects", err );
                    this.errors.push( err.message );
                    this.performingRequest = false;
                })
            }
        }
    }
</script>