<template>
    <nav class="navbar">
      <!-- 햄버거 메뉴 버튼 -->
      <div class="menu-icon" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
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
  width: 100%;
  background: #fff;
  padding: 1rem;
  display:flex;
  align-items: flex-start;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}
  
  .logo-container {
    display: block;
    padding: 0 20px;
    margin-bottom: 30px;
    text-align: center;
    align-items:flex-start;
  }
  
  .logo-container h2 {
    color: #42b983;
    margin: 0;
  }
  
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .nav-links a:hover {
  background-color: #f0f0f0;
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

  @media (max-width: 1400px) {
  .menu-icon {
    display: flex;
    order: 1;
  }

  .logo-container {
    order: 2;
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
    order: 3;
  }

  .nav-links.active {
    display: flex;
  }

  .nav-links a {
    padding: 1rem;
    text-align: center;
  }

  /* 햄버거 메뉴 애니메이션 */
  .menu-icon.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .menu-icon.active span:nth-child(2) {
    opacity: 0;
  }

  .menu-icon.active span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  /* 로고 컨테이너 반응형 조정 */
  .logo-container {
    margin: 0 auto;
  }

}
  </style>