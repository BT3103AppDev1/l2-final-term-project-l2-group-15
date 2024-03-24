<template>
    <div class="Discussions-container">
      <div class="discussions-content">
        <h2>Recent Discussions</h2>
        <hr>
        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
      </div>
    </div>
  </template>
    
  <script>
  import firebaseApp from "../firebase.js"
  import { getFirestore } from "firebase/firestore"
  import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
  
  export default {
      name: "Recent_discussions",
  }
  </script>
    
  <style scoped>
    h2 {
      font-size: 24px;
      margin-top: 0px;
      margin-bottom: 5px;
    }
  
    hr {
      margin-bottom: 20px;
    }
  </style>
  