<template>
  <body>
    <Navbar_global />
        <h1>{{ groupName }} Dashboard</h1>
    <Navbar_groups :group="group" :user="user" />
    <div class = flexbox>
        <GroupEventsList />
    </div>
  </body>
</template>

<script>
  import Navbar_global from '@/components/Navbar_global.vue'
  import GroupEventsList from "@/components/GroupEventsList.vue";
  import Navbar_groups from '@/components/Navbar_groups.vue'
  import { getFirestore, doc, getDoc } from 'firebase/firestore'
  import { getAuth } from 'firebase/auth';
export default {
  name: "GroupEvents",
  components : {
    Navbar_global,
    Navbar_groups,
    GroupEventsList,
  },
  data() {
    return {
      user: '',
      group: '',
      groupName: '',
      user_id: getAuth().currentUser.uid,
    }
  },

  async created() {
    try {
      this.user = this.$route.params.user // string
      this.group = this.$route.params.group; // Assuming this is the document ID
      const db = getFirestore();
      const groupDocRef = doc(db, "group", this.group);
      const groupDocSnap = await getDoc(groupDocRef);

      if (groupDocSnap.exists()) {
        this.groupName = groupDocSnap.data().GroupName; // Assuming the field for the group name is 'name'
        console.log(this.groupName);
        console.log("Group name retrieved");
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error('Error:', error);
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
  }

  hr {
    border: none; 
    height: 1.041px; 
    background-color: #ffffff; 
    margin: 0;
    padding: none;
  }

  .flexbox {
    border-bottom: 2px solid lightgrey;
    display: flex;
    flex-direction: column;
    align-items: left;
    margin-left: 85px;
    margin-top: 2px;
    margin-right: 5px;
    width: 94.5%;
    height: 85%;
    position: fixed;
    overflow: scroll;
    overflow-x: hidden;
  }
</style>