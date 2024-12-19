<template>
    <nav class="navbar">
      <!-- 햄버거 메뉴 버튼 -->
      <div class="nav-start">
        <div class="menu-icon" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="nav-title">TinyIoT</span>
      </div>

      <div class="logo-container">
        <h2>TinyIoT</h2>
      </div>

      <div class="nav-links" :class="{ 'active': isMenuOpen }">
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
    name: 'SideNavbar',
    data() {
      return {
        menuItems: [
          { name: 'Create', path: '/create' },
          { name: 'Retrieve', path: '/retrieve' },
          { name: 'Update', path: '/update' },
          { name: 'Delete', path: '/delete' }
        ],
        isMenuOpen: false
      }
    },
    computed: {
      currentPath() {
        return this.$route.path
      }
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen
      }
    }
  }
  </script>

  <style scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    background: #fff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .nav-start {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-title {
    display: none;
  }

  .logo-container {
    display: block;
    padding: 10px 0;
    margin-bottom: 20px;
    text-align: center;
  }

  .logo-container h2 {
    color: #42b983;
    margin: 0;
    font-size: 24px;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: -1rem;
    margin-right: -1rem;
  }

  .nav-item {
    display: block;
    width: 100%;
    padding: 12px 20px;
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
  }

  .nav-item:hover {
    background-color: #34495e;
    color: white;
    padding-left: 25px;
  }

  .nav-item.active {
    background-color: #42b983;
    color: white;
    border-left: 4px solid white;
  }

  .menu-icon {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 10px;
  }

  .menu-icon span {
    display: block;
    width: 25px;
    height: 3px;
    background: #333;
    transition: 0.3s;
  }

  @media (max-width: 1200px) {
    .nav-start {
      order: 1;
      margin-right: auto;
    }

    .nav-title {
      display: block;
      order: 2;
      font-size: 1.5rem;
      font-weight: bold;
      color: #42b983;
    }

    .navbar {
      height: auto;
      width: 100%;
      flex-direction: row;
      align-items: center;
      padding: 1rem;
    }

    .logo-container {
      display: none;
    }

    .menu-icon {
      display: flex;
      order: 1;
    }

    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
      display: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 0;
    }

    .nav-links.active {
      display: flex;
    }

    .nav-links a {
      padding: 1rem;
      text-align: center;
    }

    .menu-icon.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .menu-icon.active span:nth-child(2) {
      opacity: 0;
    }

    .menu-icon.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
  </style>
