<template>
  <div class="register">
    <div class="registerbox">
      <h3>Sign Up</h3>
      <form @submit.prevent="register">
        <div class="form">
          <div class="formcol">
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
              <input
                type="text"
                placeholder="Postal Code"
                v-model="postalCode"
              />
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
          <div class="formcol">
            <div class="profile-icon-container">
              <div v-if="selectedIcon === 'icon1.png'" class="selected-icon">
                <img src="@/assets/icon1.png" alt="Selected Icon" />
              </div>

              <div
                v-else-if="selectedIcon === 'icon2.png'"
                class="selected-icon"
              >
                <img src="@/assets/icon2.png" alt="Selected Icon" />
              </div>

              <div
                v-else-if="selectedIcon === 'icon3.png'"
                class="selected-icon"
              >
                <img src="@/assets/icon3.png" alt="Selected Icon" />
              </div>

              <div v-else class="image-placeholder">
                <img
                  src="../assets/add-icon.png"
                  alt="Profile Icon Placeholder"
                />
              </div>
              <button
                class="iconbutton"
                type="button"
                @click="showIconSelection = true"
              >
                Choose Profile Icon
              </button>
            </div>
            <div class="emailpwgroup">
              <p>
                <label for="Email">Email</label
                ><input type="text" placeholder="Email" v-model="email" />
              </p>
              <p>
                <label for="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  v-model="password"
                />
              </p>
            </div>
          </div>
        </div>

        <p>
          <button type="submit" class="register-btn">Sign Up With Email</button>
        </p>
        <IconSelectionPopup
          :isVisible="showIconSelection"
          @iconSelected="iconSelected"
          @close="showIconSelection = false"
        ></IconSelectionPopup>

        <SuccessMessage v-if="registrationStatus === 'success'" :condition="message_passed" :user_id="user_id"/>
        <ErrorMessage v-if="showError" :condition="message_passed" :user_id="user_id" :error="errorMessage" @close="closeErrorMessage"/>

        <!-- <AuthPopup
          :isVisible="registrationStatus === 'error'"
          @close="registrationStatus = ''"
          :registrationStatus="registrationStatus"
        >
          <p class="error-message">Registration failed: {{ errorMessage }}</p>
        </AuthPopup> -->

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
    </div>

    <div v-if="showPopup" class="backdrop">
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
import IconSelectionPopup from "@/components/IconSelectionPopup.vue";
import SuccessMessage from "./SuccessMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue"; 


export default {
  components: {
    AuthPopup,
    GoogleAdditionalInfoPopup,
    IconSelectionPopup,
    SuccessMessage,
    ErrorMessage,
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
      user_id: "",
      auth: getAuth(),
      showIconSelection: false,
      selectedIcon: null,
      isLoading: false,

      showPopup: false,

      registrationStatus: "",
      errorMessage: "",
      showError: false,
      message_passed: "",
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
                break;
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
        // cretae user account in firebase
        const { user } = await createUserWithEmailAndPassword(
          this.auth,
          this.email,
          this.password
        );
        userCreated = true;

        const postalCodeValid = await this.isPostalCodeValid(this.postalCode);

        // postal code validation
        if (!postalCodeValid) {
          this.registrationStatus = "error";
          throw new Error("Postal code invalid. Please try again.");
        }

        // check if all fields field validation
        if (!this.email || !this.password || !this.username || !this.address || !this.postalCode || !this.dateOfBirth || !this.gender || !this.telegramHandle || !this.selectedIcon) {
          this.registrationStatus = "error";
          throw new Error("Please make sure all fields are filled.");
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
          selectedIcon: this.selectedIcon,
          events: [],
          groups: [],
        };

        this.user_Id = user.uid;
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(userDocRef, userData);
        console.log("Registration Success");
        this.registrationStatus = "success";
        this.message_passed = "registrationSuccess"
      } catch (error) {
        console.error("Error during registration:", error);
        this.registrationStatus = "error";
        this.showError = true;
        this.message_passed = "errorRegistration"
        this.errorMessage = error.message;
        console.log("hereeee -->", this.errorMessage, "lol")

        // if error, delete user
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
        this.user_Id = user.uid;
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
      if (this.isLoading) return;
      this.isLoading = true;

      const user = this.auth.currentUser;
      const userDocRef = doc(firestore, "users", user.uid);

      try {
        // First, validate the postal code
        const postalCodeValid = await this.isPostalCodeValid(
          additionalInfo.postalCode
        );
        console.log(postalCodeValid);

        if (!postalCodeValid) {
          this.registrationStatus = "error";
          this.errorMessage = "Postal code invalid. Please try again.";
          console.log("pt1");
          return;
        }

        // If the postal code is valid, proceed to save the additional information
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
            selectedIcon: additionalInfo.selectedIcon,
            events: [],
            groups: [],
          },
          { merge: true }
        );

        this.registrationStatus = "success";
        this.message_passed = "registrationSuccess"
        console.log("Additional information saved successfully");
      } catch (error) {
        console.error("Error saving registration information", error);
        this.registrationStatus = "error";
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    iconSelected(iconPath) {
      this.selectedIcon = iconPath;
      console.log(this.selectedIcon);
    },

    closeGooglePopUp(){
      this.showPopup = false;
      console.log("working")
    },

    closeErrorMessage() {
      this.showError = false;
    }
  },
  computed: {
    imageSrc() {
      console.log(`@/assets/${this.selectedIcon}`);
      return new URL(`@/assets/${this.selectedIcon}`, import.meta.url).href;
    },
  },
};
</script>

<style scoped>
  .register {
    text-align: center;
  }

  .registerbox {
    margin-top: 3%;
    margin-left: 25%;
    margin-right: 25%;
    border: 1px solid;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .registerbox button:hover {
    opacity: 0.9;
  }

  .form {
    display: flex;
    justify-content: space-between;
    margin-inline: 40px;
  }

  .formcol {
    padding: 0 30px;
  }

  .emailpwgroup {
    margin-top: 50px;
  }

  .profile-icon-container {
    margin-top: 40px;
  }

  .register-btn {
    background-color: rgb(227, 47, 47);
    color: white;
    border: 1px solid black;
    font-size: 11px;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 1px;
    width: 40%;
    box-sizing: border-box;
    margin-bottom: 1px;
  }

  .google-login-btn {
    background-color: white;
    color: black;
    border: 1px solid;
    font-size: 11px;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 1px;
    width: 40%;
    box-sizing: border-box;
    margin-bottom: 1px;
  }

  .iconbutton {
    padding: 5px 10px;
    font-size: 11px;
    cursor: pointer;
    margin-top: 10px;
    display: block;
    width: 75%;
    box-sizing: border-box;
    margin-bottom: 10px;
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
    width: 50%;
    height: 50%;
    padding-left: 8px;
    object-fit: cover;
  }

  .selected-icon img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  .iconbutton {
    width: 100%;
    padding: 5px 5px;
    display: block;
    color: darkblue;
    border: none;
    background-color: white;
    cursor: pointer;
    font-size: 13px;
  }
</style>
