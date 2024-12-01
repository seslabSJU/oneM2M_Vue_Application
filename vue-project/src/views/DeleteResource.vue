<template>
    <div>
      <h2>Delete Resource</h2>
      
      <!-- 탭 버튼들 -->
      <div class="tab-buttons">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
  
      <!-- 폼 영역 -->
      <form @submit.prevent="handleDelete">
        <!-- 공통 필드 -->
        <div v-if="currentTab !== ''">
          <div>
            <label>Platform Address:http://127.0.0.1:3000</label> <!-- server 주소 고정 값 -->
          </div>
          <div>
            <label>CSEBase:TinyIoT</label> <!-- CSEBase 고정 값 -->
          </div>
          <div>
            <label>Delete_RN:</label>
            <input type="text" v-model="data_obj.rn" placeholder="Name of Resource to Delete" />
          </div>
        </div>
  
        <!-- AE 삭제 -->
        <div v-if="currentTab === 'ae'">
          <p>AE Resource Delete: /{CSEBase}/{AE_Name}</p>
        </div>
  
        <!-- Container 삭제 -->
        <div v-if="currentTab === 'container'">
          <p>Container Resource Delete: /{CSEBase}/{AE_Name}/{Container_Name}</p>
        </div>
  
        <!-- ContentInstance 삭제 -->
        <div v-if="currentTab === 'contentInstance'">
          <p>ContentInstance Resource Delete: /{CSEBase}/{AE_Name}/{Container_Name}/{CIN_Name}</p>
        </div>
  
        <!-- Subscription 삭제 -->
        <div v-if="currentTab === 'subscription'">
          <p>Subscription Resource Delete: /{CSEBase}/{AE_Name}/{Container_Name}/{SUB_Name}</p>
        </div>
  
        <!-- 삭제 버튼 -->
        <button type="submit" class="delete-btn">Delete</button>
      </form>
  
      <!-- 응답 표시 -->
      <div v-if="response_text">
        <h3>Response:</h3>
        <pre>{{ response_text }}</pre>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        currentTab: '',
        tabs: [
          { id: 'ae', name: 'AE' },
          { id: 'container', name: 'Container' },
          { id: 'contentInstance', name: 'Content Instance' },
          { id: 'subscription', name: 'Subscription' }
        ],
        res_name: '',
        data_obj: {
          Platform_addr: '127.0.0.1:3000',
          Res_Id: 'TinyIoT',
          X_M2M_RI: '12345',
          X_M2M_RVI: '2a',
          X_M2M_Origin: 'CAdmin',
          Accept: 'application/json',
  
          lbl: '',
          mni: '',
          mbs: '',
          ty: '',
          op: '',
          api: '',
          rr: true,
          con: '',
          rn: '',
          nu: '',
          enc: '',
          exc: '10',
          net: [3, 4],
          poa: [],
          cb: '',
          csi: '',
          srv: ['1', '2', '2a'],
          pv_acr: [],
          pvs_acr: [],
          mid: [],
          mnm: '',
          mt: '',
          csy: '',
        },
        req_fields: [
          { key: 'X-M2M-RI', class: 'text-center' },
          { key: 'X-M2M-Origin', class: 'text-center' },
          { key: 'X-M2M-RVI', class: 'text-center' },
          { key: 'Content-Type', class: 'text-center' },
          { key: 'Accept', class: 'text-center' },
        ],
        req_items: [
          { 'X-M2M-RI': '', 'X-M2M-Origin': '', 'X-M2M-RVI': '', 'Content-Type': '', Accept: '' },
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
            'X-M2M-RI': '',
            'X-M2M-RSC': '',
            'X-M2M-RVI': '',
            'Content-Length': '',
            'Content-Type': '',
          },
        ],
        headers_text: '',
        query_Params: '',
        request_text: '',
        response_text: '',
        res_mess: '',
        res_errmess: '',
        res_status: '',
      }
    },
    methods: {
      handleDelete() {
        this.delete_request()
      },
      delete_request() {
        let resourcePath = this.getResourcePath()
        let url = `http://${this.data_obj.Platform_addr}/${this.data_obj.Res_Id}${resourcePath}`
        
        const headers = {
          'X-M2M-RI': this.data_obj.X_M2M_RI,
          'X-M2M-Origin': this.data_obj.X_M2M_Origin,
          'Accept': this.data_obj.Accept
        }
  
        axios.delete(url, { headers })
          .then((response) => {
            this.response_text = 'Resource has been deleted successfully.'
            this.res_status = response.status
          })
          .catch((error) => {
            this.response_text = `Delete Failed: ${error.response?.data || error.message}`
            this.res_status = error.response?.status
          })
      },
      getResourcePath() {
        // 리소스 타입에 따른 경로 생성
        switch (this.currentTab) {
          case 'ae':
            return `/${this.data_obj.rn}`
          case 'container':
            return `/${this.data_obj.rn}`
          case 'contentInstance':
            return `/${this.data_obj.rn}`
          case 'subscription':
            return `/${this.data_obj.rn}`
          default:
            return ''
        }
      },
    },
  }
  </script>

<style scoped>
/* 기존 스타일 유지 */
.delete-container {
  padding-left: 280px;  /* Navbar 높이에 따라 조절 */
  margin: 0 20px;     /* 좌우 여백 */
}

/* 라벨과 입력 필드의 간격 조절 */
.form-group {
  display: flex;
  align-items: center;
  gap: 5px;          /* 라벨과 입력 필드 사이 간격 */
  margin-bottom: 15px;
}

input {
  flex: 1;            /* 남은 공간을 입력 필드가 차지 */
  max-width: 300px;   /* 입력 필드의 최대 너비 제한 */
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 다른 스타일들은 유지 */
label {
  min-width: 100px;
  display: inline-block;
  width: 150px;
  margin-right: 10px;
  color: #1a73e8;  /* Google Blue */
  font-weight: 500;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.5);  /* 텍스트 주변에 약간의 그림자 효과 */
}

/* 다크 모드일 때의 스타일 */
@media (prefers-color-scheme: dark) {
  label {
    color: #63b3ed;  /* 밝은 파란색 */
  }
}
</style>