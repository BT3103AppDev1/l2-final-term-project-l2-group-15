<template>
    <Navbar_global />
    <MyGroupList/>
  </template>
  
  <script>
  import Navbar_global from "@/components/Navbar_global.vue";
  import MyGroupList from "@/components/MyGroupList.vue";
  import { getAuth } from 'firebase/auth';
  
  export default {
    name: "Login",
    components: {
      MyGroupList,
      Navbar_global,
    },
    data() {
        return {
            user_id: getAuth().currentUser.uid,
        };
    },
  };
  </script>
