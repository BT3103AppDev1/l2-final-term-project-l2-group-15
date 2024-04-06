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

<script>
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

export default {
  components: {
    AuthPopup,
    GoogleAdditionalInfoPopup,
  },
  data() {
    return {
      email: "",
      password: "",
      username: "",
      address: "",
      postalCode: "",
      dateOfBirth: "",
      gender: "",
      telegramHandle: "",
      registrationStatus: "",
      errorMessage: "",
      showPopup: false,
      userId: "",
      auth: getAuth(),
    };
  },
  methods: {
    async isPostalCodeValid(postalCode) {
      const regex = /^\d{6}$/;
      if (!regex.test(postalCode)) {
        return false;
      } else {
        const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
        try {
          const response = await fetch(url);
          const data = await response.json();

          // Check if there is a result
          if (data.found > 0) {
            // Iterate through result to find valid postal code
            for (const result of data.results) {
              if (result.POSTAL === postalCode) {
                return true;
              } else {
                return false;
              }
            }
          } else {
            return false;
          }
        } catch (error) {
          console.error("Error fetching data: " + error.message);
          return false;
        }
      }
    },

    // Registration Function
    async register() {
      let userCreated = false;
      try {
        const { user } = await createUserWithEmailAndPassword(
          this.auth,
          this.email,
          this.password
        );
        userCreated = true;

        const postalCodeValid = await this.isPostalCodeValid(this.postalCode);

        if (!postalCodeValid) {
          this.registrationStatus = "error";
          throw new Error("Postal code invalid. Please try again.");
        }

        const userData = {
          uid: user.uid,
          username: this.username,
          email: user.email,
          address: this.address,
          postalCode: this.postalCode,
          dateOfBirth: this.dateOfBirth,
          gender: this.gender,
          telegramHandle: this.telegramHandle,
          events: [],
          groups: [],
        };

        this.userId = user.uid;
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(userDocRef, userData);
        console.log("Registration Success");
        this.registrationStatus = "success";
      } catch (error) {
        console.error("Error during registration:", error);
        this.registrationStatus = "error";
        this.errorMessage = error.message;

        if (userCreated) {
          const user = this.auth.currentUser;
          if (user) {
            await deleteUser(user).catch((deleteError) => {
              console.error("Error deleting user:", deleteError);
            });
          }
        }
      }
    },

    // Google Registration Function
    async registerWithGoogle(event) {
      // Prevent form from submitting
      event.preventDefault();
      event.stopPropagation();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(this.auth, provider);
        const user = result.user;
        this.showPopup = true;
        this.userId = user.uid;
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          this.showPopup = false;
          this.registrationStatus = "error";
          throw new Error("Account already exists.");
        }

        const userData = {
          uid: user.uid,
          email: user.email,
        };

        await setDoc(userDocRef, userData);
      } catch (error) {
        this.showPopup = false;
        console.error("Error during registration:", error);
        this.registrationStatus = "error";
        this.errorMessage = error.message;
      }
    },

    // Function to handle popup for additional info after google authentication
    async handlePopupSubmit(additionalInfo) {
      const user = this.auth.currentUser;
      const userDocRef = doc(firestore, "users", user.uid);

      try {
        const postalCodeValid = await this.isPostalCodeValid(
          additionalInfo.postalCode
        );
        console.log(postalCodeValid);

        if (!postalCodeValid) {
          this.registrationStatus = "error";
          console.log("pt1");
          throw new Error("Postal code invalid. Please try again.");
        }
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

        this.registrationStatus = "success";
        console.log("Additional information saved successfully");
      } catch (error) {
        console.error("Error saving registration information", error);
        this.registrationStatus = "error";
        this.errorMessage = error.message;
      }
    },
  },
};
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
