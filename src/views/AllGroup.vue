<template>
    <Navbar_global />
    <GroupList/>
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
            user_id: getAuth().currentUser.uid,
        };

        mounted
    },
  };
  </script>
