<script setup>
import MyGroupListComponent from '@/components/MyGroupListComponent.vue';
</script>

<template>
  <div>
    <h1>My Groups</h1>
    <br/>
      <div class = "groupFlexbox">
        <div v-for="group in group_list" :key="group.id" class="group">
          <MyGroupListComponent :group="group" />
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
        MyGroupListComponent,
    },
    data() {
        return {
            groups: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            group_list: [],
        };
    },

    methods: {
        async fetchGroups() {
            const db = getFirestore(firebaseApp)
            const userDocRef = doc(db, 'users', this.user); 
            const docSnap = await getDoc(userDocRef);
            let group_listid = docSnap.data().groups
            this.fetchGroupObject(group_listid)
            },

        async fetchGroupObject(group_listid) {
            for (const groupId of group_listid) {
                const db = getFirestore(firebaseApp)
                const groupDocRef = doc(db, 'group', groupId);
                const docSnap = await getDoc(groupDocRef);
            if (docSnap.exists()) {
                this.group_list.push(docSnap.data());
                }
            }
        }
    },

    mounted() {
        this.fetchGroups();
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