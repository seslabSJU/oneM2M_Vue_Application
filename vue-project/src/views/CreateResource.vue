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
          <label for="resourceName">{{ selectedEntity }} Resource Name:</label>
          <input type="text" id="resourceName" v-model="data_obj.rn" :placeholder="`Enter your ${selectedEntity} Resource name`" />
        </div>
        <div class="form-group">
          <label for="label">Label:</label>
          <input type="text" id="label" v-model="data_obj.lbl" />
        </div>

        <!-- ContentInstance를 위한 con 입력 필드 -->
        <div class="form-group" v-if="selectedEntity === 'ContentInstance'">
          <label for="con">Content:</label>
          <input type="text" id="con" v-model="data_obj.con" placeholder="Enter content value" />
        </div>

        <!-- Subscription을 위한 nu 입력 필드 -->
        <div class="form-group" v-if="selectedEntity === 'Subscription'">
          <label for="nu">Notification URI:</label>
          <input type="text" id="nu" v-model="data_obj.nu" placeholder="Enter notification URI" />
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
          <textarea placeholder="Request Body" class="body-text" v-model="request_text" readonly></textarea>
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
import axios from 'axios'

export default {
  data() {
    return {
      entities: ['AE', 'Container', 'ContentInstance', 'Subscription'], // 주체 목록
      selectedEntity: 'AE', // 기본 선택된 주체
      data_obj: {
        Platform_addr: '127.0.0.1:3000',
        Res_Id: 'TinyIoT',
        X_M2M_RI: 'create',
        X_M2M_RVI: '2a',
        X_M2M_Origin: 'CAdmin',
        Accept: 'application/json',

        lbl: [],
        mni: '',
        mbs: '',
        ty: '',
        op: '',
        api: 'Nmyapp3',
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
    handleCreate() {
      alert(`Creating ${this.selectedEntity}...`);
      switch(this.selectedEntity){
        case 'AE':
          console.log(this.createAE())
          break;
        case 'Container':
          console.log(this.createContainer())
          break;
        case 'ContentInstance':
          console.log(this.createContentInstance())
          break;
        case 'Subscription':
          console.log(this.createSubscriptionResource())
          break;
      }
      this.post_request();
    },
    request_header_change(obj) {
      console.log(obj)
      this.req_items[0]['X-M2M-RI'] = obj['X-M2M-RI']
      this.req_items[0]['X-M2M-Origin'] = obj['X-M2M-Origin']
      this.req_items[0]['Content-Type'] = obj['Content-Type']
      this.req_items[0]['Content-RVI'] = obj['2a']
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
    createAE() {
      let ae_obj = {}
      ae_obj['m2m:ae'] = {}

      if (this.data_obj.rn != '') ae_obj['m2m:ae'].rn = this.data_obj.rn
      if (this.data_obj.lbl.length > 0) ae_obj['m2m:ae'].lbl = this.data_obj.lbl.split(', ')
      if (this.data_obj.api == '' || this.data_obj.rr == '') {
        alert('Enter app-Id(api) and requestReachability(rr)')
      } else {
        ae_obj['m2m:ae'].api = this.data_obj.api.concat(this.data_obj.rn)
        ae_obj['m2m:ae'].rr = this.data_obj.rr
      }
      ae_obj['m2m:ae'].srv = this.data_obj.srv
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
    createContainer() {
      let cnt_obj = {}
      cnt_obj['m2m:cnt'] = {}

      if (this.data_obj.rn != '') cnt_obj['m2m:cnt'].rn = this.data_obj.rn
      if (this.data_obj.lbl != '') cnt_obj['m2m:cnt'].lbl = this.data_obj.lbl.split(', ')
      if (this.data_obj.mni != '') cnt_obj['m2m:cnt'].mni = parseInt(this.data_obj.mni)
      if (this.data_obj.mbs != '') cnt_obj['m2m:cnt'].mbs = parseInt(this.data_obj.mbs)

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
    createContentInstance() {
      let cin_obj = {}
      cin_obj['m2m:cin'] = {}

      if (this.data_obj.lbl != '') cin_obj['m2m:cin'].lbl = this.data_obj.lbl.split(', ')
      if (this.data_obj.con != '') cin_obj['m2m:cin'].con = this.data_obj.con

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
    createSubscriptionResource() {
      let sub_obj = {}
      sub_obj['m2m:sub'] = {}
      if (this.data_obj.rn != '') sub_obj['m2m:sub'].rn = this.data_obj.rn
      if (this.data_obj.lbl != '') sub_obj['m2m:sub'].lbl = this.data_obj.lbl.split(', ')
      if (this.data_obj.nu != '') sub_obj['m2m:sub'].nu = this.data_obj.nu.split(', ')
      else alert('Enter Notification URI(nu)')
      if (this.data_obj.enc != '') {
        sub_obj['m2m:sub'].enc = {}
        sub_obj['m2m:sub'].enc.net = this.data_obj.net
      }
      if (this.data_obj.exc != '') sub_obj['m2m:sub'].exc = parseInt(this.data_obj.exc)

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
    createRemoteCSE() {
      let csr_obj = {}
      csr_obj['m2m:csr'] = {}
      if (this.data_obj.rn != '') csr_obj['m2m:csr'].rn = this.data_obj.rn
      if (this.data_obj.cb != '') csr_obj['m2m:csr'].cb = this.data_obj.cb
      else alert('Enter Callback URI(cb)') // not quite sure about this
      if (this.data_obj.rr != '') csr_obj['m2m:csr'].rr = this.data_obj.rr
      if (this.data_obj.csi != '') csr_obj['m2m:csr'].csi = this.data_obj.csi
      if (this.data_obj.poa.length > 0) csr_obj['m2m:csr'].poa = JSON.parse(this.data_obj.poa)
      if (this.data_obj.srv.length > 0) csr_obj['m2m:csr'].srv = JSON.parse(this.data_obj.srv)

      this.data_obj['Content-Type'] = 'application/json;ty=16'
      this.data_obj['Body'] = csr_obj

      let headers = {}
      headers['X-M2M-RI'] = this.data_obj.X_M2M_RI
      headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI
      headers['X-M2M-Origin'] = this.data_obj.X_M2M_Origin
      headers['Content-Type'] = this.data_obj['Content-Type']
      headers['Accept'] = this.data_obj.Accept

      this.req_display_obj = csr_obj
      this.request_header_change(headers)
      return (this.request_text = JSON.stringify(this.req_display_obj, undefined, 2))
    },
    createACP(){
      let acp_obj = {}

      acp_obj['m2m:acp'] = {}
      acp_obj['m2m:acp'].pv = {}
      acp_obj['m2m:acp'].pvs = {}
      if(this.data_obj.rn != '') acp_obj['m2m:acp'].rn = this.data_obj.rn
      acp_obj['m2m:acp'].pv.acr = JSON.parse(this.data_obj.pv_acr)
      acp_obj['m2m:acp'].pvs.acr = JSON.parse(this.data_obj.pvs_acr)

      this.data_obj['Content-Type'] = 'application/json;ty=1'
      this.data_obj['Body'] = acp_obj

      let headers = {}
      headers['X-M2M-RI'] = this.data_obj.X_M2M_RI
      headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI
      headers['X-M2M-Origin'] = this.data_obj.X_M2M_Origin
      headers['Content-Type'] = this.data_obj['Content-Type']
      headers['Accept'] = this.data_obj.Accept

      this.req_display_obj = acp_obj
      this.request_header_change(headers)
      return (this.request_text = JSON.stringify(this.req_display_obj, undefined, 2))
    },
    createGRP(){
      let grp_obj = {}
      grp_obj['m2m:grp'] = {}
      if(this.data_obj.rn != '') grp_obj['m2m:grp'].rn = this.data_obj.rn
      if(this.data_obj.mid.length > 0) grp_obj['m2m:grp'].mid = JSON.parse(this.data_obj.mid)
      if(this.data_obj.mnm != '') grp_obj['m2m:grp'].mnm = this.data_obj.mnm
      if(this.data_obj.mt != '') grp_obj['m2m:grp'].mt = this.data_obj.mt
      if(this.data_obj.csy != '') grp_obj['m2m:grp'].csy = this.data_obj.csy

      this.data_obj['Content-Type'] = 'application/json;ty=9'
      this.data_obj['Body'] = grp_obj

      let headers = {}
      headers['X-M2M-RI'] = this.data_obj.X_M2M_RI
      headers['X-M2M-RVI'] = this.data_obj.X_M2M_RVI
      headers['X-M2M-Origin'] = this.data_obj.X_M2M_Origin
      headers['Content-Type'] = this.data_obj['Content-Type']
      headers['Accept'] = this.data_obj.Accept

      this.req_display_obj = grp_obj
      this.request_header_change(headers)
      return (this.request_text = JSON.stringify(this.req_display_obj, undefined, 2))
    },
    post_request() {
      let url = `/${this.data_obj.Res_Id}`;
      const headers = {
        "X-M2M-RI": this.data_obj.X_M2M_RI,
        "X-M2M-Origin": this.data_obj.X_M2M_Origin,
        "X-M2M-RVI": this.data_obj.X_M2M_RVI,
        "Content-Type": this.data_obj["Content-Type"],
        "Accept": this.data_obj.Accept
      };

      let body = this.data_obj.Body;
      axios.post(url, body, { headers })
        .then((response) => {
          this.res_mess = response.data;
          this.res_status = response.status;
          let headers = {};
          headers["X-M2M-RI"] = response.headers["X-M2M-RI"];
          headers["X-M2M-RSC"] = response.headers["X-M2M-RSC"];
          headers["X-M2M-RVI"] = response.headers["X-M2M-RVI"];
          headers["Content-Length"] = response.headers["Content-Length"];
          headers["Content-Type"] = response.headers["Content-Type"];
          this.response_header_change(headers);

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
          let headers = {};
          headers["X-M2M-RI"] = error.response.headers["X-M2M-RI"];
          headers["X-M2M-RSC"] = error.response.headers["X-M2M-RSC"];
          headers["X-M2M-RVI"] = error.response.headers["X-M2M-RVI"];
          headers["Content-Length"] = error.response.headers["Content-Length"];
          headers["Content-Type"] = error.response.headers["Content-Type"];
          this.response_header_change(headers);

          return (this.response_text = this.res_errmess);
        });
    },
  },
}
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
