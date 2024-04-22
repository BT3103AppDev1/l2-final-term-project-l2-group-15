<script setup>
import DealReqListingComponent from '@/mComponents/DealReqListingComponent.vue';
import ContactPopup from './ContactPopup.vue';
</script>

<template>
  <div>
    <ContactPopup :userId="current_user" v-if="showPopup" @closePopup="runClose"/>
    <br/>
      <div class = "groupFlexbox">
        <div v-if="item_list.length === 0" class="no-item-msg">
            <h1> No Deal Req </h1>
        </div>
        <div v-for="item in item_list" :key="item.id" class="group">
          <DealReqListingComponent :item="item" @openPopup="runOpen" :showPopup="showPopup" />
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
        DealReqListingComponent,
        ContactPopup,
    },
    data() {
        return {
            items: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            item_list: [],
            showPopup: false,
            current_item: null,
        };
    },

    methods: {
        runClose() {
          this.showPopup = false
        },

        runOpen(item) {
          this.current_user = item
          this.showPopup = true
        },

        async fetchItems() {
            const db = getFirestore(firebaseApp)
            const userDocRef = doc(db, 'users', this.user); 
            const docSnap = await getDoc(userDocRef);
            let item_listid = docSnap.data().receivedRequestforItem
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