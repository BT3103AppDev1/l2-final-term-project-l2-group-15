<template>
  <CommonHeader />
  <LoginAuth />
</template>

<script>
import CommonHeader from "@/components/CommonHeader.vue";
import LoginAuth from "@/components/LoginAuth.vue";

export default {
  name: "Login",
  components: {
    LoginAuth,
    CommonHeader,
  },
};
</script>
