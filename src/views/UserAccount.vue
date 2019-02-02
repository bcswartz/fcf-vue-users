<template>
    <div id="vueEditCredentials">
        <div class="columns">
            <div class="column is-5">

                <h3 class="is-size-3">Your User Account</h3>
                <form id="changeCredentialsForm" class="viewForm" @submit.prevent>
                    <div class="field">
                        <label class="label" for="email">Email</label>
                        <div class="control">
                            <input v-model.trim="changeCredentialsForm.email" id="email" class="input" type="text" placeholder="New email address" autocomplete="username email">
                            <p class="help">Your email address is your login/username for this site.</p>
                        </div>
                    </div>

                    <button @click="changeEmail" id="emailUpdateButton" class="button is-info actionButton">Change Email</button>
                    <p v-if="emailChangeSuccessful" class="has-text-success">
                        Email changed.
                    </p>

                    <transition name="fade">
                        <form-errors :errors="emailErrors"></form-errors>
                    </transition>

                    <hr class="has-background-primary"/>

                    <div class="field">
                        <label class="label" for="password">New Password</label>
                        <div class="control">
                            <input v-model.trim="changeCredentialsForm.password" id="password" class="input" type="password" placeholder="*************" autocomplete="new-password">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="passwordConfirmation">Confirm Password</label>
                        <div class="control">
                            <input v-model.trim="changeCredentialsForm.passwordConfirmation" id="passwordConfirmation" class="input" type="password" placeholder="*************" autocomplete="new-password">
                        </div>
                    </div>

                    <button @click="changePassword" id="passwordUpdateButton" class="button is-info actionButton">Change Password</button>

                    <p v-if="passwordChangeSuccessful" class="has-text-success">
                        Password changed.
                    </p>

                    <transition name="fade">
                        <form-errors :errors="passwordErrors"></form-errors>
                    </transition>

                </form>

            </div>
            <div class="column is-1">
                &nbsp;
            </div>
            <div class="column is-5">
                <h3 class="is-size-3">Your User Profile</h3>

                <div class="columns short-height">
                    <div class="column is-2 label-column">
                        Name:
                    </div>
                    <div class="column is-6">
                        {{ userProfile.firstName }} {{ userProfile.lastName }}
                    </div>
                </div>
                <div class="columns short-height">
                    <div class="column is-2 label-column">
                        Address:
                    </div>
                    <div class="column is-6">
                        {{ userProfile.streetAddress }}<br />
                        {{ userProfile.city }}<span v-if="userProfile.state">,</span> {{ userProfile.state }} {{ userProfile.zipCode }}
                    </div>
                </div>
                <div class="columns short-height">
                    <div class="column is-2 label-column">
                        Title:
                    </div>
                    <div class="column is-6">
                        {{ userProfile.title }}
                    </div>
                </div>
                <div class="columns short-height">
                    <div class="column is-2 label-column">
                        Age:
                    </div>
                    <div class="column is-6">
                        {{ userProfile.age }}
                    </div>
                </div>

                <button @click="routeToUserDocument" id="editUserProfile" class="button is-info actionButton">Edit Your Profile</button>
                <br />
                <!--
                 This button only visible if a developer sets the active flag on the dev object attached to the
                 window to true.
                -->
                <button v-if="dev.active" @click="openModal" class="button is-info">Open Modal Manually</button>
            </div>
            <div class="column is-1">
                <transition name="fade">
                    <div v-if="performingRequest">
                        <p>Loading...</p>
                    </div>
                </transition>
            </div>
        </div>

        <reauthenticate-modal :attempted-action="attemptedAction"></reauthenticate-modal>

    </div>

</template>

<script>
    import FormErrors from "../components/FormErrors";
    import { mapState } from 'vuex';
    import { userCollection } from "../firebaseConfig";
    import ReauthenticateModal from "../components/ReauthenticateModal";
    export default {
        name: "UserAccount",
        components: { ReauthenticateModal , FormErrors },
        computed: {
            ...mapState([ "currentUser", "userProfile", "dev" ])
        },
        data: function() {
            return {
                changeCredentialsForm: {
                    email: "",
                    password: "",
                    passwordConfirmation: ""
                },
                performingRequest: false,
                emailChangeSuccessful: false,
                passwordChangeSuccessful: false,
                emailErrors: [],
                passwordErrors: [],
                attemptedAction: ""
            }
        },
        created() {
            // The computed property isn't available to copy over to data values until this stage of the lifecycle.
            this.changeCredentialsForm.email = this.currentUser.email;
            /*
             Here we create the listener for the reauthenticated event emitted from the ReauthenticatedModal.vue
             component, which indicates the user now has fresh credentials and can perform the desired auth API call
            */
            this.$on( "reauthenticated", attemptedAction => {
                this.dev.addLog( "Reauthenticated event detected, attemptedAction is " + attemptedAction );
                if( attemptedAction ==  "changeEmail" ) {
                    this.dev.addLog( "Reattempting email change after reauthentication" );
                    this.changeEmail();
                } else if( attemptedAction == "changePassword" ) {
                    this.dev.addLog( "Reattempting password change after reauthentication" );
                    this.changePassword();
                }
            })
        },
        methods: {
            clearErrors() {
                this.emailErrors = [];
                this.passwordErrors = [];
            },
            isPasswordValid() {
                this.clearErrors();
                let isValid = true;
                if( this.changeCredentialsForm.password !== this.changeCredentialsForm.passwordConfirmation ) {
                    this.passwordErrors.push( "Passwords are not the same" );
                    isValid = false;
                }
                return isValid;
            },
            changeEmail() {
                this.clearErrors();
                this.attemptedAction = "changeEmail";
                this.emailChangeSuccessful = false;
                this.currentUser.updateEmail( this.changeCredentialsForm.email ).then( result => {
                    // Need to update the email address in the user document
                    userCollection.doc( this.currentUser.uid ).set({
                        emailAddress: this.changeCredentialsForm.email
                    }, { merge: true } ).then( result => {
                        this.emailChangeSuccessful = true;
                    }).catch( err => {
                        this.emailErrors.push( err.message );
                    });
                }).catch( err => {
                    if( err.code == "auth/requires-recent-login" ) {
                        this.dev.addLog( "Email change attempt triggered reauthentication.");
                        // The setReauthenticate store value controls the visibility of the reauthentication modal
                        this.$store.commit( "setReauthenticate", true );
                    } else {
                        this.emailErrors.push( err.message );
                    }
                });
            },
            changePassword() {
                this.attemptedAction = "changePassword";
                if( !this.isPasswordValid() ) {
                    return;
                }
                this.passwordChangeSuccessful = false;
                this.currentUser.updatePassword( this.changeCredentialsForm.password ).then( result => {
                    this.passwordChangeSuccessful = true;
                }).catch( err => {
                    if( err.code == "auth/requires-recent-login" ) {
                        this.dev.addLog( "Password change attempt triggered reauthentication.");
                        this.$store.commit( "setReauthenticate", true );
                    } else {
                        this.passwordErrors.push( err.message );
                    }
                })
            },
            routeToUserDocument() {
                this.$router.push( "/user-document/" + this.currentUser.uid );
            },
            /*
             This method and the corresponding button exist solely to let you test the modal behavior,
             rather than having to wait for the current authentication to grow stale
             */
            openModal() {
                this.attemptedAction = "changePassword";
                this.$store.commit( "setReauthenticate", true );
            }
        }
    }
</script>

<style scoped>

    .actionButton {
        margin: 2ex 0ex;
    }

    .label-column {
        font-weight: bold !important;
    }
    .short-height {
        margin-bottom: .5ex !important;
        margin-top: .5ex !important;
    }
    .short-height > div {
        padding-top: 0ex !important;
        padding-bottom: 0ex !important;
    }

</style>