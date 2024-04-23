<script setup>
import ItemListComponent from '@/mComponents/ItemListComponent.vue';
</script>

<template>
  <div>
    <h1> All Items List </h1>
    <br/>
    <div class="grid-container">
      <div v-for="item in Items" :key="item.id" class="group">
          <ItemListComponent :item="item"/>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore, query, where} from "firebase/firestore";
import { getDoc, doc, getDocs, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const db = getFirestore(firebaseApp)

export default {
    components: {
        ItemListComponent,
    },

    data() {
        return {
            Items: [],
            filteredItems: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            filteredGroups: [],
            groupDistances: [],
            postalCode: '',
            isDropdownOpen: false,
        };
    },

    created() {
      this.fetchItems()
    },

    methods: {
      async fetchItems() { 
        const db = getFirestore();
        const q = query(collection(db, 'Items'), where('sold', '==', false));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.Items.push({ id: doc.id, ...doc.data() });
        });
      },


      async getGroup() { 
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
  }

  };
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(49%, 49% ));
}

.group {
  width: 100%; 
}

.item-list-component {
  width: 100%;
}


</style>