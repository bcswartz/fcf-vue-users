<template>
    <div id="vueUserProfileForm">
        <div class="columns">
            <div class="column is-6">
                <h3 class="is-size-3">Edit User Profile</h3>

                <form id="userProfileForm" class="viewForm" @submit.prevent>

                    <div class="columns">
                        <div class="column is-half">
                            <div class="field">
                                <label class="label" for="firstName">First Name</label>
                                <div class="control">
                                    <input v-model.trim="userProfileForm.firstName" id="firstName" class="input" type="text" placeholder="First name">
                                </div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="field">
                                <label class="label" for="lastName">Last Name</label>
                                <div class="control">
                                    <input v-model.trim="userProfileForm.lastName" id="lastName" class="input" type="text" placeholder="Last name">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="streetAddress">Street Address</label>
                        <div class="control">
                            <input v-model.trim="userProfileForm.streetAddress" id="streetAddress" class="input" type="text" placeholder="Street number and name">
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column is-one-third">
                            <div class="field">
                                <label class="label" for="city">City</label>
                                <div class="control">
                                    <input v-model.trim="userProfileForm.city" id="city" class="input" type="text" placeholder="Beverly Hills">
                                </div>
                            </div>
                        </div>
                        <div class="column is-one-third">
                            <div class="field">
                                <label class="label" for="state">State</label>
                                <div class="control">
                                    <input v-model.trim="userProfileForm.state" id="state" class="input" type="text" placeholder="CA">
                                </div>
                            </div>
                        </div>
                        <div class="column is-one-third">
                            <div class="field">
                                <label class="label" for="zipCode">Zip Code</label>
                                <div class="control">
                                    <input v-model.trim="userProfileForm.zipCode" id="zipCode" class="input" type="text" placeholder="90210">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="title">Title</label>
                        <div class="control">
                            <input v-model.trim="userProfileForm.title" id="title" class="input" type="text" placeholder="Enter your title">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="age">Age</label>
                        <div class="control">
                            <input v-model.trim="userProfileForm.age" id="age" class="input" type="text" placeholder="Enter your age in years">
                        </div>
                    </div>

                    <button @click="update" id="detailButton" class="button is-info actionButton">Update</button>

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
    import { userCollection} from "../firebaseConfig";

    export default {
        name: "UserDocument",
        components: { FormErrors },
        computed: {
            ...mapState( [ "dev" ] )
        },
        data: function() {
            return {
                userProfileForm: {
                    firstName: "",
                    lastName: "",
                    streetAddress: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    title: "",
                    age: ""
                },
                performingRequest: false,
                errors: [],
                userId: "0"
            }
        },
        methods: {
            getUser() {
                this.errors = [];
                this.performingRequest = true;
                // The following statement retrieves a CloudStore document then invokes the get() method, whose
                // promise response provides a snapshot of data via the data() method.
                userCollection.doc( this.userId ).get().then( result => {
                    if( result.exists ) {
                        let userData = result.data();
                        for( let prop in this.userProfileForm ) {
                            this.userProfileForm[ prop ] = userData[ prop ] || this.userProfileForm[ prop ];
                        }
                    } else {
                        this.errors.push( "User record not found" );
                    }
                    this.performingRequest = false;
                });
            },
            isFormValid() {
                this.errors = [];
                let isValid = true;
                if( this.userProfileForm.firstName === "" ) {
                    this.errors.push( "First name required" );
                    isValid = false;
                }
                if( this.userProfileForm.lastName === "" ) {
                    this.errors.push( "Last name required" );
                    isValid = false;
                }
                return isValid;
            },
            update() {
                if( !this.isFormValid() ) {
                    return;
                }
                userCollection.doc( this.userId ).set({
                    firstName: this.userProfileForm.firstName,
                    lastName: this.userProfileForm.lastName,
                    streetAddress: this.userProfileForm.streetAddress || "",
                    city: this.userProfileForm.city || "",
                    state: this.userProfileForm.state || "",
                    zipCode: this.userProfileForm.zipCode || "",
                    age: this.userProfileForm.age || "",
                    title: this.userProfileForm.title || ""
                }, { merge: true } );
                this.$router.push( "/users" );
            }
        },
        /*
         The created() and beforeRouteUpdate() methods both perform the same actions to safeguard against the
         scenario where the route is cached (a cached route will not fire the created() lifecycle method).
        */
        created() {
            this.dev.addLog( "created method of UserProfile component invoked" );
            this.userId = this.$route.params.id;
            this.getUser();
        },
        beforeRouteUpdate( to, from, next ) {
            this.dev.addLog( "beforeRouteUpdate method of UserProfile component invoked" );
            this.userId = to.params.id;
            this.getUser();
            next();
        }
    }
</script>

<style scoped>

    .actionButton {
        margin: 2ex 0ex;
    }

</style>