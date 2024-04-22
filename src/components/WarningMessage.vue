<template>
  <div class="modal">
    <div class="model-flexbox">
      <img id="warnImg" src="@/assets/warn.png" alt="warnCheck" />
      <p id="warningMessage">Warning!</p>
      <span id="message">{{ displayMessage }}</span>
      <button @click="handleConfirm">Confirm</button>
      <button @click="handleCancel">Cancel</button>
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
        this.displayMessage = "You are about to remove user from group";
      } else if (this.condition === "deleteGroup") {
        this.displayMessage = "You are about to delete group!";
      } else if (this.condition === "deleteDiscussion") {
        this.displayMessage =
          "Deleting Discussion will delete all message threads";
      } else if (this.condition === "deleteReply") {
        this.displayMessage =
          "Warning! Members will no longer be able to view deleted reply";
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
