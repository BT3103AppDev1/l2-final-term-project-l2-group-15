<template>
    <div class="modal">
        <div class = "model-flexbox">
            <span class="close" @click="toggleError">&times;</span>
            <img id="errorImg" src="@/assets/close.png" alt="ErrorCross">
            <p id = 'errorMessage'>Oops!</p>
            <span id = "message">{{ displayMessage }}</span>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ErrorMessage",
  
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

      user_id: {
        type: String,
      },

      error: {
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
        if (this.condition === "errorLogin" && this.error == "auth/invalid-email") {
          this.displayMessage = "You entered an invalid email! Please try again";
        } 
        else if (this.condition === "errorLogin" && this.error == "auth/invalid-credential") {
          this.displayMessage = "Incorrect password or email! Please try again";
        }
        else if (this.condition === "errorRegistration" && this.error == "Firebase: Error (auth/email-already-in-use).") {
          this.displayMessage = "The email you entered is already in use";
        }
        else if (this.condition === "errorRegistration" && this.error == "Postal code invalid. Please try again.") {
          this.displayMessage = "Invalid postal code! Please try again.";
        }
        else if (this.condition === "errorRegistration" && this.error == "Firebase: Error (auth/invalid-email).") {
          this.displayMessage = "The email entered is invalid! Please try again.";
        }
        else {
          this.displayMessage = "Something went wrong! Please try again";
        }
      },

      toggleError() {
        if (this.condition === "errorLogin") {
          this.$emit("close")
        } else if (this.condition === "errorRegistration") {
          this.$emit("close")
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
  background: linear-gradient(rgb(255, 167, 167) 68%, white 20%);
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

#errorMessage {
  margin-bottom: 10px;
  font-size: 30px;
  color: #ff1e1e;
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
  