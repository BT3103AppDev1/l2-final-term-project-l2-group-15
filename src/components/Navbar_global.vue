<template>
  <div class="common-header-container">
    <h1 class="header">ConnectHub</h1>
    <div class="topnav">
      <ul>
        <li @click="goUserDashboard"><span>Home</span></li>
        <li @click="goMarketplace"><span>Marketplace</span></li>
        <li
          class="dropdown"
          @mouseover="toggleDropdown"
          @mouseleave="hideDropdown"
        >
          <span>Groups</span>
          <div v-if="showDropdown" class="dropdown-content">
            <ul>
              <li @click="goAllGroups">All Groups</li>
              <li @click="goMyGroups">My Groups</li>
            </ul>
          </div>
        </li>
        <li @click="goUpdateProfile">
          <div class="profile-container">
            Profile<img
              id="user_logo"
              src="@/assets/user.png"
              alt="user logo"
            />
          </div>
        </li>
        <li class="logout-text" @click="toggle"><span>Log Out</span></li>
      </ul>
    </div>
  </div>
  <!-- code for pop up when sign out -->
  <div v-if="showPopup" class="modal">
    <div class="modal-content">
      <span class="close" @click="toggle">&times;</span><br />
      <div class="modal-header">
        <div class="modal-title">
          <h3>Are you sure you want to log out?</h3>
        </div>
      </div>
      <button class="sign-out-button" @click="signOut">Log Out</button>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "Navbar_global",

  data() {
    return {
      showPopup: false,
      user: String,
      showDropdown: false,
    };
  },

  methods: {
    toggle() {
      this.showPopup = !this.showPopup;
    },
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Clear any user-related data or perform any other cleanup
          console.log("User signed out successfully");
          // Redirect the user to the login page or another appropriate page
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    },
    goUserDashboard() {
      // Navigate to user dashboard
      this.$router.push(`/user_dashboard/${this.user}`);
    },
    goMarketplace() {
      // Navigate to the marketplace
      this.$router.push("/marketviewitems");
    },
    goAllGroups() {
      // Navigate to all groups
      this.$router.push("/all_groups");
    },
    goMyGroups() {
      // Navigate to my groups
      this.$router.push("/my_groups");
    },
    goUpdateProfile() {
      // Navigate to update profile
      this.$router.push({ name: "UpdateProfile" });
    },
    toggleDropdown() {
      this.showDropdown = true;
    },
    hideDropdown() {
      this.showDropdown = false;
    },
  },
};
</script>

<style scoped>
.common-header-container {
  background-color: #1E0342;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.header {
  color: white;
  margin: 0px;
  margin-left: 30px;
  justify-self: center;
  padding-top: 11px;
  padding-bottom: 11px;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.topnav {
  background-color: #1E0342;
  height: 65px;
  margin: 0px;
  display: flex;
  justify-content: flex-end;
}

.topnav ul {
  display: inline-flex;
  list-style: none;
  color: white;
  margin-right: 0px;
  text-align: center;
  font-size: 17px;
  display: flex;
  justify-content: center;
  margin-top: 0px;
  font-family: Arial, Helvetica, sans-serif;
}

.topnav ul li {
  padding-left: 15px;
  padding-right: 15px;
  width: 100px;
  height: 65px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topnav ul li:hover {
  color: white; 
  background-color: #0066ff;
}

.dropdown:hover .dropdown-content {
  display: flex;
  color: black;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100px; 
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  margin-top: 195px;
}

.dropdown-content ul {
  list-style: none;
  padding: 0px;
  margin: 0px;
  color: black;
  display: inline-block;
}

.dropdown-content ul li {
  color: black;
  padding-top: 0px;
  padding-bottom: 0px;
}

.dropdown-content ul li:hover {
  background-color: #0066ff;
  color: white;
}

#user_logo {
  height: 30px;
  width: 30px;
  padding-left: 5px;
  margin: 0px;
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center; 
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 105%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  padding-top: 5px;
  padding-bottom: 30px;
  border-radius: 8px;
  width: 90%;
  height: 20%;
  max-width: 500px;
}

.close {
  float: right;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

.modal-header {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.modal-title {
  flex-grow: 1;
  margin-left: 16px;
}

.modal-title h3 {
  margin: 0;
  margin-top: 10px;
  color: #333;
  font-size: 30px;
  text-align: center;
}

.sign-out-button {
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: #007bff;
  float: right;
  transition: background-color 0.3s ease, color 0.3s ease; 
}

.sign-out-button:hover {
  background-color: #0056b3;
}
</style>
