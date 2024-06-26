<script setup>
import GroupListComponent from '@/components/GroupListComponent.vue';
import CreateGroupForm from '@/components/CreateGroupForm.vue';
</script>

<template>
  <div>
    <h1>All Groups Near Me</h1>
    <div class="btn-container">
      <div class="dropdown">
        <button class="filter-distance-btn" @click="toggleDropdown">
          Filter Distance
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-menu" v-if="isDropdownOpen" @mouseleave="closeDropdown">
          <button class="dropdown-option" @click="filterDistance(999999)">reset</button>
          <button class="dropdown-option" @click="filterDistance(0.5)">0.5 km</button>
          <button class="dropdown-option" @click="filterDistance(1)">1 km</button>
          <button class="dropdown-option" @click="filterDistance(2)">2 km</button>
          <button class="dropdown-option" @click="filterDistance(5)">5 km</button>
          <button class="dropdown-option" @click="filterDistance(10)">10 km</button>
        </div>
      </div>
        <button class="create-group-btn" @click="isOpen = true">Create Group</button>
    </div>
    <br>
    <div v-if="isOpen" class="modal">
        <div class="modal-content">
          <button class="close-btn" @click="isOpen = false">Close</button>
          <CreateGroupForm @added="openSuccess"/>
        </div>
    </div>
        <div v-for="(group, index) in filteredGroups" :key="group.id" class="group">
          <GroupListComponent :group="group" :distance="groupDistances[index].toFixed(2)"/>
        </div>
  </div>

  <SuccessMessage v-if="showSuccess" :condition="message_passed" :user="user" :group="group"/>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { getDoc, doc, onSnapshot, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import SuccessMessage from './SuccessMessage.vue';

const db = getFirestore(firebaseApp)

export default {
    components: {
        GroupListComponent,
        SuccessMessage,
    },

    data() {
        return {
            groups: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            filteredGroups: [],
            groupDistances: [],
            postalCode: '',
            isDropdownOpen: false,

            showSuccess: false,
            message_passed: "createGroup",
            group: "",
        };
    },

    created() {
      this.getUserPostalCode();
    },

    mounted() {// default show all groups (max range)
      this.fetchGroups(); // fetch all groups possible
      this.getUserPostalCode().then(this.filterDistance(99999)); // get the user's postal code
    },

    methods: {
      fetchGroups() { // retrieve all groups
      const unsubscribe = onSnapshot(collection(db, "group"), (querySnapshot) => {
        this.groups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        });
      },
      
      async getUserPostalCode() { // get the user's postal code
        const userDocRef = doc(db, "users", this.user);
        const userDocSnapshot = await getDoc(userDocRef);
        this.postalCode = userDocSnapshot.data().postalCode
        if (userDocSnapshot.exists()) {
            this.postalCode = userDocSnapshot.data().postalCode;
        } else {
            console.error("User document does not exist.");
        }
      },

      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },

      closeDropdown() {
        this.isDropdownOpen = false;
      },

      // fill filteredGroups array based on dist
      async filterDistance(dist) {
        this.filteredGroups = []; // Clear previous filtered groups
        this.groupDistances = [];
        var distance = 0
        const userDocRef = doc(db, "users", this.user);
        const userDocSnapshot = await getDoc(userDocRef);
        const userPostal = userDocSnapshot.data().postalCode
        const userLoc = await this.convertPostalcode(userPostal)
        const lat1 = userLoc.latitude
        const long1 = userLoc.longitude
        for (const g of this.groups) {
          const groupLocation = await this.convertPostalcode(g.GroupLocation);
          const lat2 = groupLocation.latitude;
          const long2 = groupLocation.longitude;
          if (lat2 == 0 && long2 == 0) { // if the location was not found
            distance = 99999999;  // set max distance
          } else {
            distance = this.calculateDistance(lat1, long1, lat2, long2);
          }
          if (distance <= dist) {
            this.filteredGroups.push(g);
            this.groupDistances.push(distance);
          }
        }
        console.log(this.filteredGroups)
      },

      // function to convert postal code to lat and long
      async convertPostalcode(postalCode) { // need to handle as promise after function call
        const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.found > 0 && data.results.length > 0) {
            const result = data.results[0];
            const latitude = result.LATITUDE;
            const longitude = result.LONGITUDE;
            return { latitude, longitude };
          } else {
            return { latitude: 0, longitude: 0 };
          }
        } catch (error) {
          throw new Error("Error fetching data: " + error.message);
        }
      },

      // function to compute distance
      calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadiusKm = 6371;
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLon = this.degreesToRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c; // Distance in kilometers
        return distance;
      },

      degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
      },

      openSuccess(groupData){
        this.user = groupData.user
        this.group = groupData.group
        this.isOpen = false;
        this.showSuccess = true;
      }
  }

  };
</script>

<style scoped>
h1 {
  background-color: none;
  margin-left: 30px;
}

.btn-container {
  display: flex;
  justify-content: space-between;
}

.create-group-btn, .close-btn, .filter-distance-btn {
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

.create-group-btn {
  background-color: #2ea24f;
  margin-right: 20px;
  font-weight: 400;
  border: 1px solid grey;
}

.filter-distance-btn {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  margin-left: 20px;
  background-color: #d7d2d2;
  color: black;
  border: 0.5px gray solid;
}

.filter-distance-btn:hover {
  background-color: darkgray;
}

.create-group-btn:hover {
  background-color: darkgreen;
}

.dropdown-menu {
  position: absolute;
  margin-left: 23.5px;
  display: grid;
  background-color: #e4e4e493; 
  width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  color: black;
}

.close-btn {
  background-color: #dc3545;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: white;
  margin: 10% auto; 
  padding: 20px;
  border: 1px solid #888;
  width: 50%; 
  height: 100% auto; 
}

</style>