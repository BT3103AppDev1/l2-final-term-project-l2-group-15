<template>
    <Navbar_global />
    <GroupList :user="this.user_id" />
  </template>
  
  <script>
  import Navbar_global from "@/components/Navbar_global.vue";
  import GroupList from "@/components/GroupList.vue";
  import { getAuth } from 'firebase/auth';
  
  export default {
    name: "Login",
    components: {
      GroupList,
      Navbar_global,
    },
    data() {
        return {
            user_id: this.$route.params.userId,
        };
    },
    mounted() {
        this.user_id = getAuth().currentUser.uid
        console.log("User ID is", this.user_id)
    }
  };
  </script>
