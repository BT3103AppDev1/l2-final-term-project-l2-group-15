<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
</script>

<template>
  <body>
      <Navbar_global />
      <NavBar_market />
  </body>
</template>

<script>
import firebaseApp from "../firebase.js"
import { getFirestore } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
  name: "SpecificGroupHome",
  
  data() {
  },

  created() {
  },

  methods: {
  }
}
</script>

<style scoped>
h1 {
  padding: 0px;
  margin-top: 7px;
  margin-bottom: 7px;
  margin-left: 10pt;
  font-family: 'Open Sans', Arial, sans-serif;
}

hr {
  border: none; 
  height: 1.041px; 
  background-color: #ffffff; 
  margin: 0; 
  padding: none;
}

.about {
  text-align: left;
  border: 2px solid #ccc;
  padding: 20px; 
  width: 48%; 
  height: auto;
  box-sizing: border-box; 
  float: right;
  background-color: white;
  margin: 10px;
  height: 60%;
  overflow: scroll;
  overflow-x: hidden;
}

.events {
  text-align: left;
  border: 2px solid #ccc; 
  padding: 20px; 
  width: 48%; 
  height: auto;
  box-sizing: border-box; 
  float: right;
  background-color: white;
  margin: 10px;
  height: 60%;
  overflow: scroll;
  overflow-x: hidden;
}

.discussions {
  text-align: left;
  border: 2px solid #ccc; 
  padding: 20px; 
  width: 48%; 
  height: auto;
  box-sizing: border-box;
  float: right; 
  background-color: white;
  margin: 10px;
  height: 60%;
  overflow: scroll;
  overflow-x: hidden;
}

.membership {
  text-align: left;
    border: 2px solid #ccc; 
    padding: 20px; 
    width: 48%; 
    height: auto;
    box-sizing: border-box; 
    float: right; 
    background-color: white;
    margin: 10px;
    height: 60%;
    overflow: scroll;
    overflow-x: hidden;
}

  .flexbox {
    display: flex;
    flex-wrap: wrap;
    align-items: left;
    margin-left: 85px;
    margin-top: 2px;
    margin-right: 5px;
    width: auto;
    height: 75%;
    position: fixed;
    overflow: scroll;
    overflow-x: hidden;
  }
</style>