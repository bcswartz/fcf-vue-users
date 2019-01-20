// Import Vue and the Vue router
import Vue from "vue"
import Router from "vue-router"

// Import Vue components used in the routes
import Home from "./views/Home.vue"
import Login from "./views/Login";
import Users from "./views/Users";
import UserDocument from "./views/UserDocument";
import CreateUser from "./views/CreateUser";
import UserAccount from "./views/UserAccount";
import Notes from "./views/Notes";

Vue.use( Router );

export default new Router({
  // The linkActiveClass is the CSS class applied when the current routes starts with the router link "to" route
  linkActiveClass: "is-active",
    // The problem is that a to of "/" will always be active, yet a router-link of "/home" will not be active
    // with the "/" lander...unless you add "exact" property to the router-link.
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/setup",
      name: "setup",
      // An example of lazy-loading a route, though not necessary in this case
      component: () => import(/* webpackChunkName: "about" */ "./views/Setup.vue" )
    },
    {
      path: "/notes",
      name: "notes",
      component: Notes
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    /*
     The next two routes use the same component but pass in a flag prop (that does not appear in the URL in the
     address bar) that affects the component look and behavior.
    */
    {
      path: "/create-first-user",
      name: "createFirstUser",
      component: CreateUser,
      props: { firstUser: true }
    },
    {
      path: "/create-user",
      name: "createUser",
      component: CreateUser,
      props: { firstUser: false }
    },
    {
      path: "/users",
      name: "users",
      component: Users
    },

    {
      path: "/user-document/:id",
      name: "userDocument",
      component: UserDocument
    },
    {
      path: "/user-account",
      name: "userAccount",
      component: UserAccount
    }

  ]
})
