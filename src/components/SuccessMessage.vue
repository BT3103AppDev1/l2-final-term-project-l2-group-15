<template>
    <div class="modal">
        <div class = "model-flexbox">
            <span class="close" @click="toggleSuccess">&times;</span>
            <img id="successImg" src="@/assets/check.png" alt="successCheck">
            <p id = 'successMessage'>Success!</p>
            <span id = "message">{{ displayMessage }}</span>
        </div>
    </div>

    
  </template>
  
  <script>
  export default {
    name: "SuccessMessage",
  
    data() {
      return {
        displayMessage: ""
      };
    },
  
    props: {
      condition: {
        type: String,
        required: true
      }, 

      group: {
        type: String,
      },

      user: {
        type: String,
      }
    },
  
    mounted() {
      this.getMessage();
    },
    
    watch: {
      condition: function(newCondition) {
        this.getMessage();
      }
    },
  
    methods: {
      getMessage() {
        if (this.condition === "leaveGroup") {
          this.displayMessage = "You have successfully left your group!";
        } else if (this.condition === "joinGroup") {
          this.displayMessage = "You have successfully joined the group!";
        } else if (this.condition === "joinEvent") {
          this.displayMessage = "You have successfully joined the event!";
        } else if (this.condition === "createEvent") {
          this.displayMessage = "You have successfully created the event!";
        } else {
          this.displayMessage = "Blah blah blah";
        }
      },

      toggleSuccess() {
        this.showSuccess = false
        if (this.condition === "leaveGroup") {
          this.$router.push("/all_groups")
        } else if (this.condition === "joinGroup") {
          this.$router.push({ name: 'SpecificGroupHome', params: { group: this.group, user: this.user } })
        } else if (this.condition === "joinEvent") {
          // add code if need subsequent action
          this.$emit('close');
        } else if (this.condition === "createEvent") {
          // add code if need subsequent action
          this.$emit('close');
        } else {

        }
      }
    }
  };
  </script>
  
<style scoped>
.modal {
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
  