<template>
  <div class="update-resource">
    <h2>Update Resource</h2>

    <!-- 주체 선택 버튼 -->
    <div class="entity-selection">
      <button v-for="entity in entities"
              :key="entity"
              class="entity-button"
              @click="selectEntity(entity)">
        {{ entity }}
      </button>
    </div>

    <!-- 입력 폼과 요청/응답 영역 -->
    <div class="main-content">
      <!-- 입력 폼 -->
      <form @submit.prevent="handleUpdate" class="form-section">
        <h2>Destination</h2>
        <div class="form-group">
          <label for="platformAddress">Platform Address:</label>
          <input type="text" id="platformAddress" v-model="data_obj.Platform_addr" readonly />
        </div>
        <div class="form-group">
          <label for="resourceId">Resource ID:</label>
          <input type="text" id="resourceId" v-model="data_obj.Res_Id" />
        </div>

        <h2>Body</h2>
        <!-- AE와 Container를 위한 Label 입력 필드 -->
        <div class="form-group" v-if="['AE', 'Container'].includes(selectedEntity)">
          <label for="label">Label:</label>
          <input type="text" id="label" v-model="data_obj.lbl" placeholder="Enter labels (comma separated)" />
        </div>

        <!-- Subscription을 위한 nu 입력 필드 -->
        <div class="form-group" v-if="selectedEntity === 'Subscription'">
          <label for="nu">Notification URI:</label>
          <input type="text" id="nu" v-model="data_obj.nu" placeholder="Enter notification URIs (comma separated)" />
        </div>

        <h2>Headers</h2>
        <div class="form-group">
          <label>X-M2M-RI:</label>
          <input type="text" v-model="data_obj.X_M2M_RI" />
        </div>
        <div class="form-group">
          <label>X-M2M-RVI:</label>
          <input type="text" v-model="data_obj.X_M2M_RVI" readonly />
        </div>
        <div class="form-group">
          <label>X-M2M-Origin:</label>
          <input type="text" v-model="data_obj.X_M2M_Origin" />
        </div>
        <div class="form-group">
          <label>Accept:</label>
          <input type="text" v-model="data_obj.Accept" readonly />
        </div>

        <button type="submit" class="btn-submit">Update</button>

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
  </div>
</template>


<script>
import axios from 'axios'

export default {
  data() {
    return {
      entities: ['AE', 'Container', 'Subscription'], // 주체 목록
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
      update_fields: {
      ae: ['lbl'],
      cnt: ['lbl'], //cin은 업데이트 가능한 attribute 존재X
      sub: ['nu'],
      },
      current_resource_type: '', // 현재 업데이트하려는 리소스 타입
      is_updating: false, // 업데이트 모드 여부
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
      query_Params: '',
      headers_text: '',
      request_text: '',
      response_text: '',
      res_mess: '',
      res_errmess: '',
      res_status: '',
    }
  },
  methods: {
    selectEntity(entity) {
      this.selectedEntity = entity;
      console.log(`Selected Entity: ${entity}`);
    },
    handleUpdate() {
      alert(`Updating... ${this.data_obj.Res_Id}`);
      switch(this.selectedEntity){
        case 'AE':
          console.log(this.updateAE())
          break;
        case 'Container':
          console.log(this.updateContainer())
          break;
        case 'Subscription':
          console.log(this.updateSubscriptionResource())
          break;
      }
      this.update_request();
    },
    request_header_change(obj) {
      console.log(obj)
      this.req_items[0]['X-M2M-RI'] = obj['X-M2M-RI']
      this.req_items[0]['X-M2M-Origin'] = obj['X-M2M-Origin']
      this.req_items[0]['Content-Type'] = obj['Content-Type']
      this.req_items[0]['X-M2M-RVI'] = obj['X-M2M-RVI']
      this.req_items[0]['Accept'] = obj['Accept']
      // this.$refs.reqtable.refresh()
    },
    response_header_change(obj) {
      console.log(obj)
      this.res_items[0]['X-M2M-RI'] = obj['X-M2M-RI']
      this.res_items[0]['X-M2M-RSC'] = obj['X-M2M-RSC']
      this.res_items[0]['X-M2M-RVI'] = obj['X-M2M-RVI']
      this.res_items[0]['Content-Length'] = obj['Content-Length']
      this.res_items[0]['Content-Type'] = obj['Content-Type']
      // this.$refs.restable.refresh()
    },
    updateAE() {
        let ae_obj = {}
        ae_obj['m2m:ae'] = {}
        if (this.data_obj.lbl != '') ae_obj['m2m:ae'].lbl = this.data_obj.lbl.split(', ')

        this.data_obj.Body = ae_obj;
        this.data_obj['Content-Type'] = 'application/json;ty=2';

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
    updateContainer() {
        let cnt_obj = {}
        cnt_obj['m2m:cnt'] = {}
        if (this.data_obj.lbl != '') cnt_obj['m2m:cnt'].lbl = this.data_obj.lbl.split(', ')

        this.data_obj.Body = cnt_obj;
        this.data_obj['Content-Type'] = 'application/json;ty=3';

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
    updateSubscriptionResource() {
        let sub_obj = {}
        sub_obj['m2m:sub'] = {}
        if (this.data_obj.nu != '') sub_obj['m2m:sub'].nu = this.data_obj.nu.split(', ')
        this.data_obj.Body = sub_obj;
        this.data_obj['Content-Type'] = 'application/json;ty=23';

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
    update_request() {
        let url = `/${this.data_obj.Res_Id}`
        const headers = {
            "X-M2M-RI": this.data_obj.X_M2M_RI,
            "X-M2M-Origin": this.data_obj.X_M2M_Origin,
            "X-M2M-RVI": this.data_obj.X_M2M_RVI,
            "Content-Type": this.data_obj["Content-Type"],
            "Accept": this.data_obj.Accept
        };

        let body = this.data_obj.Body;

        // PUT 요청 먼저 시도
        axios.put(url, body, { headers })
        .then(response => {
          this.handleSuccess(response);
        })
        .catch(error => {
        // 리소스가 없는 경우 (404) POST 요청으로 생성 시도
          if (error.response && error.response.status === 404) {
            console.log("Resource not found, trying to create with POST");
            axios.post(url, body, { headers })
            .then(response => {
              this.handleSuccess(response);
            })
            .catch(error => {
              this.handleError(error);
            });
          } else {
            this.handleError(error);
          }
      });
    },
    // 성공 응답 처리를 위한 헬퍼 메소드
    handleSuccess(response) {
      this.res_mess = response.data;
      this.response_text = JSON.stringify(this.res_mess, undefined, 2);
    },

  // 에러 응답 처리를 위한 헬퍼 메소드
    handleError(error) {
      this.res_errmess = error.response.data;
      this.response_text = this.res_errmess;
    },
  }
}
</script>

<style scoped>
.update-resource {
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
  color: #3b3b3b; /* 제목 텍스트를 더 진하게 */
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

.divider {
  margin: 20px 0;
  height: 1px;
  background-color: #e0e0e0;
  width: 100%;
}

input[readonly] {
  background-color: #ffffff;  /* 배경색 약간 어둡게 */
  color: #a5a5a5;  /* 텍스트 색상 변경 */
  cursor: not-allowed;  /* 커서 모양 변경 */
}

textarea::placeholder {
  height: fit-content;
  color: #888; /* 텍스트 에어리어 플레이스홀더 색상 */
  height: fit-content;
}
</style>
