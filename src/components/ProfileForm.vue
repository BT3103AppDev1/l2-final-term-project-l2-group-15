<template> 
<div class="headingContainer">
  <div class="headingTextContainer">
    <h1>Profile Information</h1>
  </div>
  <button class="editProfileButton" @click="editProfile">Edit Profile</button>
</div>

<div class="displayProfile">
  <div class="profileImageContainer">
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
</div>

    <div class="registerbox">
      <h3>Update Profile Page</h3>
      <p>
        <label for="username">Username</label>
        <input type="text" placeholder="Username" v-model="formData.username" />
      </p>
      <p>
        <label for="address">Address</label>
        <input type="text" placeholder="Address" v-model="formData.address" />
      </p>
      <p>
        <label for="postalCode">Postal Code</label>
        <input type="text" placeholder="Postal Code" v-model="formData.postalCode" />
      </p>
      <p>
        <label for="dateOfBirth">Date of Birth</label>
        <input type="date" v-model="formData.dateOfBirth" />
      </p>
      <p>
        <label for="gender">Gender</label>
        <select placeholder="Gender" v-model="formData.gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </p>
      <p>
        <label for="telegramHandle">Telegram Handle</label>
        <input type="text" placeholder="Telegram Handle" v-model="formData.telegramHandle"/>
      </p>
      <button @click="submitForm">Submit</button>
    </div>
</template>

<script>
import firebaseApp from "@/firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      user: getAuth().currentUser.uid,
      imgURL: "",

      editOn : true,
      
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
    this.getUserImage();
    this.getUserData();
  },

  methods: {
    async submitForm() {
      let userRef = doc(db, "users", this.user);
      try {
        await updateDoc(userRef, this.formData);
        alert("Successfully updated profile");
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] = "";
        });
      } catch (error) {
        alert("Error updating profile: " + error.message);
      }
      this.getUserData();
    },

    async getUserImage() {
      let userRef = doc(db, "users", this.user);
      try {
        let userData = await getDoc(userRef);
        console.log(userData.data().selectedIcon);
        this.imgURL = userData.data().selectedIcon;
      } catch (error) {
        console.error("Potentially, attribute does not exist for this user account");
      }
    },

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
        // // Call getUserData again after a specific interval for polling
        // setTimeout(() => this.getUserData(), 5000); // Adjust interval as needed
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    editProfile(){
      this.editOn = true;
    }
  },
};
</script>

<style scoped>
.headingContainer{
  display: flex;
  justify-content: space-between; /* Distribute elements horizontally */
  align-items: center;
} 
  
.headingTextContainer {
  text-align: center;
  width: 100%;
  align-items: center;
}

h1 {
  /* border: 2px black solid; */
  text-align: center;
  margin: 0px;
  margin-top: 15px;
}

.editProfileButton {
  cursor: pointer;
  padding: 15px 25px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: #007bff; /* Bootstrap primary */
}

img {
  width: 200px;
  height: 200px;
}

.displayProfile {
  /* border: black 2px solid; */
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

.registerbox {
  margin-top: 20px;
  padding: 25px;
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
  border-radius: 2px;
}

.registerbox button {
  margin-top: 10px;
  padding: 5px;
  background-color: white;
  border: 1px solid;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}
.registerbox button:hover {
  background-color: #b9b9b9; 
}
</style>