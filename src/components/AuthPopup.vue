<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content" @click.stop>
      <slot></slot>
      <p><button class="close-button" @click="close">Close</button></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    userId: String,
    registrationStatus: String,
  },
  methods: {
    close() {
      this.$emit("close");
      if (this.registrationStatus === "success") {
        this.$router.push(`/user_dashboard/${this.userId}`);
      }
    },
  },
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 50px;
  border-radius: 5px;
}
</style>
