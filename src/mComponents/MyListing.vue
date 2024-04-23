<script setup>
import MyListingComponent from '@/mComponents/MyListingComponent.vue';
import EditListing from '@/mComponents/EditListing.vue'
</script>

<template>
  <div>
    <br/>
    <div class="groupFlexbox">
      <div v-if="item_list.length === 0" class="no-item-msg">
            <h1> You have no active listings </h1>
      </div>
      <div v-for="item in item_list" :key="item.id" class="group">
        <MyListingComponent :item="item" @openPopup="togglePopup"/>
      </div>
    </div>

    <div v-if="showPopup" class="overlay">
      <EditListing @closePopup="closePopup" :itemID="currentItem"/>
    </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default {
    components: {
        MyListingComponent,
        EditListing,
    },
    data() {
        return {
            items: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            item_list: [],
            showPopup: false,
            currentItem: null,
        };
    },

    methods: {
        async fetchItems() {
            const db = getFirestore(firebaseApp)
            const userDocRef = doc(db, 'users', this.user); 
            const docSnap = await getDoc(userDocRef);
            let item_listid = docSnap.data().listedItem
            this.fetchItemObject(item_listid)
            },

        async fetchItemObject(item_listid) {
            for (const itemId of item_listid) {
                const db = getFirestore(firebaseApp)
                const ItemDocRef = doc(db, 'Items', itemId);
                const docSnap = await getDoc(ItemDocRef);
            if (docSnap.exists()) {
                this.item_list.push(docSnap.data());
                }
            }
        },

        togglePopup(itemID) {
          this.showPopup = true
          this.currentItem = itemID
        },

        closePopup() {
          this.showPopup = false
        }
    },

    mounted() {
        this.fetchItems();
    },

  };
</script>


<style scoped>
h1 {
  background-color: white;
  margin-left: 30px;
}

.btn-container {
  display: flex;
  justify-content: flex-end;
}

.groupFlexbox {
  flex-wrap: wrap;
  text-align: center;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>