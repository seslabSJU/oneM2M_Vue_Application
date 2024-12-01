<template>
  <div class="create-resource">
    <h2>Create Resource</h2>

    <!-- 주체 선택 버튼 -->
    <div class="entity-selection">
      <button v-for="entity in entities" :key="entity" class="entity-button" @click="selectEntity(entity)">
        {{ entity }}
      </button>
    </div>

    <!-- 입력 폼과 요청/응답 영역 -->
    <div class="main-content">
      <!-- 입력 폼 -->
      <form @submit.prevent="handleCreate" class="form-section">
        <div class="form-group">
          <label for="platformAddress">Platform Address:</label>
          <input type="text" id="platformAddress" v-model="data_obj.Platform_addr" />
        </div>
        <div class="form-group">
          <label for="resourceId">Resource ID (To):</label>
          <input type="text" id="resourceId" v-model="data_obj.Res_Id" />
        </div>
        <div class="form-group">
          <label for="resourceName">Resource Name:</label>
          <input type="text" id="resourceName" v-model="data_obj.rn" placeholder="Enter your Resource name" />
        </div>
        <div class="form-group">
          <label for="label">Label:</label>
          <input type="text" id="label" v-model="data_obj.lbl" />
        </div>

        <h3>Headers</h3>
        <div class="form-group">
          <label>X-M2M-RI:</label>
          <input type="text" v-model="data_obj.X_M2M_RI" />
        </div>
        <div class="form-group">
          <label>X-M2M-Origin:</label>
          <input type="text" v-model="data_obj.X_M2M_Origin" />
        </div>
        <div class="form-group">
          <label>Accept:</label>
          <input type="text" v-model="data_obj.Accept" />
        </div>

        <button type="submit" class="btn-submit">Send</button>
      </form>

      <!-- Request와 Response -->
      <div class="request-response">
        <div class="request">
          <h3>Request</h3>
          <div class="header">
            <p>Header</p>
            <ul>
              <li>X-M2M-RI: {{ data_obj.X_M2M_RI }}</li>
              <li>X-M2M-Origin: {{ data_obj.X_M2M_Origin }}</li>
              <li>Accept: {{ data_obj.Accept }}</li>
            </ul>
          </div>
          <textarea placeholder="Request Body" class="body-text"></textarea>
        </div>
        <div class="response">
          <h3>Response</h3>
          <div class="header">
            <p>Header</p>
            <ul>
              <li>X-M2M-RI:</li>
              <li>X-M2M-RSC:</li>
              <li>X-M2M-RVI:</li>
              <li>Content-Length:</li>
              <li>Content-Type:</li>
            </ul>
          </div>
          <textarea placeholder="Response Body" class="body-text" readonly></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entities: ['AE', 'Container', 'ContentInstance', 'Subscription'], // 주체 목록
      selectedEntity: 'AE', // 기본 선택된 주체
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
    };
  },
  methods: {
    selectEntity(entity) {
      this.selectedEntity = entity;
      console.log(`Selected Entity: ${entity}`);
    },
    handleCreate() {
      alert(`Creating ${this.selectedEntity}...`);
    },
  },
};
</script>

<style scoped>
.create-resource {
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

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px; /* 입력 필드 텍스트 크기 */
  color: #333; /* 입력 텍스트 색상 */
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
  background-color: #f9f9f9;
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

.body-text {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  background-color: #ffffff;
  resize: none;
  color: #333; /* 텍스트 색상 */
  font-size: 14px;
}

textarea::placeholder {
  color: #888; /* 텍스트 에어리어 플레이스홀더 색상 */
}
</style>
