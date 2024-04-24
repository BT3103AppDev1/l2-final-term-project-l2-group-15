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
          <CreateGroupForm/>
        </div>
    </div>
        <div v-for="(group, index) in filteredGroups" :key="group.id" class="group">
          <GroupListComponent :group="group" :distance="this.groupDistances[index].toFixed(2)"/>
        </div>
  </div>
</template>
<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { getDoc, doc, onSnapshot, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const db = getFirestore(firebaseApp)

export default {
    components: {
        GroupListComponent,
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
        };
    },

    created() {
      this.fetchGroups(); // fetch all groups possible
      this.getGroup(); // get the group id
      this.getUserPostalCode(); // get the user's postal code
      this.filterDistance(999999); // default show all groups (max range)
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

      async getGroup() { // get the group document
        const userDocRef = doc(db, "users", this.user);
        const userDocSnapshot = await getDoc(userDocRef);
        this.group = userDocSnapshot;
      },

      async getUserPostalCode() { // get the user's postal code
        const userDocRef = doc(db, "users", this.user);
        const userDocSnapshot = await getDoc(userDocRef);
        
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
        console.log(this.postalCode)
        const userLoc = await this.convertPostalcode(this.postalCode)
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
          console.log(distance)
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
        const earthRadiusKm = 6371; // Radius of the Earth in kilometers
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLon = this.degreesToRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c; // Distance in kilometers
        return distance;
      },

      // helper
      degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
      }

      // function to compute distance using routing from api
      // async calculateDistance(lat1, lon1, lat2, lon2) {
      //   const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${lat1}%2C${lon1}&end=${lat2}%2C${lon2}&routeType=walk`;
      //   try {
      //     const response = await fetch(url);
      //     const data = await response.json();
      //     if (data.status_message == "Found route between points") {
      //       console.log("managed to find route BBBBBBBBBRRRRRRROOOOOOOOOOO")
      //       return data.route_summary.total_distance
      //     } else {
      //       return 999999;
      //     }
      //   } catch(error) {
      //     throw new Error("Error fetching data: " + error.message);
      //   }
      // }
  }

  };
</script>

<style scoped>
h1 {
  background-color: white;
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
  background-color: #007bff; /* Bootstrap primary */
  margin-right: 20px; /* Adjust as needed */
}

.filter-distance-btn {
  background-color: #007bff; /* Bootstrap primary */
  margin-left: 20px; /* Adjust as needed */
}

.dropdown-menu {
  position: absolute;
  margin-left: 26.5px;
  display: grid;
  background-color: #e4e4e493; /* Match the color palette */
  width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  color: black;
}

.close-btn {
  background-color: #dc3545; 
  position: absolute; 
  right: 0; 
  top: 0;
  margin-top: 5px;
  margin-right: 5px;
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
}

.modal-content {
  position: relative;
  background-color: white;
  margin: 10% auto; /* 10% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 50%; /* Could be more or less, depending on screen size */
  height: 100% auto; /* Adjust based on content */
}
</style>