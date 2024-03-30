<template>
    <div class="group-list-item">
        <div class="group-image">
            <span>{{ group.GroupImage }}</span>
        </div>
        <div class="group-details">
          <router-link :to="{name : 'SpecificGroupHome', params:{group : group.GroupId, user : user}}">
            <h3 id="groupName">{{ group.GroupName }}</h3>
          </router-link>
          <p id="groupDescription">{{ group.GroupDescription }}</p>
        </div>
    </div>
  </template>
  
<script> 
  import { getAuth } from 'firebase/auth';

  export default {
    props: {
        group: {
            type: String,
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
    height: 300px;
    width: 200px;
    border: solid rgb(216, 216, 216);
    border-radius: 5px;
    padding: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.group-list-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3; /* Limit to 3 lines in WebKit browsers */
  -webkit-box-orient: vertical;
  display: -webkit-box;
  line-height: 1.5em; /* Adjust line height for readability */
}

#groupLocation {
  font-size: auto;
  color: grey;
}
</style>