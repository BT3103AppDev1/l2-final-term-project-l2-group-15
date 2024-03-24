<template>
  <div class="register">
    <h1>Welcome to ConnectHub!</h1>
    <div class="registerbox">
      <h3>Register</h3>
      <p>
        <label for="Email">Email</label
        ><input type="text" placeholder="Email" v-model="email" />
      </p>
      <p>
        <label for="password">Password</label>
        <input type="password" placeholder="Password" v-model="password" />
      </p>
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
      <p><button @click="register">Register</button></p>

      <AuthPopup
        :isVisible="registrationStatus === 'success'"
        @close="registrationStatus = ''"
      >
        <p class="success-message">Successfully registered!</p>
      </AuthPopup>

      <AuthPopup
        :isVisible="registrationStatus === 'error'"
        @close="registrationStatus = ''"
      >
        <p class="error-message">Registration failed: {{ errorMessage }}</p>
      </AuthPopup>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import firebaseApp from "@/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, collection, addDoc, setDoc} from "firebase/firestore";
import { firestore } from "@/firebase";
import AuthPopup from "@/components/AuthPopup.vue";

const email = ref("");
const password = ref("");
const username = ref("");
const address = ref("");
const postalCode = ref("");
const dateOfBirth = ref("");
const gender = ref("");
const telegramHandle = ref("");
const registrationStatus = ref("");
const errorMessage = ref("");

const auth = getAuth();

const register = async () => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const userData = {
      uid: user.uid,
      username: username.value,
      email: user.email,
      address: address.value,
      postalCode: postalCode.value,
      dateOfBirth: dateOfBirth.value,
      gender: gender.value,
      telegramHandle: telegramHandle.value,
      events: [],
      groups: [],
    };

    const userDocRef = doc(firestore, "users", user.uid);

    await setDoc(userDocRef, userData);

    console.log("Registration Success");
    registrationStatus.value = "success";
  } catch (error) {
    console.error("Error during registration:", error);
    registrationStatus.value = "error";
    errorMessage.value = error.message;
  }
};

</script>

<style>
.register {
  text-align: center;
}

.registerbox {
  margin-left: 30%;
  margin-right: 30%;
  border: 1px solid;
  border-radius: 12px;
}

.registerbox p {
  font-size: 11px;
  font-weight: bold;
}

.registerbox label {
  display: block;
  margin-bottom: 5px;
}

.registerbox input {
  width: 150px;
  padding: 3px;
  border: 1px solid #ccc;
}

.registerbox select {
  width: 160px;
  padding: 3px;
  border: 1px solid #ccc;
}

.registerbox button {
  margin-top: 10px;
  padding: 5px;
  background-color: white;
  border: 1px solid;
  border-radius: 8px;
}
</style>
