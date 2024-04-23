<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <h3>Participants</h3>
        <ol>
          <li v-for="participant in participants" :key="participant.id">{{ participant }}</li>
        </ol>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
        participants: Array
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
  </script>
  
  <style scoped>
.modal {
    position: fixed;
    z-index: 1000;  /* rounded to a clean number */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;  /* Using flex to center the modal content vertically and horizontally */
    align-items: center;  /* Centers content vertically */
    justify-content: center;  /* Centers content horizontally */
    background-color: rgba(0, 0, 0, 0.5);  /* Using RGBA for better clarity on transparency */
}

.modal-content {
    position: relative;  /* Ensures that close button is positioned relative to this container */
    background-color: #fff;
    padding: 40px;  /* More padding for a better visual appearance */
    border-radius: 8px;  /* Rounded corners */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  /* Subtle shadow for depth */
    width: 50%;  /* Optimal width for desktop */
    max-width: 600px;  /* Max width to avoid too wide of a modal on large screens */
}

.close {
    position: absolute;  /* Positioned relative to the modal-content */
    top: 10px;  /* Spacing from the top corner */
    right: 10px;  /* Spacing from the right corner */
    color: #888;  /* Less harsh color */
    font-size: 32px;  /* Slightly larger for better clickability */
    cursor: pointer;
}

.close:hover,
.close:focus {
    color: #333;  /* Darker shade on hover for better visibility */
    text-decoration: none;  /* Removing any underline */
}

h3 {
    margin-bottom: 20px;  /* Space after the header */
}

ol {
    padding-left: 20px;  /* Proper indentation for the list */
}

li {
    line-height: 1.6;  /* Improved line spacing for readability */
}
</style>
