<template>
  <div class="popup-container">
    <div class="popup">
      <h3>Complete Your Profile</h3>
      <form @submit.prevent="submit">
        
        <div class="profile-icon-container">
          <div v-if="selectedIcon === 'icon1.png'" class="selected-icon">
            <img src="@/assets/icon1.png" alt="Selected Icon" />
          </div>
          <div v-else-if="selectedIcon === 'icon2.png'" class="selected-icon">
            <img src="@/assets/icon2.png" alt="Selected Icon" />
          </div>
          <div v-else-if="selectedIcon === 'icon3.png'" class="selected-icon">
            <img src="@/assets/icon3.png" alt="Selected Icon" />
          </div>
          <div v-else class="image-placeholder">
            <img src="../assets/add-icon.png" alt="Profile Icon Placeholder" />
          </div>
          <button class="iconbutton" type="button" @click="showIconSelection = true">
            Choose Profile Icon
          </button>
        </div>

        <div class = "registerbox">
          <div class = "registerbox-content">
          <label for="username">Username</label>
          <input type="text" placeholder="Username" v-model="username" /><br>
          <label for="address">Address</label>
          <input type="text" placeholder="Address" v-model="address" /><br>
          <label for="postalCode">Postal Code</label>
          <input type="text" placeholder="Postal Code" v-model="postalCode" /><br>
          <label for="dateOfBirth">Date of Birth</label
          ><input type="date" v-model="dateOfBirth" /><br>
          <label for="gender">Gender</label>
          <select placeholder="Gender" v-model="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select><br>
          <label for="telegramHandle">Telegram Handle</label>
          <input type="text" placeholder="Telegram Handle" v-model="telegramHandle"/><br>
          
          <IconSelectionPopup :isVisible="showIconSelection" @iconSelected="iconSelected" @close="showIconSelection = false" ></IconSelectionPopup>
        </div>
        <button class="button" type="submit">Submit</button>
      </div>
      </form>
    </div>
  </div>
</template>

<script>
import IconSelectionPopup from "@/components/IconSelectionPopup.vue";
import SuccessMessage from "@/components/SuccessMessage.vue"; 

export default {
  components: {
    IconSelectionPopup,
    SuccessMessage
  },
  data() {
    return {
      username: "",
      address: "",
      postalCode: "",
      dateOfBirth: "",
      gender: "",
      telegramHandle: "",
      showIconSelection: false,
      selectedIcon: "",
    };
  },
  methods: {
    submit() {
      this.$emit("submit", {
        username: this.username,
        address: this.address,
        postalCode: this.postalCode,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        telegramHandle: this.telegramHandle,
        selectedIcon: this.selectedIcon,
      });
    },
    iconSelected(iconPath) {
      this.selectedIcon = iconPath;
      console.log(this.selectedIcon);
    },
  },
};
</script>

<style scoped>
h3 {
  margin-bottom: 10px;
}

.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  overflow: auto; /* Enable scrolling if content exceeds viewport */
}

.popup {
  width: 50%;
  background: rgb(255, 255, 255);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding-top: 10px;
  padding-bottom: 0px;
}

.button {
  cursor: pointer;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: #007bff; /* Bootstrap primary */
  margin-left: auto;
  margin-bottom: 0px;
}

.image-placeholder {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin: auto;
}

.image-placeholder img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.iconbutton {
  width: 50%;
  padding: 5px 5px;
  margin: 5px auto;
  display: block;
  color: darkblue;
  border: none;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.icon-option img {
  display: block;
  width: 50px;
  height: 50px;
}

.registerbox {
  /* border: 1px solid lightgrey; */
  border-radius: 12px;
  background-color: white;
  align-items: center;
  padding: 5px;
  width: 60%;
  margin-left: 20%;
}

.registerbox h2 {
  align-self: center;
  font-weight: bold;
}

.registerbox-content label {
  font-size: small;
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  float: left;
}

.registerbox-content input {
  float: left;
  width: 97%;
  padding: 5px;
  border: 1px solid #ccc;
  height: 15px;
  margin-bottom: 5px;
}

.registerbox-content select {
  float: left;
  width: 99.5%;
  height: 25px;
  padding: 3px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
}

</style>
