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
    z-index: 1000; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center; 
    justify-content: center; 
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative; 
    background-color: #fff;
    padding: 40px;
    border-radius: 8px; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  
    width: 50%;  
    max-width: 600px;
}

.close {
    position: absolute;
    top: 10px; 
    right: 10px; 
    color: #888;
    font-size: 32px; 
    cursor: pointer;
}

.close:hover,
.close:focus {
    color: #333;  
    text-decoration: none;
}

h3 {
    margin-bottom: 20px;
}

ol {
    padding-left: 20px;
}

li {
    line-height: 1.6;  
}
</style>
