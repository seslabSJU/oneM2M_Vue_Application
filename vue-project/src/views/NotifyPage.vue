<template>
    <div class="notify-page">
      <h1>Notifications</h1>
      <div v-if="notifications.length === 0" class="no-notifications">
        No notifications available.
      </div>
      <ul>
        <li
          v-for="notification in notifications"
          :key="notification.id"
          :class="{ read: notification.read }"
          @click="markAsRead(notification.id)"
        >
          <h3>{{ notification.title }}</h3>
          <p>{{ notification.message }}</p>
          <small>{{ formatDate(notification.timestamp) }}</small>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        notifications: [], // 알림 목록
      };
    },
    methods: {
      fetchNotifications() {
        // 서버에서 알림 데이터를 가져오는 예제
        // 실제 API 엔드포인트로 대체
        fetch("/api/notifications")
          .then((response) => response.json())
          .then((data) => {
            this.notifications = data;
          });
      },
      markAsRead(id) {
        // 알림을 읽음 상태로 변경
        const notification = this.notifications.find((n) => n.id === id);
        if (notification) {
          notification.read = true;
          // 서버로 읽음 상태를 업데이트
          fetch(`/api/notifications/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ read: true }),
          });
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleString();
      },
    },
    mounted() {
      this.fetchNotifications();
      // WebSocket 연결 설정 (옵션)
      const socket = new WebSocket("ws://your-server.com/notifications");
      socket.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        this.notifications.unshift(newNotification);
      };
    },
  };
  </script>
  
  <style>
  .notify-page {
    padding: 20px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    cursor: pointer;
  }
  li.read {
    background-color: #f0f0f0;
  }
  </style>
  