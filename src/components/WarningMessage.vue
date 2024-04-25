<template>
  <div class="modal">
    <div class="model-flexbox">
      <span class="close" @click="handleCancel">&times;</span>
      <img id="warnImg" src="@/assets/warn.png" alt="warnCheck" />
      <span id="message">{{ displayMessage }}</span>
      <button id="button" @click="handleConfirm">Confirm</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WarningMessage",

  data() {
    return {
      displayMessage: "",
    };
  },

  props: {
    condition: {
      type: String,
      required: true,
    },
    memberid: {
      type: String,
    },
    discussionid: {
      type: String,
    },
    replyid: {
      type: String,
    },
  },

  mounted() {
    this.getMessage();
  },

  watch: {
    condition: function (newCondition) {
      this.getMessage();
    },
  },

  methods: {
    // Get the warning message from parent component
    getMessage() {
      if (this.condition === "deleteMemberFromGroup") {
        this.displayMessage =
          "Warning! You are about to remove user from group";
      } else if (this.condition === "deleteGroup") {
        this.displayMessage = "Warning! You are about to delete group!";
      } else if (this.condition === "deleteDiscussion") {
        this.displayMessage =
          "Warning! Deleting Discussion will delete all message threads";
      } else if (this.condition === "deleteReply") {
        this.displayMessage =
          "Warning! Members will no longer be able to view deleted reply";
      } else if (this.condition === "deleteEvent") {
        this.displayMessage =
          "Warning! Deleting Event will remove all joined members from Event";
      }
    },

    // Emit confirm event
    handleConfirm() {
      if (this.condition === "deleteMemberFromGroup") {
        this.$emit("confirm", this.memberid);
      } else if (this.condition === "deleteGroup") {
        this.$emit("confirm");
      } else if (this.condition === "deleteDiscussion") {
        this.$emit("confirm", this.discussionid);
      } else if (this.condition === "deleteReply") {
        this.displayMessage = this.$emit("confirm", this.replyid);
      } else if (this.condition === "deleteEvent") {
        this.displayMessage = this.$emit("confirm");
      }
    },

    // Emit close event
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.modal {
  text-align: center;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.model-flexbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgb(233, 119, 119) 62%, white 20%);
  margin: 10% auto;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  position: relative;
}

img {
  margin-top: 10px;
  width: 160px;
  height: 160px;
  padding: 0px;
  margin-bottom: 15px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

#message {
  margin-top: 20px;
  font-size: 20px;
  margin-bottom: 0px;
}

#button {
  background-color: red;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  margin-top: 15px;
}
</style>
