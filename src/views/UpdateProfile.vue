<template>
    <Navbar/>
    <ProfileForm/>
  </template>
  
  <script>
  import Navbar from "@/components/Navbar_global.vue";
  import ProfileForm from "@/components/ProfileForm.vue";
  
  export default {
    name: "Register",
    components: {
      Navbar,
      ProfileForm,
    },
    data() {
        return {

        };
    },
    components: {
        Navbar,
        ProfileForm,
    },
  };
  </script>