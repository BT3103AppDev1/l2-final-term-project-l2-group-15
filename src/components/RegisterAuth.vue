<template>
  <div class="register">
    <h1>Welcome to ConnectHub!</h1>
    <div class="registerbox">
      <h3>Register</h3>
      <form @submit.prevent="register">
        <div class="form">
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
        </div>

        <p>
          <button type="submit" class="register-btn">Sign Up With Email</button>
        </p>

        <AuthPopup
          :isVisible="registrationStatus === 'success'"
          :userId="userId"
          @close="registrationStatus = ''"
          :registrationStatus="registrationStatus"
        >
          <p class="success-message">Successfully registered!</p>
        </AuthPopup>

        <AuthPopup
          :isVisible="registrationStatus === 'error'"
          @close="registrationStatus = ''"
          :registrationStatus="registrationStatus"
        >
          <p class="error-message">Registration failed: {{ errorMessage }}</p>
        </AuthPopup>

        <p>
          <button
            type="button"
            @click="registerWithGoogle"
            class="google-login-btn"
          >
            Sign Up With Google
          </button>
        </p>
      </form>

      <div v-if="showPopup" class="backdrop"></div>
      <GoogleAdditionalInfoPopup v-if="showPopup" @submit="handlePopupSubmit" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import AuthPopup from "@/components/AuthPopup.vue";
import GoogleAdditionalInfoPopup from "@/components/GoogleAdditionalInfoPopup.vue";

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
const showPopup = ref(false);
const userId = ref("");

const auth = getAuth();

// Email registration
const register = async () => {
  let userCreated = false;
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    userCreated = true;

    // Check for postal code validity
    if (!isPostalCodeValid.value) {
      registrationStatus.value = "error";
      throw new Error("Postal code must be exactly 6 digits.");
    }

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

    userId.value = user.uid;
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, userData);
    console.log("Registration Success");
    registrationStatus.value = "success";
  } catch (error) {
    console.error("Error during registration:", error);
    registrationStatus.value = "error";
    errorMessage.value = error.message;
    if (userCreated) {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user).catch((deleteError) => {
          console.error("Error deleting user:", deleteError);
        });
      }
    }
  }
};

// Google registration
const registerWithGoogle = async (event) => {
  // Prevent form from submitting
  event.preventDefault();
  event.stopPropagation();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userData = {
      uid: user.uid,
      email: user.email,
    };
    showPopup.value = true;
    userId.value = user.uid;
    const userDocRef = doc(firestore, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      showPopup.value = false;
      registrationStatus.value = "error";
      throw new Error("Account already exists.");
    }

    await setDoc(userDocRef, userData);
  } catch (error) {
    console.error("Error during registration:", error);
    registrationStatus.value = "error";
    errorMessage.value = error.message;
  }
};

// Popup to submit additional info for google auth
const handlePopupSubmit = async (additionalInfo) => {
  const user = auth.currentUser;
  const userDocRef = doc(firestore, "users", user.uid);

  try {
    await setDoc(
      userDocRef,
      {
        uid: user.uid,
        email: user.email,
        username: additionalInfo.username,
        address: additionalInfo.address,
        postalCode: additionalInfo.postalCode,
        dateOfBirth: additionalInfo.dateOfBirth,
        gender: additionalInfo.gender,
        telegramHandle: additionalInfo.telegramHandle,
        events: [],
        groups: [],
      },
      { merge: true }
    );

    registrationStatus.value = "success";
    console.log("Additional information saved successfully");
    showPopup.value = false;
  } catch (error) {
    console.error("Error saving additional information:", error);
  }
};

const isPostalCodeValid = computed(() => {
  // Regular expression to match exactly 6 digits
  const regex = /^\d{6}$/;
  return regex.test(postalCode.value);
});
</script>

<style>
.register {
  text-align: center;
}

.registerbox {
  margin-left: 35%;
  margin-right: 35%;
  border: 1px solid;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
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
  padding: 5px 10px;
  font-size: 11px;
  cursor: pointer;
  margin-top: 10px;
  display: block;
  width: 50%;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 10px;
}

.registerbox button:hover {
  opacity: 0.9;
}

.register-btn {
  background-color: rgb(227, 47, 47);
  color: white;
  border: 1px solid black;
}

.google-login-btn {
  background-color: white;
  color: black;
  border: 1px solid;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>
