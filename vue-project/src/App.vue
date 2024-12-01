<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="app-container">
    <div class="main-content">
      <Navbar />
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  display: flex !important; /* 강제로 flexbox로 변경 */
  height: 100vh; /* 전체 화면 높이 설정 */
}
</style>

<style scoped>
/* 전체 레이아웃 설정 */
.app-container {
  display: block; /* 좌측 네비게이션 바와 콘텐츠를 나란히 배치 */
  height: 100vh; /* 화면 전체 높이 */
  width: 100vw; /* 화면 전체 너비 */
  background-color: #ffffff; /* 전체 배경색 */
}

/* 네비게이션 바 */
nav {
  width: 100px;
  order: 1;
  /* 네비게이션 바의 고정 너비 */
  height: 100vh;
  background-color: #ffffff; /* 네비게이션 바 배경색 */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1; /* 남은 공간을 모두 차지 */
  order: 2;
  overflow-y: auto; /* 스크롤 필요 시 활성화 */
  background-color: #f9f9f9; /* 메인 콘텐츠 배경색 */
  padding: 20px;
}

@media screen and (min-width: 1200px) {
  nav {
    height: 100vh;
  }
}
@media screen and (max-width: 1199px) {
  nav {
    height: 65px;
  }
}
</style>
