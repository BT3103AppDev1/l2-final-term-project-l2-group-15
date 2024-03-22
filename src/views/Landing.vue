<template>
  <CommonHeader />
  <LandingInfo />
</template>

<script>
import CommonHeader from "@/components/CommonHeader.vue";
import LandingInfo from "@/components/LandingInfo.vue";

export default {
  name: "Landing",
  components: {
    CommonHeader,
    LandingInfo,
  },
};
</script>
