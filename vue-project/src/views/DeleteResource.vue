<template>
  <div class="delete-resource">
    <!-- 토스트 알림 -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
    <h2>Delete Resource</h2>

    <!-- 입력 폼 -->
    <form @submit.prevent="handleDelete" class="form-section">
      <h2>Destination</h2>
      <div class="form-group">
        <label>Platform Address:</label>
        <input type="text" v-model="data_obj.Platform_addr" readonly />
      </div>
      <div class="form-group">
        <label>CSEBase:</label>
        <select v-model="data_obj.cb">
          <option value="" disabled>Select CSEBase</option>
          <option value="tinyIoT">tinyIoT</option>
          <option value="Mobius">Mobius</option>
        </select>
      </div>
      <div class="form-group">
        <label>Resource ID (TO) (ex. CSEBase/AE_RN):</label>
        <input type="text" v-model="data_obj.Res_Id" placeholder="Enter parent resource path" />
      </div>
      <div class="form-group">
        <label>Resource Name to Delete:</label>
        <input type="text" v-model="data_obj.rn" placeholder="Enter Resource Name to delete" />
      </div>

      <h2>Headers</h2>
      <div class="form-group">
        <label>X-M2M-RI:</label>
        <input type="text" id="x-m2m-ri" v-model="data_obj.X_M2M_RI" placeholder="Enter RI with unique value" />
      </div>
      <!-- X-M2M-RVI (TinyIoT only) -->
      <div class="form-group" v-if="!isMobius">
        <label>X-M2M-RVI:</label>
        <input type="text" v-model="data_obj.X_M2M_RVI" readonly />
      </div>
      <div class="form-group">
        <label>X-M2M-Origin:</label>
        <!-- Mobius: 사용자 입력, TinyIoT: CAdmin 고정 -->
        <input v-if="isMobius" type="text" v-model="data_obj.X_M2M_Origin" placeholder="Enter Originator starts with 'C' or 'S'" />
        <input v-else type="text" value="CAdmin" readonly />
      </div>
      <div class="form-group">
        <label>Accept:</label>
        <input type="text" v-model="data_obj.Accept" readonly />
      </div>
      <div class="form-group">
        <label>X-API-KEY:</label>
        <input type="text" id="x-api-key" v-model="data_obj.apikey" placeholder="Enter API Key"/>
      </div>
      <div class="form-group">
        <label>X-AUTH-CUSTOM-CREATOR:</label>
        <input type="text" id="x-auth-creator" v-model="data_obj.creator" placeholder="Enter Creator"/>
      </div>
      <div class="form-group">
        <label>X-AUTH-CUSTOM-LECTURE:</label>
        <input type="text" id="x-auth-lecture" v-model="data_obj.lecture" placeholder="Enter Lecture"/>
      </div>
      <!-- 삭제 버튼 -->
      <button type="submit" class="btn-submit">Delete</button>
    </form>

    <!-- 요청 및 응답 표시 -->
    <div class="request-response">
      <div class="request">
        <h3>Request</h3>
       <!--- <div class="header">
          <p><strong>Header</strong></p>
          <ul>
            <li>X-M2M-RI: {{ data_obj.X_M2M_RI }}</li>
            <li>X-M2M-Origin: {{ data_obj.X_M2M_Origin }}</li>
            <li>X-M2M-RVI: {{ data_obj.X_M2M_RVI }}</li>
            <li>Accept: {{ data_obj.Accept }}</li>
          </ul>
        </div>-->
        <textarea v-model="request_text" placeholder="Request Body" class="body-text" readonly/>
      </div>
      <div class="response">
        <h3>Response</h3>
        <!--<div class="header">
          <p><strong>Header</strong></p>
          <ul>
            <li>X-M2M-RI: {{ res_items[0]['X-M2M-RI'] }}</li>
            <li>X-M2M-RSC: {{ res_items[0]['X-M2M-RSC'] }}</li>
            <li>X-M2M-RVI: {{ res_items[0]['X-M2M-RVI'] }}</li>
            <li>Content-Length: {{ res_items[0]['Content-Length'] }}</li>
            <li>Content-Type: {{ res_items[0]['Content-Type'] }}</li>
          </ul>
        </div>-->
        <textarea v-model="response_text" placeholder="Response Body" class="body-text" readonly/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defaultHeaders } from '../config/headers.js'

export default {
  data() {
    return {
      data_obj: {
        Platform_addr: "https://onem2m.iotcoss.ac.kr",
        cb: "",
        Res_Id: "",
        X_M2M_RI: "",
        X_M2M_Origin: "",
        X_M2M_RVI: "2a",
        Accept: "application/json",
        apikey: defaultHeaders.apiKey,
        creator: defaultHeaders.creator,
        lecture: defaultHeaders.lecture,
        rn: "",
      },
      res_items: [
        {
          'X-M2M-RI': '',
          'X-M2M-RSC': '',
          'X-M2M-RVI': '',
          'Content-Length': '',
          'Content-Type': '',
        },
      ],
      request_text: {},
      response_text: '',
      toast: {
        show: false,
        message: '',
        type: 'info'
      }
    };
  },
  computed: {
    isMobius() {
      return this.data_obj.cb === 'Mobius'
    }
  },
  methods: {
    showToast(message, type = 'info') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    handleDelete() {
      this.showToast('Deleting resource...', 'info');
      this.delete_request();
    },
    delete_request() {
      let url = `/${this.data_obj.Res_Id}/${this.data_obj.rn}`;

      // TinyIoT면 CAdmin 고정, Mobius면 사용자 입력값 사용
      const originator = this.isMobius ? this.data_obj.X_M2M_Origin : 'CAdmin';

      const headers = {
        'X-M2M-RI': this.data_obj.X_M2M_RI,
        'X-M2M-Origin': originator,
        'Accept': this.data_obj.Accept,
        'X-API-KEY': this.data_obj.apikey,
        'X-AUTH-CUSTOM-CREATOR': this.data_obj.creator,
        'X-AUTH-CUSTOM-LECTURE': this.data_obj.lecture,
      };
      
      // X-M2M-RVI는 TinyIoT일 때만 포함 (Mobius는 제외)
      if (!this.isMobius) {
        headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI;
      }

      console.log('=== POST Request Debug ===');
      console.log('URL:', url);
      console.log('Headers:', headers);
      console.log('apikey value:', this.data_obj.apikey);
      console.log('creator value:', this.data_obj.creator);
      console.log('lecture value:', this.data_obj.lecture);
      

      this.request_text = JSON.stringify({ headers }, null, 2);

      axios.delete(url, { headers })
        .then((response) => {
          this.response_text = 'Resource has been deleted successfully.';
          this.showToast('Resource deleted successfully!', 'success');
          console.log('Delete Response Headers:', response.headers);
        })
        .catch((error) => {
          // 실패 시 응답 바디 내용만 표시
          if (error.response) {
            this.response_text = JSON.stringify(error.response.data, null, 2);
            this.showToast(`Error: ${error.response.status}`, 'error');
          } else if (error.request) {
            this.response_text = 'Network Error: No response from server';
            this.showToast('Network Error: No response from server', 'error');
          } else {
            this.response_text = error.message;
            this.showToast(`Error: ${error.message}`, 'error');
          }
          console.log('Delete Error Headers:', error.response?.headers);
        });
    }
  },
};
</script>

<style scoped>
.delete-resource {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  /* 더 진한 글씨색 */
}

.entity-selection {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.entity-button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  /* 버튼 텍스트를 굵게 설정 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.entity-button:hover {
  background-color: #0056b3;
}

.main-content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
}

.form-section {
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
  /* 더 진한 텍스트 색상 */
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  /* 입력 필드 텍스트 크기 */
  color: #333;
  /* 입력 텍스트 색상 */
  background-color: #fff;
}

input::placeholder {
  color: #888;
  /* 플레이스홀더 텍스트 색상 */
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  /* 버튼 텍스트 크기 증가 */
  font-weight: bold;
  /* 버튼 텍스트 굵게 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.request-response {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.request,
.response {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #cccccc;
  margin-top: 20px;
}

.request h3,
.response h3 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  /* 제목 텍스트를 더 진하게 */
  margin-bottom: 10px;
}

.header ul {
  list-style: none;
  padding: 0;
}

.body-text {
  width: 100%;
  height: 400px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  background-color: #ffffff;
  resize: none;
  color: #333;
  /* 텍스트 색상 */
  font-size: 14px;
}

input[readonly] {
  background-color: #d4d2d2;  /* 배경색 약간 어둡게 */
  color: #333;  /* 텍스트 색상 변경 */
  cursor: not-allowed;  /* 커서 모양 변경 */
}

textarea::placeholder {
  height: fit-content;
  color: #888; /* 텍스트 에어리어 플레이스홀더 색상 */
  height: fit-content;
}

/* 토스트 알림 스타일 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.info {
  background-color: #3498db;
}

.toast.success {
  background-color: #27ae60;
}

.toast.error {
  background-color: #e74c3c;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
