<template>
  <div class="notify-page">
    <h1>Notifications</h1>
    <div v-if="notifications.length > 0">
      <h2>Received Notifications</h2>
      <ul>
        <li v-for="(notification, index) in notifications" :key="index">
          <pre>{{ notification }}</pre>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No notifications received yet.</p>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: "NotifyPage",
  data() {
    return {
      notifications: [] // 수신한 알림 저장
    };
  },
  mounted() {
    // Socket.IO 연결
    const socket = io('http://localhost:5000'); // Notify 서버 주소

    // 서버로부터 알림 수신
    socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      this.notifications.push(notification); // Vue 상태 업데이트
    });

    socket.on('connect', () => {
      console.log('Connected to Notify server.');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Notify server.');
    });
  }
};
</script>

<style scoped>
.notify-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>