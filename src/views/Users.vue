<template>
    <div id="vueUsers">
        <h3 class="is-size-3">Users</h3>
        <div class="level">
            <div class="level-left"><div class="level-item">&nbsp;</div></div>
            <div class="level-right">
                <div class="level-item">
                    <div v-if="currentUser">
                        <p>You are currently logged in as {{ userProfile.firstName }} {{ userProfile.lastName }}</p>
                    </div>
                    <div v-else>
                        <p v-if="users.length">Log in to add, edit, and delete user documents.</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="incomingUsers.length" class="has-background-warning newUsersAlert">
            {{ incomingUsers.length }} new user document(s) have been created by other users.  <a @click="integrateNewUsers">Click here</a> to refresh
            the list of users.
        </div>

        <div v-if="users.length">
            <table id="userTable" class="table is-bordered is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Last name</th>
                        <th>First name</th>
                        <th>Email</th>
                        <th>Title</th>
                        <th>Address</th>
                        <th>Age</th>
                        <th v-if="currentUser">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users">
                        <td>{{ user.lastName }}</td>
                        <td>{{ user.firstName }}</td>
                        <td>{{ user.emailAddress }}</td>
                        <td>{{ user.title }}</td>
                        <td>{{ user.streetAddress }}<span v-if="user.city">,</span> {{ user.city }}<span v-if="user.state">,</span> {{ user.state }} {{ user.zipCode }}</td>
                        <td>{{ user.age }}</td>
                        <td v-if="currentUser">
                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <button @click="routeToUserDocument( user.id )" class="button is-primary">Edit Document</button>
                                    </div>
                                    <div class="level-item">
                                        <button :disabled="currentUser.uid === user.id" @click="deleteUser( user.id )" class="button is-danger">
                                            {{ currentUser.uid === user.id ? "Current Account" : "Delete Document" }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h4 class="is-size-4">There are currently no users.  Use the "Create First User" button to create
            a user and login as that user.</h4>
        </div>
        <button v-if="currentUser" @click="routeToCreateUser" class="button is-info actionButton">Add New User</button>
        <transition name="fade">
            <form-errors :errors="errors"></form-errors>
        </transition>
    </div>
</template>

<script>
    import FormErrors from "../components/FormErrors";
    import { mapState } from "vuex";
    import { userCollection} from "../firebaseConfig";

    export default {
        name: "Users",
        components: { FormErrors },
        computed: {
            ...mapState([ "userProfile", "currentUser", "users", "incomingUsers", "dev" ])
        },
        data: function() {
            return {
                errors: []
            }
        },
        methods: {
            routeToUserDocument( userId ) {
                // Example of the "by name" method of accessing a route
                this.$router.push( { name: "userDocument", params: { id: userId } } );
            },
            routeToCreateUser() {
                // Example of the "by route string" method of accessing a route
                this.$router.push( "/create-user");
            },
            deleteUser( userId ) {
                this.errors = [];
                // NOTE: the delete() will NOT error if you pass it an ID for a document that doesn't exist.
                userCollection.doc( userId ).delete().then( result => {
                    this.dev.addLog( "User with id " + userId + " deleted" );
                }).catch( err => {
                    this.dev.addLog( "User deletion failed for id " + userId  );
                    this.dev.addData( "errorObjects", err );
                    this.errors.push( err.message );
                })
            },
            integrateNewUsers() {
                let combinedUsers = this.incomingUsers.concat( this.users );
                this.$store.commit( "setIncomingUsers", null );
                this.$store.commit( "setUsers", combinedUsers );
            }
        }
    }
</script>

<style scoped lang="scss">

    .newUsersAlert {
        padding: 5px 10px;
        border-radius: 5px;
    }

    #userTable {
        margin: 15px 0px;
    }

    .actionButton {
        margin: 2ex 0ex;
    }

</style>