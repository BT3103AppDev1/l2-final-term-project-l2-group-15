<template>
  <div class="register">
    <h1>Update Profile Information</h1>
    <div class="registerbox">
      <h3>Update Profile Page</h3>
      <p>
        <label for="username">Username</label
        ><input type="text" placeholder="Username" v-model="username" />
        <button @click="change('username')">Submit</button>
      </p>
      <p>
        <label for="address">Address</label>
        <input type="text" placeholder="Address" v-model="address" />
        <button @click="change('address')">Submit</button>
      </p>
      <p>
        <label for="postalCode">Postal Code</label>
        <input type="text" placeholder="Postal Code" v-model="postalCode" />
        <button @click="change('postalCode')">Submit</button>
      </p>
      <p>
        <label for="dateOfBirth">Date of Birth</label
        ><input type="date" v-model="dateOfBirth" />
        <button @click="change('dateOfBirth')">Submit</button>
      </p>
      <p>
        <label for="gender">Gender</label>
        <select placeholder="Gender" v-model="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button @click="change('gender')">Submit</button>
      </p>
      <p>
        <label for="telegramHandle">Telegram Handle</label>
        <input
          type="text"
          placeholder="Telegram Handle"
          v-model="telegramHandle"
        />
        <button @click="change('telegramHandle')">Submit</button>
      </p>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import firebaseApp from "@/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firestore } from "@/firebase";
import { getFirestore } from "firebase/firestore"
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore"

const db = getFirestore(firebaseApp);


export default {
  data() {
    return {
      username : "",
      address : "", 
      postalCode : "",
      dateOfBirth : "",
      gender : "",
      telegramHandle : "",
    }
  },
  methods : {
    async change(field) {
      const auth = getAuth()
      const cuser = auth.currentUser
      const currentUser = cuser.uid
      let userRef = doc(db, "users", currentUser)
      let obj = {}
      switch (field) {
        case 'username':
          obj = {username: this.username}
          break;
        case 'address':
          obj = {address: this.address}
          break;
        case 'postalCode':
          obj = {postalCode: this.postalCode}
          break;
        case 'dateOfBirth':
          obj = {dateOfBirth: this.dateOfBirth}
          break;
        case 'gender':
          obj = {gender: this.gender}
          break;
        case 'telegramHandle':
          obj = {telegramHandle: this.telegramHandle}
          break;
      }
      try {
        await updateDoc(userRef, obj);
        alert("Successfully updated " + field)
      } catch(error) {
        alert("Error updating profile", error)
      }
    },
  }
}

</script>

<style scoped>
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
