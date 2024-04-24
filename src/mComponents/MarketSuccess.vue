<template>
    <div class="modal-inner">
        <div class = "model-flexbox">
            <span class="close" @click="toggleSuccess">&times;</span>
            <img id="successImg" src="@/assets/check.png" alt="successCheck">
            <p id = 'successMessage'>Success!</p>
            <span id = "message">{{ message }}</span>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SuccessMessage",

    props: {
      message: {
        type: String,
        required: true
      }, 
    },

    methods: {
        toggleSuccess() {
            this.$emit('close')
        }
    },
  }
  </script>
  
  <style scoped>
  .modal-inner {
  text-align: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  }
  
  .model-flexbox {
  background: linear-gradient(lightgreen 68%, white 20%);
  margin: 10% auto;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  
  img {
  margin-top: 10px;
  margin-left: 20px;
  width: 160px;
  height: 160px;
  padding: 0px;
  margin-bottom: 0px;
  }
  
  #successMessage {
  margin-bottom: 10px;
  font-size: 30px;
  color: #12b332;
  }
  
  .close {
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  }
  
  #message {
  margin-top: 10px;
  font-size: 20px;
  margin-bottom: 0px;
  }
  
  </style>
  