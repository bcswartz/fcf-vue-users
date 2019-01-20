<template>
    <div id="vueNotes">
        <div class="content">
            <h3>Notes / Lessons Learned</h3>

            <ul class="sectionLinks">
                <li>
                    <a href="#accountVsDocument">User Account vs. User Document</a>
                </li>
                <li>
                    <a href="#staleCredentials">User Account Changes and Stale Credentials</a>
                </li>
                <li>
                    <a href="#externalDocumentUpdates">Firestore Data and External Updates</a>
                </li>
                <li>
                    <a href="#vueBeforeRouteUpdate">Vue's beforeRouteUpdate() Event and Detail Pages</a>
                </li>
                <li>
                    <a href="#developmentObject">Logging/Testing With a Window-attached Object</a>
                </li>
            </ul>

            <hr class="noteSeparator has-background-primary"/>

            <h4 id="accountVsDocument">User Account vs. User Document</h4>

            <p>
                The "users" created using this Vue application are actually composites of two different pieces of data
                stored in Firebase:
            </p>
            <ul>
                <li>
                    User account records (which in this application is tied to the user's email and password
                    credentials) stored in the authentication records of your Firebase project.  These records are
                    manipulated / managed via the Firebase authentication API.
                </li>
                <li>
                    User documents stored in the Cloud Firestore NoSQL database.  The records ("documents" is the
                    proper term) are manipulated / managed via the Cloud Firestore API.
                </li>
            </ul>

            <p>
                Adding, editing, and deleting user documents / user document data is fairly straightforward, especially
                in this application where any user has the permissions to perform those actions.
            </p>

            <p>
                The authentication API, on the other hand, will only let you modify a user account (changing the email
                address or password, or deleting the account) if you are either logged in (authenticated) as that
                user, or you pass in that user's authentication credentials (in this case, their email and password) in
                the API call.
            </p>
            <p>
                That essentially means you cannot create a web application that lets an administrative user modify
                regular user account credentials or delete the account.  The users themselves have to manage their
                credentials and accounts, and Firebase does provide ways for users to do that, you just can't have
                an admin user do it.
            </p>
            <p>
                This even comes into play when creating a new user email/password-based user account:  the API method
                for creating such an account results in the current user being logged into the web application as
                that new user.  Fortunately, there is a workaround for that behavior:  you can create the new user
                under a different authentication context than the one used in the rest of the application and sign
                the new user out of that context as soon as the account is created.  You can look at the code in the
                createUser() method of the CreateUser.vue file to see how to accomplish that.
            </p>
            <p>
                In this application, the workaround for not being able to administratively delete a user account
                in order to remove the user's ability to log into the application is to only allow users who have
                a matching user document to log in successfully.  That's why the delete button in the "Users" view
                is labeled "Delete Document".  The login() method in the Login.vue file will not grant the user
                access to the web application if there is no corresponding user document for their user account,
                even though technically they authenticated successfully.
            </p>

            <hr class="noteSeparator has-background-primary"/>

            <h4 id="staleCredentials">User Account Changes and Stale Credentials</h4>

            <p>
                Even if a user is logged in and trying to change their user account credentials, Firebase will only
                those changes to go through if the user has authenticated recently:  it enforces a kind of soft
                session timeout.
            </p>
            <p>
                So if the changeEmail() or changePassword() methods in UserAccount.vue fail due to stale credentials,
                the user will be prompted to reauthenticate using the ReauthenticateModal.vue component.
            </p>

            <p>
                If you want to try out the reauthentication process without having to wait for your login credentials
                to grow stale, you can make a button appear in the user account view that manually triggers the modal
                to appear using the <a href="#developmentObject">"dev" development object</a> described later on this
                page.
            </p>

            <hr class="noteSeparator has-background-primary"/>

            <h4 id="externalDocumentUpdates">Firestore Data and External Updates</h4>

            <p>
                Cloud Firestore is designed to provide real-time updates to any and all attached clients, but how those
                updates affect your application depends on how you're retrieving the data.
            </p>

            <p>
                In this application, the retrieval of the user document collection that occurs in the Vuex store.js
                file whenever the authentication state changes is done via the onSnapshot() API call.  That retrieval
                method will pull in any users added to the collection by an external action (another client application
                attached to the same Cloud Firestore project or someone adding a user document via the Firebase
                console) unless you add code to keep those new documents out of the collection displayed to the user
                (as this app does).
            </p>
            <p>
                Try it yourself:  create a user or two with the application, and have the Users
                tab open while you go into the Firebase console and manually add a new user via the database tool.
                You should see a message appear above the table of users alerting you that a new user document has
                been created and giving you the option of showing it in the table.  And once that new user is visible,
                any changes made to user document properties will be reflected immediately in the table.
            </p>
            <p>
                On the other hand, UserDocument.vue uses the get() method of the Firestore API to retrieve the
                specified user document, and that method only retrieves the data once (as opposed to using
                onSnapshot() ).  So any changes to that user document's properties made in the Firebase console will not
                affect the form field values in UserDocument.vue.
            </p>

            <hr class="noteSeparator has-background-primary"/>

            <h4 id="vueBeforeRouteUpdate">Vue's beforeRouteUpdate() Event and Detail Pages</h4>

            <p>
                The UserDocument.vue view component is designed to retrieve a specific user document and display that data
                to the user whenever they visit that route.  In reading the Vue Router documentation as I was designing
                that route, I read that routes can be cached, and that if you had a cache-able route that utilized a
                route parameter (in this case, a user document ID), you should put any component initialization actions
                in the beforeRouteUpdate() lifecycle method provided by the router.
            </p>

            <p>
                While that is all true, I didn't understand the caching conditions at first. I thought that meant that
                if I visited the "user-document" once with ID 1, returned to the "users" route with the main users list,
                and then visited "user-document" with ID 2, I would see the beforeRouteUpdate() method fire instead of
                the component's created() lifecycle method.  But that didn't happen:  I kept seeing the created() method
                fire, indicating that the route wasn't being cached.
            </p>

            <p>
                I eventually figured out the caching only occurs when the subsequent route visit immediately follows
                a prior visit:  if a user were to change the URL in the address bar from "/user-document/1" to
                "/user-document/2" (visting no other routes in-between), then a cached copy of the route is used and
                beforeRouteUpdate() is fired.
            </p>
            <p>
                While that scenario isn't likely in this app, UserDocument.vue does perform the same initial actions
                in both the created() and beforeRouteUpdate() events.
            </p>

            <hr class="noteSeparator has-background-primary"/>

            <h4 id="developmentObject">Logging/Testing With a Window-attached Object</h4>

            <p>
                This application includes a developmental feature I've seen used in other applications: a JavaScript
                object attached to the window object that can log data and alter application functionality.  It is
                created in the Vuex store (store.js) and added to the store as the state "dev" property.
            </p>

            <p>
                This dev object contains an "active" Boolean property, "data" and "logs" collections, and methods for
                manipulating those collections.  Certain methods and events in the application are coded to add logging
                statements and result data to the collections in the dev object, but the dev object only captures
                the data if the active property is set to true, which a developer can do simply by executing
                "window.dev.active = true" in the browser console.  A developer can also use the console to inspect
                the contents of the logging and data collections in the dev object to see what's going on without
                having to resort to adding temporary console statements to the code.
            </p>

            <p>
                The dev.active flag is also used to toggle the display of UI elements that let a developer see certain
                DOM elements or access certain application features that normally are only displayed under
                certain conditions.  In this application, setting the active flag to true will display the
                "Create First User" button in the navigation bar even if one or more users already exist, and will
                display a button on the user account page that can manually trigger the reauthentication modal which
                normally only appears when reauthentication is warranted.
            </p>

            <p>
                It seems like a useful feature for testing and development, but obviously it's not something that
                should be accessible to users in production.
            </p>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Notes"
    }
</script>

<style scoped>

    .noteSeparator {
        margin: 4ex 15em;
    }

</style>