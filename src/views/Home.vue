<template>
  <div id="vueHome">
    <div class="content">
      <h4 class="is-size-4">Welcome to the FCF (Firebase Cloud Firestore) / Vue Users Application</h4>
      <p>This application is a research and demonstration project.  It runs on the following technologies:</p>
      <ul>
        <li>
          The <a href="https://vuejs.org/" target="_blank">Vue.js JavaScript framework</a> using:
          <ul>
            <li>Vue CLI 3.2</li>
            <li>Vue Router 3.0.1</li>
            <li>Vuex data store 3.0.1</li>
          </ul>
        </li>
        <li>
          <a href="https://firebase.google.com/" target="_blank">Firebase</a> authentication and the Firebase
          <a href="https://firebase.google.com/products/firestore/" target="_blank">Cloud Firestore</a> document datastore
        </li>
        <li>
          The <a href="https://bulma.io/" target="_blank">Bulma</a> CSS framework
        </li>
      </ul>
      <p>
        The application allows you to create and authenticate user accounts and documents via Firebase's
      email/password-based authentication API and the Cloud Firestore document and document collection API.  The goal was
      to create something that could serve as an example for others to follow when starting out with Vue and with
      Cloud Firestore, and to be a "canary" application that would expose breaking changes when either Vue
      or (more likely) the beta Cloud Firestore API changes.
      </p>
      <p>A lot of the initial architecture and code was based on or directly borrowed from the code from the
      following article, which was an excellent guide:</p>
      <p>
        <a href="https://savvyapps.com/blog/definitive-guide-building-web-app-vuejs-firebase" target="_blank">
          https://savvyapps.com/blog/definitive-guide-building-web-app-vuejs-firebase
        </a>
      </p>
      <p>
        To learn how to install and run this app locally against your own Firebase Cloud Firestore project, click
        on the "Setup" tab.
      </p>
      <p>
        To learn about the concepts and techniques associated with this application, click on the "Notes" tab.
      </p>
      <p>
        Otherwise, you can start using the application by visiting the "Users" tab.
      </p>

    </div>
  </div>
</template>
