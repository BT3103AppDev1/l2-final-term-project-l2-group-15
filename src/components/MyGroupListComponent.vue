<template>
    <div class="group-list-item">
        <div class="group-image">
            <span>{{ group.GroupImage }}</span>
        </div>
        <div class="group-details">
          <router-link :to="{name : 'SpecificGroupHome', params:{group : group.GroupName, user : user}}">
            <h3 id="groupName">{{ group.GroupName }}</h3>
          </router-link>
          <p id="groupLocation">{{ group.GroupLocation }}</p>
          <p id="groupDescription">{{ group.GroupDescription }}</p>
        </div>
    </div>
  </template>
  
<script> 
  import { getAuth } from 'firebase/auth';

  export default {
    props: {
        group: {
            type: Object,
            required: true
        },
    },

    data() {
        return {
            user: getAuth().currentUser.uid,
        }
    }
}
</script>
  
<style scoped>
.group-list-item {
    display: block;
    align-items: center;
    align-self: center;
    width: 25%;
    background-color: #f5f5f5;
    margin-bottom: 1rem;
    margin-left: 20px;
    margin-right: 20px;
    height: 400px;
    width: 350px;
    border: solid rgb(83, 83, 83);
    border-radius: 5px;
    padding: 20px;
}

.group-image {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  margin-bottom: 20px;
}

.group-details {
  display: block;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
}

#groupName {
  font-size: 30px;
  margin-top: 10px;
}

#groupDescription {
  font-size: auto;
  color: grey;
}

#groupLocation {
  font-size: auto;
  color: grey;
}
</style>