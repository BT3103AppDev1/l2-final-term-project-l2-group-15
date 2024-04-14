<template>
  <div class="icon-selection-popup" v-if="isVisible">
    <p class="icon-selection-title">Choose your icon</p>
    <div class="icon-container">
      <div class="icon-option" @click="selectIcon('icon1.png')">
        <img src="@/assets/icon1.png" alt="Icon 1" />
      </div>
      <div class="icon-option" @click="selectIcon('icon2.png')">
        <img src="@/assets/icon2.png" alt="Icon 2" />
      </div>
      <div class="icon-option" @click="selectIcon('icon3.png')">
        <img src="@/assets/icon3.png" alt="Icon 3" />
      </div>
    </div>
    <button type="button" @click="submitIconSelection">Confirm</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedIconPath: null,
    };
  },
  props: {
    isVisible: Boolean,
  },
  methods: {
    selectIcon(iconPath) {
      this.selectedIconPath = iconPath;
    },
    submitIconSelection() {
      this.$emit("iconSelected", this.selectedIconPath);
      this.$emit("close");
    },
  },
};
</script>

<style>
.icon-selection-title {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.icon-selection-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid;
  justify-content: center;
  align-items: center;
}

.icon-container {
  display: flex;
  justify-content: center;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
}

.icon-option {
  margin: 0 10px;
  cursor: pointer;
}

.icon-option img {
  display: block;
  width: auto;
  height: 50px;
}
</style>
