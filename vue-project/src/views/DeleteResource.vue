<template>
  <div class="delete-resource">
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
        <input type="text" v-model="data_obj.Res_Id" readonly />
      </div>
      <div class="form-group">
        <label>Resource Name to Delete:</label>
        <input type="text" v-model="data_obj.rn" placeholder="Enter Resource Name (ex. myAE/cnt_rn/cin_rn)" />
      </div>

      <h2>Headers</h2>
      <div class="form-group">
        <label>X-M2M-RI:</label>
        <input type="text" v-model="data_obj.X_M2M_RI" />
      </div>
      <div class="form-group">
        <label>X-M2M-RVI:</label>
        <input type="text" v-model="data_obj.X_M2M_RVI" readonly/>
      </div>
      <div class="form-group">
          <label>X-M2M-Origin:</label>
          <input type="text" v-model="data_obj.X_M2M_Origin" readonly/>
      </div>
      <div class="form-group">
        <label>Accept:</label>
        <input type="text" v-model="data_obj.Accept" readonly/>
      </div>

      <!-- 삭제 버튼 -->
      <button type="submit" class="btn-submit">Delete</button>

      <div class="divider"/>

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
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data_obj: {
        Platform_addr: "127.0.0.1:3000",
        Res_Id: "TinyIoT",
        X_M2M_RI: "delete",
        X_M2M_Origin: "CAdmin",
        X_M2M_RVI: "2a", // 기본값 설정 가능
        Accept: "application/json",
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
    };
  },
  methods: {
    response_header_change(obj) {
      console.log(obj)
      this.res_items[0]['X-M2M-RI'] = obj['X-M2M-RI']
      this.res_items[0]['X-M2M-RSC'] = obj['X-M2M-RSC']
      this.res_items[0]['X-M2M-RVI'] = obj['X-M2M-RVI']
      this.res_items[0]['Content-Length'] = obj['Content-Length']
      this.res_items[0]['Content-Type'] = obj['Content-Type']
      // this.$refs.restable.refresh()
    },
    handleDelete() {
      this.delete_request();
    },
    delete_request() {
      let url = `/${this.data_obj.Res_Id}/${this.data_obj.rn}`;

      const headers = {
        'X-M2M-RI': this.data_obj.X_M2M_RI,
        'X-M2M-Origin': this.data_obj.X_M2M_Origin,
        'X-M2M-RVI': this.data_obj.X_M2M_RVI, // X-M2M-RVI 추가
        'Accept': this.data_obj.Accept,
      };

      this.request_text = "Request is successfully sent";
    

      axios.delete(url, { headers })
      .then((response) => {
          // HTTP 상태 라인 형식으로 response 메시지 수정
          this.response_text = `HTTP/1.1 ${response.status} ${response.statusText}`;
          this.response_header_change(response.headers);
          return this.response_text
        })
        .catch((error) => {
          // 에러 시에도 HTTP 상태 라인 형식 유지
          this.response_text = error.response 
            ? `HTTP/1.1 ${error.response.status} ${error.response.statusText}`
            : `Error: ${error.message}`;
          this.response_header_change(error.response?.headers || {});
          return this.response_text
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

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  /* 입력 필드 텍스트 크기 */
  color: #333;
  /* 입력 텍스트 색상 */
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
  background-color: #f9f9f9;
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
  height: 100px;
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

.divider {
  margin: 20px 0;
  height: 1px;
  background-color: #e0e0e0;
  width: 100%;
}

input[readonly] {
  background-color: #d4d2d2;  /* 배경색 약간 어둡게(아예 회색빛 넣어서 구분되게 만들었음!) */
  color: #333;  /* 텍스트 색상 변경 */
  cursor: not-allowed;  /* 커서 모양 변경 */
}

textarea::placeholder {
  color: #888;
  /* 텍스트 에어리어 플레이스홀더 색상 */
}
</style>
