<template>
  <div class="login">
    <h2>Welcome Back To ConnectHub!</h2>
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
          <button class="login-btn" @click="login">Login with email</button>
        </p>

        <p>
          <button
            type="button"
            @click="loginWithGoogle"
            class="google-login-btn"
          >
            Login with Google
          </button>
        </p>

        <SuccessMessage v-if="loginStatus === 'success'" :condition="message_passed" :user_id="user_id"/>
        <ErrorMessage v-if="showError" :condition="message_passed" :user_id="user_id" :error="error" @close="closeErrorMessage"/>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import firebaseApp from "@/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "vue-router";
import SuccessMessage from "@/components/SuccessMessage.vue"; 
import ErrorMessage from "@/components/ErrorMessage.vue"; 


const email = ref("");
const password = ref("");
let loginStatus = ref("");
let user_id = ref("");

const auth = getAuth();
const router = useRouter();

let message_passed = ref("")
let error = ref("")
let showError = ref("")

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
      error.value = errorMessage.code
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
    user_id.value = user.uid;
    loginStatus.value = "success";
    message_passed = "loginSuccess";
  } catch (error) {
    loginStatus.value = "error";
    message_passed = "errorLogin";
    email.value = "";
    password.value = "";
    error.value = error.code
    showError.value = true;
  }
}

const closeErrorMessage = () => {
  showError.value = false;
}
</script>

<style scoped>
  .login {
    text-align: center;
  }

  .loginbox {
    margin-top: 5%;
    margin-left: 35%;
    margin-right: 35%;
    border: 1px solid;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
  }

  .loginbox p {
    font-size: 11px;
    font-weight: bold;
  }

  .loginbox label {
    display: block;
    margin-bottom: 5px;
  }

  .loginbox input {
    width: 150px;
    padding: 3px;
    border: 1px solid #ccc;
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

  .login-btn {
    background-color: rgb(227, 47, 47);
    color: white;
    border: 1px solid black;
  }

  .google-login-btn {
    background-color: white;
    color: black;
    border: 1px solid;
  }
</style>
