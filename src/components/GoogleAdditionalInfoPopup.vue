<template>
  <div class="popup">
    <h2>Complete Your Profile</h2>
    <form @submit.prevent="submit">
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
      </p>
      <button class="button" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      address: "",
      postalCode: "",
      dateOfBirth: "",
      gender: "",
      telegramHandle: "",
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
      });
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
  z-index: 1000;
}
.button {
  background-color: rgb(50, 50, 255);
  color: white;
}
</style>
