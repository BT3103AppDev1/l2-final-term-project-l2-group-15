<template>
    <Navbar_global />
    <h1>Marketplace</h1>
</template>

<script>
  import Navbar_global from "@/components/Navbar_global.vue";
  import { getAuth } from 'firebase/auth';
  
  export default {
    name: "Marketplace",
    components: {
      Navbar_global,
    },
    data() {
        return {
            user_id: getAuth().currentUser.uid,
        };
    },
  };
  </script>
