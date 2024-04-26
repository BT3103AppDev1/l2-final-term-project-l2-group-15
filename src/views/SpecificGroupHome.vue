<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import Navbar_groups from '@/components/Navbar_groups.vue'
  import About from '@/components/About.vue'
  import Recent_events from '@/components/Recent_events.vue'
  import Recent_discussions from '@/components/Recent_discussion.vue'
  import Membership from '@/components/Membership.vue'
</script>

<template>
  <body>
      <Navbar_global />
        <h1>{{ groupName }} Dashboard</h1>
      <Navbar_groups :group="group"/>
    <div class = flexbox>
      <div class = "events"><Recent_events :group="group"/></div>
      <div class = "about"><About :group="group"/></div>
      <div class = "discussions"><Recent_discussions :group="group"/></div>
      <div class = "membership"><Membership :group="group"/></div>
    </div>
    <hr>
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
    return {
      user: '',
      group: '',
      groupName: '',
    }
  },

  created() {
    try {
      this.user = this.$route.params.user // string
      this.group = this.$route.params.group; // string
      console.log(this.group)
      this.getGroupName();
    } catch (error) {
      console.error('Error:', error);
    }
  },

  methods: {
    async getGroupName() {
      try {
        const docs = await getDocs(collection(db, "group"));
        docs.forEach((doc) => {
          if (doc.data().GroupId == this.group) {
            this.groupName = doc.data().GroupName;
            console.log("Group name retrieved successfully:", this.groupName);
          }
        });
      } catch (error) {
        console.error("Error retrieving group name:", error);
      }
    }
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
  max-width: fit-content;
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
  padding: 10px; 
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
    width: 94%;
    height: 80%;
    position: fixed;
    overflow: scroll;
    overflow-x: hidden;
  }
</style>