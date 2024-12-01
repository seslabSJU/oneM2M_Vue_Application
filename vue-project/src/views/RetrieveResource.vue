<template>
  <div class="retrieve-resource">
    <h2>Retrieve Resource</h2>

    <!-- 입력 폼과 요청/응답 영역 -->
    <div class="main-content">
      <!-- 입력 폼 -->
      <form @submit.prevent="handleRetrieve" class="form-section">
        <div class="form-group">
          <label for="platformAddress">Platform Address:</label>
          <input type="text" id="platformAddress" v-model="data_obj.Platform_addr" readonly />
        </div>
        <div class="form-group">
          <label for="resourceId">Resource ID:</label>
          <input type="text" id="resourceId" v-model="data_obj.Res_Id" />
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

        <button type="submit" class="btn-submit">Retrieve</button>
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
          <textarea placeholder="Request Body" class="body-text" v-model="request_text" readonly></textarea>
        </div>
        <div class="response">
          <h3>Response</h3>
          <div class="header">
            <p>Header</p>
            <ul>
              <li>X-M2M-RI: {{ res_items[0]['X-M2M-RI'] }}</li>
              <li>X-M2M-RSC: {{ res_items[0]['X-M2M-RSC'] }}</li>
              <li>X-M2M-RVI: {{ res_items[0]['X-M2M-RVI'] }}</li>
              <li>Content-Length: {{ res_items[0]['Content-Length'] }}</li>
              <li>Content-Type: {{ res_items[0]['Content-Type'] }}</li>
            </ul>
          </div>
          <textarea placeholder="Response Body" class="body-text" v-model="response_text" readonly></textarea>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  data() {
    return {
      data_obj: {
        Platform_addr: '127.0.0.1:3000',
        Res_Id: 'TinyIoT',
        X_M2M_RI: "12345",
        X_M2M_RVI: "2a",
        X_M2M_Origin: "CAdmin",
        Accept: "application/json",
        Retrieve_text: "GET",
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
    }
  },
  methods: {
    handleRetrieve() {
      alert(`Retrieving... ${this.data_obj.Res_Id}`);
      this.retrieveRequestJSONText();
      this.retrieveRequest();
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
    retrieveRequestJSONText() {
      let ret_obj = {};

      let headers = {};
      headers["X-M2M-RI"] = this.data_obj["X-M2M-RI"];
      headers["X-M2M-Origin"] = this.data_obj["X-M2M-Origin"];
      headers["X-M2M-RVI"] = this.data_obj["X-M2M-RVI"];
      headers["Accept"] = this.data_obj["Accept"];

      this.req_display_obj = ret_obj;
      this.request_header_change(headers);
      return (this.request_text = JSON.stringify(ret_obj, undefined, 2));
    },
    retrieveRequest(){
      let url = `/${this.data_obj.Res_Id}`;

      const headers = {};
      headers["X-M2M-RI"] = this.data_obj.X_M2M_RI;
      headers["X-M2M-RVI"] = this.data_obj.X_M2M_RVI;
      headers["X-M2M-Origin"] = this.data_obj.X_M2M_Origin;
      headers["Accept"] = this.data_obj.Accept;

      this.request_header_change(headers);
      axios
        .get(url, { headers })
        .then((response) => {
          this.res_mess = response.data;
          return (this.response_text = JSON.stringify(
            this.res_mess,
            undefined,
            2
          ));
        })
        .catch((error) => {
          this.res_errmess = error.response.data;
          if (error.response.status === 409) {
            this.res_status = error.response.status;
          } else if (error.response.status === 404) {
            this.res_status = error.response.status;
          }
          return (this.response_text = this.res_errmess);
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
.header{
  color: #333;
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
  height: fit-content;
  color: #888; /* 텍스트 에어리어 플레이스홀더 색상 */
  height: fit-content;
}
</style>
