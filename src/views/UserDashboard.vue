<template>
    <NavBar :user="this.user_id"/>
    <Dashboard :user="this.user_id"/>
    <MyEvents :user="this.user_id"/>
  </template>
  
  <script>
  import MyEvents from "@/components/MyEvents.vue";
  import Dashboard from "@/components/Dashboard.vue";
  import NavBar from "@/components/Navbar_global.vue";
  
  export default {
    name: "Login",
    components: {
      MyEvents,
      Dashboard,
      NavBar,
    },
    data() {
        return {
            user_id: this.$route.params.userId,
        };
    },
    //this is just to test
    mounted() {
        console.log(this.$route.params.userId)
    },
    components: {
      NavBar,
      MyEvents,
      Dashboard,
    }
  };
  </script>
  