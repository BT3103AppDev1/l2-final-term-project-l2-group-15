<template>
  <div class="login">
    <div class="landing-div">
      <h2 class="landing-text">Welcome back to <span>ConnectHub</span>!</h2>
    </div>
    <div class="loginbox">
      <h3>Login</h3>
      <form @submit.prevent="login">
        <p>
          <label for="Email">Email</label>
          <input type="text" placeholder="Email" v-model="email" />
        </p>
        <p>
          <label for="password">Password</label>
          <input type="password" placeholder="Password" v-model="password" />
        </p>

        <p>
          <button class="login-btn" @click="login">
            <img
              src="@/assets/maillogo.png"
              alt="Email Icon"
              class="email-icon"
            />
            &nbsp;Login with email
          </button>
        </p>

        <p>
          <button
            type="button"
            @click="loginWithGoogle"
            class="google-login-btn"
          >
            <img
              src="@/assets/google_logo.png"
              alt="Google Icon"
              class="google-icon"
            />
            Login with Google
          </button>
        </p>

        <SuccessMessage
          v-if="loginStatus === 'success'"
          :condition="message_passed"
          :user_id="user_id"
        />
        <ErrorMessage
          v-if="showError"
          :condition="message_passed"
          :user_id="user_id"
          :error="error"
          @close="closeErrorMessage"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import firebaseApp, { firestore } from "@/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import SuccessMessage from "@/components/SuccessMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const email = ref("");
const password = ref("");
let loginStatus = ref("");
let user_id = ref("");

const auth = getAuth();
const router = useRouter();

let message_passed = ref("");
let error = ref("");
let showError = ref("");

const route_user = () => {
  loginStatus = "";
  console.log(user_id);
  router.push({ name: "UserDashboard", params: { user_id: user_id } });
};

// Email Login
const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Login Success");
      user_id = data.user.uid;
      loginStatus.value = "success";
      message_passed = "loginSuccess";
    })
    .catch((errorMessage) => {
      console.log(errorMessage.code);
      loginStatus.value = "error";
      message_passed = "errorLogin";
      email.value = "";
      password.value = "";
      error.value = errorMessage.code;
      showError.value = true;
    });
};

// Google Login
const loginWithGoogle = async (event) => {
  // Prevent form from submitting
  event.preventDefault();
  event.stopPropagation();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(firestore, "users", user.uid);
    // Get the document
    const userDocSnap = await getDoc(userDocRef);
    console.log("hi");
    // Check if the document exists
    if (userDocSnap.exists()) {
      // Document exists, proceed with login
      user_id.value = user.uid;
      loginStatus.value = "success";
      message_passed = "loginSuccess";
    } else {
      loginStatus.value = "error";
      message_passed = "errorLoginNotRegisteredGoogle";
      error.value = "Login but not registered with google";
      showError.value = true;
      try {
        await user.delete();
        console.log("User account deleted successfully");
      } catch (error) {
        console.error("Error deleting user account:", error);
      }
    }
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      console.log("Popup closed by user");
    } else {
      loginStatus.value = "error";
      message_passed = "errorLogin";
      email.value = "";
      password.value = "";
      error.value = error.code;
      showError.value = true;
    }
  }
};

const closeErrorMessage = () => {
  showError.value = false;
};

</script>
<style scoped>
.landing-div {
  max-width: 30%;
  margin: 0 auto;
}

.landing-text {
  font-family: "Inconsolata", monospace;
  font-weight: 500;
  margin-top: 0;
  margin-left: 15px;
  text-align: center; 
  overflow: hidden; 
  white-space: nowrap; 
  animation: typewriter 3s steps(40); 
  margin-top: 20px;
  margin-bottom: 0;
}

.landing-text span {
  color: #ed7117;
  font-family: "Poppins", sans-serif;
  font-weight: 800;
  font-style: normal;
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.login {
  text-align: center;
}

.loginbox {
  margin-top: 0.5%;
  margin-left: 35%;
  margin-right: 35%;
  border: 2px grey;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.loginbox p {
  font-size: 11px;
  font-weight: bold;
}

.loginbox label {
  display: block;
  margin-bottom: 5px;
  font-size: larger;
  text-align: left;
}

.loginbox input {
  width: 150px;
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.loginbox button {
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

.loginbox button:hover {
  opacity: 0.9;
}

.email-icon {
  height: 20px;
  width: auto;
  vertical-align: middle;
  margin-right: 10px;
}

.google-icon {
  height: 20px;
  width: auto;
  vertical-align: middle;
  margin-right: 4px;
}

.login-btn {
  background-color: rgb(255, 255, 255);
  color: black;
  border: 1px solid black;
  border-radius: 6px;
}

.login-btn:hover {
  background-color: lightgrey;
}

.google-login-btn {
  background-color: white;
  color: black;
  border: 1px solid;
  border-radius: 8px;
}

.google-login-btn:hover{
  background-color: lightgrey;
}

@media (max-width: 768px) {
  .loginbox {
    margin-left: 10%;
    margin-right: 10%;
  }
}

.email-icon {
  height: 20px;
  width: auto;
  vertical-align: middle;
  margin-right: 10px;
}

.google-icon {
  height: 21px;
  padding: 0px;
  margin: 0px;
  width: auto;
  vertical-align: middle;
  margin-right: 4px;
}
</style>