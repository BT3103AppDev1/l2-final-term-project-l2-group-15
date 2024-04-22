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
  border: none; /* Remove the default border */
  height: 1.041px; /* Set the height of the horizontal line */
  background-color: #ffffff; /* Set the background color to white */
  margin: 0; /* Optional: Add some margin above and below the horizontal line */
  padding: none;
}

.about {
  text-align: left;
  border: 2px solid #ccc; /* Border style */
  padding: 20px; /* Add padding to create space between content and border */
  width: 48%; 
  height: auto;
  box-sizing: border-box; /* Include padding and border in the width calculation */
  float: right; /* Align the container to the right */
  background-color: white;
  margin: 10px;
  height: 60%;
  overflow: scroll;
  overflow-x: hidden;
}

.events {
  text-align: left;
  border: 2px solid #ccc; /* Border style */
  padding: 20px; /* Add padding to create space between content and border */
  width: 48%; 
  height: auto;
  box-sizing: border-box; /* Include padding and border in the width calculation */
  float: right; /* Align the container to the right */
  background-color: white;
  margin: 10px;
  height: 60%;
  overflow: scroll;
  overflow-x: hidden;
}

.discussions {
  text-align: left;
  border: 2px solid #ccc; /* Border style */
  padding: 20px; /* Add padding to create space between content and border */
  width: 48%; 
  height: auto;
  box-sizing: border-box; /* Include padding and border in the width calculation */
  float: right; /* Align the container to the right */
  background-color: white;
  margin: 10px;
  height: 60%;
  overflow: scroll;
  overflow-x: hidden;
}

.membership {
  text-align: left;
    border: 2px solid #ccc; /* Border style */
    padding: 20px; /* Add padding to create space between content and border */
    width: 48%; 
    height: auto;
    box-sizing: border-box; /* Include padding and border in the width calculation */
    float: right; /* Align the container to the right */
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

/* .about-content { */
  /* text-align: left; Align content to the right within the container */
  /* width: 100%; Set the content width to 100% */
  /* height: 50%; */
/* } */
</style>