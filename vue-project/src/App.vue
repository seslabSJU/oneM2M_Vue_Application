<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
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
  display: flex; /* 좌측 네비게이션 바와 콘텐츠를 나란히 배치 */
  height: 100vh; /* 화면 전체 높이 */
  width: 100vw; /* 화면 전체 너비 */
  background-color: #2c3e50; /* 전체 배경색 */
}

/* 네비게이션 바 */
nav {
  width: 240px; /* 네비게이션 바의 고정 너비 */
  background-color: #2c3e50; /* 네비게이션 바 배경색 */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1; /* 남은 공간을 모두 차지 */
  overflow-y: auto; /* 스크롤 필요 시 활성화 */
  background-color: #f9f9f9; /* 메인 콘텐츠 배경색 */
  padding: 20px;
}
</style>