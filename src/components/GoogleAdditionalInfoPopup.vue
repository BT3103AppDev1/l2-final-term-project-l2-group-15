<template>
  <div class="popup">
    <span class="close" @click="handleCancel">&times;</span>
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
        <button
          class="iconbutton"
          type="button"
          @click="showIconSelection = true"
        >
          Choose Profile Icon
        </button>
      </div>
      <p>
        <label for="username">Username</label
        ><input type="text" placeholder="Username" v-model="username" />
      </p>
      <p>
        <label for="address">Address</label>
        <input type="text" placeholder="Address" v-model="address" />
      </p>
      <p>
        <label for="postalCode">Postal Code</label>
        <input type="text" placeholder="Postal Code" v-model="postalCode" />
      </p>
      <p>
        <label for="dateOfBirth">Date of Birth</label
        ><input type="date" v-model="dateOfBirth" />
      </p>
      <p>
        <label for="gender">Gender</label>
        <select placeholder="Gender" v-model="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </p>
      <p>
        <label for="telegramHandle">Telegram Handle</label>
        <input
          type="text"
          placeholder="Telegram Handle"
          v-model="telegramHandle"
        />
        <IconSelectionPopup
          :isVisible="showIconSelection"
          @iconSelected="iconSelected"
          @close="showIconSelection = false"
        ></IconSelectionPopup>
      </p>
      <button class="button" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import IconSelectionPopup from "@/components/IconSelectionPopup.vue";

export default {
  components: {
    IconSelectionPopup,
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
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>

<style>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  padding: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
}
.button {
  background-color: rgb(33, 33, 238);
  color: white;
  border: 1px solid;
  font-size: 11px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 5px;
  width: 27%;
  box-sizing: border-box;
  margin-bottom: 1px;
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
  padding: 10px 20px;
  margin: 10px auto;
  display: block;
  color: darkblue;
  border: none;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.icon-option img {
  display: block;
  width: auto;
  height: 50px;
}
.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}
</style>
