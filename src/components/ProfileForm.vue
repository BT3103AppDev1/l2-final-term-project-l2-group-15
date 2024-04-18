<template> 
<div class="headingContainer">
  <h1>My Profile</h1>
</div>

<div class="displayProfile">
  <div class="profileImageContainer">
    <!-- still trying to figure out to adjust image -->
    <!-- still need to include location validation for postal code -->
    <!-- still need to add part on editting profile picture -->
    <img src="@/assets/icon1.png" alt="no image"> 
  </div>

  <div class="usernameContainer">
    <p class="username">{{ userData.username }}</p>
  </div>
  
  <div class="userInfoContainer">
    <table class="userInfoTable">
      <tr>
        <td><strong>Address:</strong></td>
        <td>{{ userData.address }}</td>
      </tr>
      <tr>
        <td><strong>Postal Code:</strong></td>
        <td>{{ userData.postalCode }}</td>
      </tr>
      <tr>
        <td><strong>Date of Birth:</strong></td>
        <td>{{ userData.dateOfBirth }}</td>
      </tr>
      <tr>
        <td><strong>Gender:</strong></td>
        <td>{{ userData.gender }}</td>
      </tr>
      <tr>
        <td><strong>Telegram Handle:</strong></td>
        <td>{{ userData.telegramHandle }}</td>
      </tr>
    </table>
  </div>
  <button class="editProfileButton" @click="editProfile">Edit Profile</button>
</div>

<div v-if="isOpen" class="modal">
  <div class="registerbox">
    <button class="close-btn" @click="isOpen = false">Close</button>
    <h2>Update Profile Page</h2>
    <div class="registerbox-content">
      <label for="username">Username</label>
      <input type="text" placeholder="Username" v-model="formData.username" /><br>
      <label for="address">Address</label>
      <input type="text" placeholder="Address" v-model="formData.address" /><br>
      <label for="postalCode">Postal Code</label>
      <input type="text" placeholder="Postal Code" v-model="formData.postalCode" /><br>
      <label for="dateOfBirth">Date of Birth</label>
      <input type="date" v-model="formData.dateOfBirth" /><br>
      <label for="gender">Gender</label>
      <select placeholder="Gender" v-model="formData.gender"><br>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select><br>
      <label for="telegramHandle">Telegram Handle</label>
      <input type="text" placeholder="Telegram Handle" v-model="formData.telegramHandle"/><br>
    </div>
  <button class="registerButton" @click="submitForm">Submit</button>
  </div>
</div>

<SuccessMessage v-if="showSuccess" :condition="message_passed" @close="closeSuccessMessage"/>

</template>

<script>
import { ref } from "vue";
import firebaseApp from "@/firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import SuccessMessage from "@/components/SuccessMessage.vue"; 

const db = getFirestore(firebaseApp);

export default {
  components: {
    SuccessMessage
  },

  data() {
    return {
      user: getAuth().currentUser.uid,
      imgURL: "",
      message_passed: "updateProfile",
      showSuccess: false,

      isOpen : false,
      
      formData: {
        username: "",
        address: "",
        postalCode: "",
        dateOfBirth: "",
        gender: "",
        telegramHandle: "",
      },

      userData: {
        username: "",
        address: "",
        postalCode: "",
        dateOfBirth: "",
        gender: "",
        telegramHandle: "",
      }
    };
  },

  created() {
    // this.getUserImage();
    this.getUserData();
  },

  methods: {
    async submitForm() {
      let userRef = doc(db, "users", this.user);
      try {
        const userData = await getDoc(userRef);
        const existingData = userData.data();

        // Loop through formData and update only if the field is not empty and has changed
        Object.keys(this.formData).forEach(async (key) => {
          if (this.formData[key] && this.formData[key] !== existingData[key]) {
            try {
              await updateDoc(userRef, { [key]: this.formData[key] });
              console.log(`Updated ${key} successfully`);
            } catch (error) {
              console.error(`Error updating ${key}: ${error.message}`);
            }
          }
        });

        // Fetch updated user data after submission
        await this.getUserData();
        this.isOpen = false;
        this.showSuccess = true;
      } catch (error) {
        alert("Error updating profile: " + error.message);
      }
    },

    // async getUserImage() {
    //   let userRef = doc(db, "users", this.user);
    //   try {
    //     let userData = await getDoc(userRef);
    //     console.log(userData.data().selectedIcon);
    //     this.imgURL = userData.data().selectedIcon;
    //   } catch (error) {
    //     console.error("Potentially, attribute does not exist for this user account");
    //   }
    // },

    getPic(url) {
      console.log("@/assets/" + url)
      return "@/assets/" + url
    },

    async getUserData() {
      let userRef = doc(db, "users", this.user);
      try {
        getDoc(userRef).then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            this.userData = {
              username: data.username || "",
              address: data.address || "",
              postalCode: data.postalCode || "",
              dateOfBirth: data.dateOfBirth || "",
              gender: data.gender || "",
              telegramHandle: data.telegramHandle || ""
            };
          } else {
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    editProfile(){
      this.formData = {
        username: "",
        address: "",
        postalCode: "",
        dateOfBirth: "",
        gender: "",
        telegramHandle: "",
      };
      this.isOpen = true;
    },

    closeSuccessMessage() {
      this.showSuccess = false;
    }
  },
};
</script>

<style scoped>
h1 {
  background-color: white;
  margin-left: 30px;
  margin-bottom: 0px;
}

.editProfileButton, .close-btn {
  cursor: pointer;
  padding: 15px 25px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: #007bff; /* Bootstrap primary */
  margin-left: auto;
}

img {
  width: 200px;
  height: 200px;
}

.displayProfile {
  margin-top: 8px;
  /* border: grey 2px solid; */
  border-radius: 15px;
  padding: 10px;
  text-align: center;
  display: block;
  width: 50%;
  margin-left: 25%;
  
}

.profileImageContainer {
  display: flex-start;
}

.username {
  font-size: 30px; /* Adjust as needed */
  margin-top: 10px;
  margin-bottom: 0px;
}

.usernameContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.userInfoContainer {
  flex-grow: 1;
  padding-left: 20%;
  text-align: left;
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.userInfoTable {
  width: 100%;
}

.userInfoTable td {
  font-size: larger;
  padding: 10px;
  width: 0%;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  display: flex; /* Make modal a flex container */
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
}

.registerbox {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid;
  border-radius: 12px;
  background-color: white;
  width: 100%; /* Set width to 100% of modal */
  align-items: center;
}

.registerbox h2 {
  align-self: center;
  font-weight: bold;
}

.registerbox-content{
  /* border: 2px solid black; */
  width: 80%;
  margin-left: 1%;
}

.registerbox-content label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: large;
}

.registerbox-content input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  height: 20px;
}

.registerbox-content select {
  width: 101.5%;
  height: 35px;
  padding: 3px;
  border: 1px solid #ccc;
  margin-bottom: 30px;
}

.registerButton {
  cursor: pointer;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: #007bff; /* Bootstrap primary */
  justify-self: flex-end;
  margin-bottom: 10px;
}

.close-btn {
  background-color: #dc3545; /* Bootstrap danger */
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>