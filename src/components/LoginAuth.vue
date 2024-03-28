<template>
  <div class="login">
    <h1>Welcome back to ConnectHub!</h1>
    <div class="loginbox">
      <h3>Login</h3>
      <br>
      <p>
        <label for="Email">Email</label>
        <input type="text" placeholder="Email" v-model="email" />
      </p>
      <p>
        <label for="password">Password</label>
        <input type="password" placeholder="Password" v-model="password" />
      </p>
      <p><button @click="login">Login</button></p>
      <AuthPopup_login
        :isVisible = "loginStatus === 'success'"
        @close="route_user" 
      >
        <p class="success-message">Successfully logged in!</p>
      </AuthPopup_login>

      <AuthPopup :isVisible="loginStatus === 'error'" @close="loginStatus = ''">
        <p class="error-message">Login failed: {{ errorMessage }}</p>
      </AuthPopup>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import firebaseApp from "@/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AuthPopup from "@/components/AuthPopup.vue";
import AuthPopup_login from "@/components/AuthPopup_login.vue";
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
let loginStatus = ref("");
const errorMessage = ref("");
let user_id = ref("")

const auth = getAuth();
const router = useRouter();

const route_user = () => {
  loginStatus = '';
  console.log(user_id);
  router.push({ name: "UserDashboard", params: {userId : user_id}});
}

const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Login Success");
      user_id = data.user.uid;
      loginStatus.value = "success";
      // router.push({ name: "UserDashboard"});
    })
    .catch((error) => {
      console.log(error.code);
      loginStatus.value = "error";
      errorMessage.value = error.message;
    });
};
</script>

<style>
.login {
  text-align: center;
}

.loginbox {
  margin-top: 110px;
  margin-left: 30%;
  margin-right: 30%;
  padding: 30px;
  border: 1px solid;
  border-radius: 12px;
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
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
  margin-top: 10px;
  padding: 5px;
  background-color: white;
  border: 1px solid;
  border-radius: 8px;
}
</style>