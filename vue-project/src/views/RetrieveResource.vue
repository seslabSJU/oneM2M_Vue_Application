<template>
  <div class="retrieve-resource">
    <!-- 토스트 알림 -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
    <h2>Retrieve Resource</h2>

    <!-- 주체 선택 버튼 -->
    <div class="entity-selection">
      <button v-for="entity in entities" :key="entity" 
              :class="['entity-button', { active: selectedEntity === entity }]" 
              @click="selectEntity(entity)">
        {{ entity }}
      </button>
    </div>


    <!-- 입력 폼과 요청/응답 영역 -->
    <div class="main-content">
      <!-- 입력 폼 -->
      <form @submit.prevent="handleRetrieve" class="form-section">
        <h2>Destination</h2>
        <div class="form-group">
          <label for="platformAddress">Platform Address:</label>
          <input type="text" id="platformAddress" v-model="data_obj.Platform_addr" readonly />
        </div>
        <div class="form-group">
          <label for="cseBase">CSEBase:</label>
          <select id="cseBase" v-model="data_obj.cb">
            <option value="" disabled>Select CSEBase</option>
            <option value="tinyIoT">tinyIoT</option>
            <option value="Mobius">Mobius</option>
          </select>
        </div>
        <div class="form-group" v-if="selectedEntity === 'AE'">
          <label for="resourceId">Resource ID (TO) (ex. CSEBase):</label>
          <input type="text" id="resourceId" v-model="data_obj.Res_Id" placeholder="Enter parent resource path" />
        </div>
        <div class="form-group" v-if="selectedEntity === 'Container'">
          <label for="resourceId">Resource ID (TO) (ex. CSEBase/AE_RN):</label>
          <input type="text" id="resourceId" v-model="data_obj.Res_Id" placeholder="Enter parent resource path" />
        </div>
        <div class="form-group" v-if="selectedEntity === 'ContentInstance'">
          <label for="resourceId">Resource ID (TO) (ex. CSEBase/AE_RN/CNT_RN):</label>
          <input type="text" id="resourceId" v-model="data_obj.Res_Id" placeholder="Enter parent resource path" />
        </div>
        <div class="form-group" v-if="selectedEntity === 'Subscription'">
          <label for="resourceId">Resource ID (TO) (ex. CSEBase/AE_RN/CNT_RN):</label>
          <input type="text" id="resourceId" v-model="data_obj.Res_Id" placeholder="Enter parent resource path" />
        </div>
        <div class="form-group">
          <label for="resourceName">{{ selectedEntity }} Resource Name:</label>
          <input type="text" id="resourceName" v-model="data_obj.rn" :placeholder="`Enter your ${selectedEntity} Resource name to retrieve`" />
        </div>


        <h2>Headers</h2>
        <div class="form-group">
          <label>X-M2M-RI:</label>
          <input type="text" id="x-m2m-ri" name="x-m2m-ri" autocomplete="on" v-model="data_obj.X_M2M_RI" placeholder="Enter RI with unique value" />
        </div>
        <!-- X-M2M-RVI (TinyIoT only) -->
        <div class="form-group" v-if="!isMobius">
          <label>X-M2M-RVI:</label>
          <input type="text" v-model="data_obj.X_M2M_RVI" readonly />
        </div>
        <div class="form-group">
          <label>X-M2M-Origin:</label>
          <!-- Mobius: 사용자 입력, TinyIoT: CAdmin 고정 -->
          <input v-if="isMobius" type="text" id="X-M2M-Origin" v-model="data_obj.X_M2M_Origin" placeholder="Enter Originator starts with 'C' or 'S'" />
          <input v-else type="text" value="CAdmin" readonly />
        </div>
        <div class="form-group">
          <label>Accept:</label>
          <input type="text" v-model="data_obj.Accept" readonly />
        </div>
        <div class="form-group">
          <label>X-API-KEY:</label>
          <input type="text" id="onem2m-apicode" name="onem2m-apicode" autocomplete="on" v-model="data_obj.apikey" placeholder="Enter API Key"/>
        </div>
        <div class="form-group">
          <label>X-AUTH-CUSTOM-CREATOR:</label>
          <input type="text" id="onem2m-creator" name="onem2m-creator" autocomplete="on" v-model="data_obj.creator" placeholder="Enter Creator"/>
        </div>
        <div class="form-group">
          <label>X-AUTH-CUSTOM-LECTURE:</label>
          <input type="text" id="onem2m-lecture" name="onem2m-lecture" autocomplete="on" v-model="data_obj.lecture" placeholder="Enter Lecture"/>
        </div>

        <button type="submit" class="btn-submit">Retrieve</button>
      </form>

      <!-- Request와 Response -->
      <div class="request-response">
        <div class="request">
          <h3>Request</h3>
         <!-- <div class="header">
            <p>Header</p>
            <ul>
              <li>X-M2M-RI: {{ data_obj.X_M2M_RI }}</li>
              <li>X-M2M-Origin: {{ data_obj.X_M2M_Origin }}</li>
              <li>Accept: {{ data_obj.Accept }}</li>
            </ul>
          </div>-->
          <textarea placeholder="Request Body" class="body-text" v-model="request_text" readonly></textarea>
        </div>
        <div class="response">
          <h3>Response</h3>
          <!--<div class="header">
            <p>Header</p>
            <ul>
              <li>X-M2M-RI: {{ res_items[0]['X-M2M-RI'] }}</li>
              <li>X-M2M-RSC: {{ res_items[0]['X-M2M-RSC'] }}</li>
              <li>X-M2M-RVI: {{ res_items[0]['X-M2M-RVI'] }}</li>
              <li>Content-Length: {{ res_items[0]['Content-Length'] }}</li>
              <li>Content-Type: {{ res_items[0]['Content-Type'] }}</li>
            </ul>
          </div>-->
          <textarea placeholder="Response Body" class="body-text" v-model="response_text" readonly></textarea>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import { defaultHeaders } from '../config/headers.js'

export default {
  data() {
    return {
      entities: ['AE', 'Container', 'ContentInstance', 'Subscription'], // 주체 목록
      selectedEntity: 'AE', // 기본 선택된 주체
      data_obj: {
        Platform_addr: 'https://onem2m.iotcoss.ac.kr',
        cb: '',
        Res_Id: '',
        X_M2M_RI: '',
        X_M2M_RVI: '2a',
        X_M2M_Origin: '',
        Accept: 'application/json',
        apikey: defaultHeaders.apiKey,
        creator: defaultHeaders.creator,
        lecture: defaultHeaders.lecture,
        Retrieve_text: 'GET',
      },
      req_fields: [
        { key: 'X-M2M-RI', class: 'text-center' },
        { key: 'X-M2M-Origin', class: 'text-center' },
        { key: 'X-M2M-RVI', class: 'text-center' },
        { key: 'Accept', class: 'text-center' },
      ],
      req_items: [
        { 'X-M2M-RI': '', 'X-M2M-Origin': '', 'X-M2M-RVI': '', Accept: '' },
      ],
      res_fields: [
        { key: 'X-M2M-RI', class: 'text-center' },
        { key: 'X-M2M-RSC', class: 'text-center' },
        { key: 'X-M2M-RVI', class: 'text-center' },
        { key: 'Content-Length', class: 'text-center' },
        { key: 'Content-Type', class: 'text-center' },
      ],
      res_items: [
        {
          "X-M2M-RI": "",
          "X-M2M-RSC": "",
          "X-M2M-RVI": "",
          "Content-Length": "",
          "Content-Type": "",
        },
      ],
      request_text: "",
      response_text: "",
      res_name: "",
      res_mess: "",
      res_errmess: "",
      res_status: "",
      toast: {
        show: false,
        message: '',
        type: 'info'
      }
    }
  },
  computed: {
    isMobius() {
      return this.data_obj.cb === 'Mobius'
    }
  },
  methods: {
    selectEntity(entity) {
      this.selectedEntity = entity;
      console.log(`Selected Entity: ${entity}`);
    },
    showToast(message, type = 'info') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    handleRetrieve() {
      this.showToast(`Retrieving ${this.selectedEntity}...`, 'info');
      switch(this.selectedEntity){
        case 'AE':
          console.log(this.retrieveAE())
          break;
        case 'Container':
          console.log(this.retrieveContainer())
          break;
        case 'ContentInstance':
          console.log(this.createContentInstance())
          break;
        case 'Subscription':
          console.log(this.retrieveSubscriptionResource())
          break;
      }
      this.retrieveRequest();
    },
    retrieveAE() {
      let ae_obj = {}
      ae_obj['m2m:ae'] = {}

      if (this.data_obj.rn != '') ae_obj['m2m:ae'].rn = this.data_obj.rn
      this.data_obj['Content-Type'] = 'application/json;ty=2'
      this.data_obj['Body'] = ae_obj

      let headers = {}
      headers['X-M2M-RI'] = this.data_obj.X_M2M_RI
      headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI
      headers['X-M2M-Origin'] = this.data_obj.X_M2M_Origin
      headers['Content-Type'] = this.data_obj['Content-Type']
      headers['Accept'] = this.data_obj.Accept

      this.req_display_obj = ae_obj
      this.request_header_change(headers)
      return (this.request_text = JSON.stringify(this.req_display_obj, undefined, 2))
    },
    retrieveContainer() {
      let cnt_obj = {}
      cnt_obj['m2m:cnt'] = {}

      if (this.data_obj.rn != '') cnt_obj['m2m:cnt'].rn = this.data_obj.rn
      this.data_obj['Content-Type'] = 'application/json;ty=3'
      this.data_obj['Body'] = cnt_obj

      let headers = {}
      headers['X-M2M-RI'] = this.data_obj.X_M2M_RI
      headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI
      headers['X-M2M-Origin'] = this.data_obj.X_M2M_Origin
      headers['Content-Type'] = this.data_obj['Content-Type']
      headers['Accept'] = this.data_obj.Accept

      this.req_display_obj = cnt_obj
      this.request_header_change(headers)
      return (this.request_text = JSON.stringify(this.req_display_obj, undefined, 2))
    },
    retrieveContentInstance() {
      let cin_obj = {}
      cin_obj['m2m:cin'] = {}

      if (this.data_obj.rn != '') cin_obj['m2m:cin'].rn = this.data_obj.rn
      this.data_obj['Content-Type'] = 'application/json;ty=4'
      this.data_obj['Body'] = cin_obj

      let headers = {}
      headers['X-M2M-RI'] = this.data_obj.X_M2M_RI
      headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI
      headers['X-M2M-Origin'] = this.data_obj.X_M2M_Origin
      headers['Content-Type'] = this.data_obj['Content-Type']
      headers['Accept'] = this.data_obj.Accept

      this.req_display_obj = cin_obj
      this.request_header_change(headers)
      return (this.request_text = JSON.stringify(this.req_display_obj, undefined, 2))
    },
    retrieveSubscriptionResource() {
      let sub_obj = {}
      sub_obj['m2m:sub'] = {}
      if (this.data_obj.rn != '') sub_obj['m2m:sub'].rn = this.data_obj.rn
      this.data_obj['Content-Type'] = 'application/json;ty=23'
      this.data_obj['Body'] = sub_obj

      let headers = {}
      headers['X-M2M-RI'] = this.data_obj.X_M2M_RI
      headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI
      headers['X-M2M-Origin'] = this.data_obj.X_M2M_Origin
      headers['Content-Type'] = this.data_obj['Content-Type']
      headers['Accept'] = this.data_obj.Accept

      this.req_display_obj = sub_obj
      this.request_header_change(headers)
      return (this.request_text = JSON.stringify(this.req_display_obj, undefined, 2))
    },
    request_header_change(obj) {
      console.log(obj);
      this.req_items[0]["X-M2M-RI"] = obj["X-M2M-RI"];
      this.req_items[0]["X-M2M-RVI"] = obj["X-M2M-RVI"];
      this.req_items[0]["X-M2M-Origin"] = obj["X-M2M-Origin"];
      this.req_items[0]["Accept"] = obj["Accept"];
      // this.$refs.reqtable.refresh();
    },
    response_header_change(obj) {
      console.log(obj);
      this.res_items[0]["X-M2M-RI"] = obj["X-M2M-RI"];
      this.res_items[0]["X-M2M-RSC"] = obj["X-M2M-RSC"];
      this.res_items[0]["X-M2M-RVI"] = obj["X-M2M-RVI"];
      this.res_items[0]["Content-Length"] = obj["Content-Length"];
      this.res_items[0]["Content-Type"] = obj["Content-Type"];
      // this.$refs.restable.refresh();
    },
    retrieveRequest(){
      let url = `/${this.data_obj.Res_Id}/${this.data_obj.rn}`;

      // TinyIoT면 CAdmin 고정, Mobius면 사용자 입력값 사용
      const originator = this.isMobius ? this.data_obj.X_M2M_Origin : 'CAdmin';

      const headers = {};
      headers["X-M2M-RI"] = this.data_obj.X_M2M_RI;
      headers["X-M2M-Origin"] = originator;
      headers["Accept"] = this.data_obj.Accept;
      headers["X-API-KEY"] = this.data_obj.apikey;
      headers["X-AUTH-CUSTOM-CREATOR"] = this.data_obj.creator;
      headers["X-AUTH-CUSTOM-LECTURE"] = this.data_obj.lecture;
      
      // X-M2M-RVI는 TinyIoT일 때만 포함 (Mobius는 제외)
      if (!this.isMobius) {
        headers["X-M2M-RVI"] = this.data_obj.X_M2M_RVI;
      }

      this.request_header_change(headers);
      this.request_text = JSON.stringify({ headers }, null, 2);
      
      axios
        .get(url, { headers })
        .then((response) => {
          this.res_mess = response.data;
          this.showToast('Resource retrieved successfully!', 'success');
          return (this.response_text = JSON.stringify(
            this.res_mess,
            undefined,
            2
          ));
        })
        .catch((error) => {
          if (error.response) {
            this.res_errmess = error.response.data;
            this.res_status = error.response.status;
            this.response_text = typeof this.res_errmess === 'object' 
              ? JSON.stringify(this.res_errmess, null, 2) 
              : this.res_errmess;
            this.showToast(`Error: ${this.res_status}`, 'error');
          } else if (error.request) {
            this.response_text = 'Network Error: No response from server';
            this.showToast('Network Error: No response from server', 'error');
          } else {
            this.response_text = `Error: ${error.message}`;
            this.showToast(`Error: ${error.message}`, 'error');
          }
        });
    },
  },
};

</script>

<style scoped>
.retrieve-resource {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.header{
  color: #333;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333; /* 더 진한 글씨색 */
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
  font-weight: bold; /* 버튼 텍스트를 굵게 설정 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.entity-button:hover {
  background-color: #0056b3;
}

.entity-button.active {
  background-color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.4);
}

.main-content {
  display: contents;

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
  color: #333; /* 더 진한 텍스트 색상 */
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px; /* 입력 필드 텍스트 크기 */
  color: #333; /* 입력 텍스트 색상 */
  background-color: #fff;
}

input::placeholder {
  color: #888; /* 플레이스홀더 텍스트 색상 */
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px; /* 버튼 텍스트 크기 증가 */
  font-weight: bold; /* 버튼 텍스트 굵게 */
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
  color: #333; /* 제목 텍스트를 더 진하게 */
  margin-bottom: 10px;
}

.header ul {
  list-style: none;
  padding: 0;
}
.header{
  color: #333;
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
  color: #333; /* 텍스트 색상 */
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
