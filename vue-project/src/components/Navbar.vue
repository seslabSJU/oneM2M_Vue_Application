<template>
    <nav class="navbar">
      <div class="logo-container">
        <h2>oneM2M</h2>
      </div>
      <div class="nav-links">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: currentPath === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    data() {
      return {
        menuItems: [
          { name: 'Create', path: '/create' },
          { name: 'Retrieve', path: '/retrieve' },
          { name: 'Update', path: '/update' },
          { name: 'Delete', path: '/delete' }
        ]
      }
    },
    computed: {
      currentPath() {
        return this.$route.path
      }
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    width: 200px;
    background-color: #2c3e50;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    padding: 20px 0;
    color: white;
  }
  
  .logo-container {
    padding: 0 20px;
    margin-bottom: 30px;
    text-align: center;
  }
  
  .logo-container h2 {
    color: #42b983;
    margin: 0;
  }
  
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .nav-item {
    display: block;
    padding: 12px 20px;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .nav-item:hover {
    background-color: #34495e;
    padding-left: 25px;
  }
  
  .nav-item.active {
    background-color: #42b983;
    border-left: 4px solid white;
  }
  </style>