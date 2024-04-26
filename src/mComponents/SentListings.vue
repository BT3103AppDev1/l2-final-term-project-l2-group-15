<script setup>
import SentListingComponent from '@/mComponents/SentListingComponent.vue';
import ContactPopup from './ContactPopup.vue';
import MarketSuccess from '@/mComponents/MarketSuccess.vue';
</script>

<template>
  <div>
    <div v-if="showSuccess">
      <MarketSuccess :message="message" @close="toggleSuccessClose"/>
    </div>
    <br/>
      <ContactPopup :userId="current_user" v-if="showPopup" @closePopup="runClose"/>
      <div class = "groupFlexbox">
        <div v-if="item_list.length === 0" class="no-item-msg">
            <h1> You have no Active Sent Listings </h1>
        </div>
        <div v-for="item in item_list" :key="item.id" class="group">
          <SentListingComponent :item="item" @openPopup="runOpen" :showPopup="showPopup" @open="toggleSuccess"/>
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
        ContactPopup,
        MarketSuccess
    },
    data() {
        return {
            items: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            item_list: [],
            showPopup: false,
            current_item: null,
            message: 'Deal Request Deleted',
            showSuccess: false,
        };
    },

    methods: {
      toggleSuccessClose() {
        this.showSuccess = !this.showSuccess
        this.$router.push({ name: 'MarketplaceViewItems' })
      },

      toggleSuccess() {
        this.showSuccess = !this.showSuccess
      },

      runClose() {
        this.showPopup = false
      },

      runOpen(item) {
        this.current_user = item
        this.showPopup = true
      },

      async fetchItems() {
          const db = getFirestore(firebaseApp)
          const userDocRef = doc(db, 'users', this.user)
          const docSnap = await getDoc(userDocRef);
          let item_listid = docSnap.data().sentRequestforItem
          this.fetchItemObject(item_listid)
        },

        async fetchItemObject(item_listid) {
            for (const itemId of item_listid) {
                const db = getFirestore(firebaseApp)
                const ItemDocRef = doc(db, 'Items', itemId)
                const docSnap = await getDoc(ItemDocRef)
                const docData = docSnap.data()
                console.log(docData)
                if (docData.sold === true && docData.soldTo != this.user) {
                } else {
                  this.item_list.push(docSnap.data())
                }
            }
        }
    },

    mounted() {
        this.fetchItems();
    },

  };
</script>

<style scoped>
h1 {
  background-color: none;
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

</style>