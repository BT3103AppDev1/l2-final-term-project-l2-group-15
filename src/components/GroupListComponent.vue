<template>
    <div class="group-list-item">
        <div class="group-image">
            <span>{{ group.GroupImage }}</span>
        </div>
        <div class="group-details">
            <h3>{{ group.GroupName}}</h3>
            <p>{{ group.GroupLocation }}</p>
            <p>{{ group.GrouoDescription }}</p>
            <button class="join-btn-default">Join Group</button>
            <button class="info-btn" @click="toggle">More Info</button>
        </div>

        <div v-if="showPopup" class="modal">
            <div class="modal-content">
                <span class="close" @click="toggle">&times;</span>
                    <div class="modal-header">
                        <div class="modal-image">
                            <img :src="group.imageSrc" alt="Group Logo" />
                        </div>
                    <div class="modal-title">
                        <h3>{{ group.GroupName }}</h3>
                        <p class="distance">5km away from you</p> <!-- Add distance here -->
                    </div>
                </div>
                <div class="modal-body">
                    <p class="description">Group Description: {{ group.GroupDescription }}</p>
                    <div class="group-stats">
                        <p><strong>Total members:</strong> 20 </p>
                        <p><strong>Last event:</strong> 12/5/2023</p>
                        <p><strong>Admin:</strong> {{ group.GroupAdmin }}</p>
                    </div>
                <button class="join-btn">Join</button>
                </div>
            </div>
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
            showPopup: false,
            user: getAuth().currentUser.uid,
        }
    },

    methods: {
        toggle() {
            this.showPopup = !this.showPopup
        }
    }
  }
  </script>
  
  <style scoped>
  .group-list-item {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  margin-bottom: 1rem;
  padding: 10px;
}

.group-image {
  flex: 1;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  max-width: 20%; 
}

.group-details {
  flex: 4;
  padding-left: 20px;
}

.group-details h3 {
  margin-top: 0;
}

.join-btn-default, .info-btn {
  margin-top: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
}

.join-btn-default {
  background-color: #4CAF50; 
  color: white;
}

.info-btn {
  background-color: #008CBA;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal box styles */
.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

/* Close button styles */
.close {
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

/* Header styles */
.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* Image styles */
.modal-image {
  flex-shrink: 0;
  background-color: #ccc; 
  width: 150px; 
  height: 120px; 
  border-radius: 0%; 
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: auto;
}

.modal-title {
  flex-grow: 1;
  margin-left: 16px;
}

.modal-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.distance {
  color: #666;
  font-size: 0.875rem;
}

/* Body styles */
.modal-body {
  font-size: 0.875rem;
}

.description {
  color: #333;
  margin-bottom: 16px;
}

.group-stats p {
  margin: 4px 0;
}

.join-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color:  #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    margin: 20% auto;
    width: 95%;
  }
}
  </style>