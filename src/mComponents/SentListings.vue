<script setup>
import SentListingComponent from '@/mComponents/SentListingComponent.vue';
</script>

<template>
  <div>
    <br/>
      <div class = "groupFlexbox">
        <div v-for="item in item_list" :key="item.id" class="group">
          <SentListingComponent :item="item" />
        </div>
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
        SentListingComponent,
    },
    data() {
        return {
            items: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            item_list: [],
        };
    },

    methods: {
        async fetchItems() {
            const db = getFirestore(firebaseApp)
            const userDocRef = doc(db, 'users', this.user); 
            const docSnap = await getDoc(userDocRef);
            let item_listid = docSnap.data().sentRequestforItem
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
        }
    },

    created() {
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
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

</style>