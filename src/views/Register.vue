<template>
  <CommonHeader />
  <RegisterAuth />
</template>

<script>
import CommonHeader from "@/components/CommonHeader.vue";
import RegisterAuth from "@/components/RegisterAuth.vue";

export default {
  name: "Register",
  components: {
    RegisterAuth,
    CommonHeader,
  },
};
</script>
