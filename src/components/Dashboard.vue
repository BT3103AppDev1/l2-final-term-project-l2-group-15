<template>
  <div id="Dashboard">
    <h2>Welcome back, <strong>{{ username }}</strong>!</h2>
    <div class="features">
      <div id="Marketplace" @click="goMarketPlace" class="feature">
        <img src="../assets/marketplace.png" 
        width="82%"
        height="82%"
        alt="Marketplace" />
        <p>Discover and support local businesses in your neighbourhood!</p>
        <h3>Marketplace</h3>
      </div>

      <div id="Groups" @click="goGroups" class="feature">
        <img src="../assets/groups.png" 
        alt="Groups"
        width="86%"
        height="86%" />
        <p>Explore and join various groups within your neighborhood!</p>
        <h3>Groups and Events</h3>
      </div>
    </div>
  </div>
</template>

<script>

import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";  
import { doc, getDoc} from "firebase/firestore";

export default {
  data() {
    return {
      username: "",
      user: getAuth().currentUser.uid,
    };
  },
  methods: {
    async getUsername() {
      const db = getFirestore(firebaseApp)
      const userDocRef = doc(db, 'users', this.user)
      const userDocSnap = await getDoc(userDocRef)
      const userData = userDocSnap.data()
      this.username = userData.username
    },

    goMarketPlace() {
      console.log("goMarketplace");
      this.$router.push("/marketviewitems");
    },
    goGroups() {
      console.log("goGroups");
      this.$router.push('/all_groups');
    },
  },

  mounted() {
    this.getUsername()
  }
};
</script>

<style scoped>
body {
  font-family: 'Open Sans', Arial, sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#Dashboard {
  text-align: center;
  padding: 20px;
}

#Dashboard h2 {
  font-family: "Inconsolata", monospace;
  text-align: left;
  font-weight: 500;
  font-size: 30px;  
  margin-top: 0;
  margin-left: 15px;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.features p {
  font-family: "Poppins", sans-serif;
  font-weight: 370;
  font-style: italic;
  font-size: 16px;
  margin-top: 10px;
}

.feature {
  flex-basis: 45%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.feature img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.feature:hover {
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

h3 {
  font-family: "Poppins", sans-serif;
  font-weight: 800;
  font-style: normal;
  font-size: 25px;
  color: #005792;
}

p {
  color: #4a4a4a;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
  }

  .feature {
    flex-basis: auto;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
</style>