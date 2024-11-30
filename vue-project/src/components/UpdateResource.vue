<script>
import axios from 'axios'

export default {
  data() {
    return {
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
    request_header_change(obj) {
      console.log(obj)
      this.req_items[0]['X-M2M-RI'] = obj['X-M2M-RI']
      this.req_items[0]['X-M2M-Origin'] = obj['X-M2M-Origin']
      this.req_items[0]['Content-Type'] = obj['Content-Type']
      this.req_items[0]['Content-RVI'] = obj['2a']
      this.req_items[0]['Accept'] = obj['Accept']
      this.$refs.reqtable.refresh()
    },
    response_header_change(obj) {
      console.log(obj)
      this.res_items[0]['X-M2M-RI'] = obj['X-M2M-RI']
      this.res_items[0]['X-M2M-RSC'] = obj['X-M2M-RSC']
      this.res_items[0]['X-M2M-RVI'] = obj['X-M2M-RVI']
      this.res_items[0]['Content-Length'] = obj['Content-Length']
      this.res_items[0]['Content-Type'] = obj['Content-Type']
      this.$refs.restable.refresh()
    },
    updateAE() {
        let ae_obj = {
        'm2m:ae': {
            'lbl': ['update1'],
          }
        };
        this.data_obj.Body = ae_obj;
        this.data_obj['Content-Type'] = 'application/json;ty=2';
        this.update_request();
    },
    updateContainer() {
        let cnt_obj = {
        'm2m:cnt': {
            'lbl': ['update1'],
          }
        };
        this.data_obj.Body = cnt_obj;
        this.data_obj['Content-Type'] = 'application/json;ty=3';
        this.update_request();
    },
    updateSubscriptionResource() {
        let sub_obj = {
        'm2m:sub': {
            'nu': [''],
          }
        };
        this.data_obj.Body = sub_obj;
        this.data_obj['Content-Type'] = 'application/json;ty=23';
        this.update_request();
    },
    createAE() {
      let ae_obj = {}
      ae_obj['m2m:ae'] = {}

      if (this.data_obj.rn != '') ae_obj['m2m:ae'].rn = this.data_obj.rn
      if (this.data_obj.lbl != '') ae_obj['m2m:ae'].lbl = JSON.parse(this.data_obj.lbl)
      if (this.data_obj.api == '' || this.data_obj.rr == '') {
        alert('Enter app-Id(api) and requestReachability(rr)')
      } else {
        ae_obj['m2m:ae'].api = this.data_obj.api
        ae_obj['m2m:ae'].rr = this.data_obj.rr
      }
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
      if (this.data_obj.lbl != '') cnt_obj['m2m:cnt'].lbl = JSON.parse(this.data_obj.lbl)
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

      if (this.data_obj.lbl != '') cin_obj['m2m:cin'].lbl = JSON.parse(this.data_obj.lbl)
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
      if (this.data_obj.lbl != '') sub_obj['m2m:sub'].lbl = JSON.parse(this.data_obj.lbl)
      if (this.data_obj.nu != '') sub_obj['m2m:sub'].nu = JSON.parse(this.data_obj.nu)
      else alert('Enter Notification URI(nu)')
      if (this.data_obj.enc != '') {
        sub_obj['m2m:sub'].enc = {}
        sub_obj['m2m:sub'].enc.net = JSON.parse(this.data_obj.enc)
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
    update_request() {
        let url = "http://" + this.data_obj.Platform_addr + "/" + this.data_obj.Res_Id + '/' + this.data.obj.query_Params;
        const headers = {
            "X-M2M-RI": this.data_obj.X_M2M_RI,
            "X-M2M-Origin": this.data_obj.X_M2M_Origin,
            "X-M2M-RVI": "2a",
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
      this.res_status = response.status;
    
      const headers = {
        "X-M2M-RI": response.headers["x-m2m-ri"],
        "X-M2M-RSC": response.headers["x-m2m-rsc"],
        "X-M2M-RVI": response.headers["x-m2m-rvi"],
        "Content-Length": response.headers["content-length"],
        "Content-Type": response.headers["content-type"]
      };
    
      this.response_header_change(headers);
      this.response_text = JSON.stringify(this.res_mess, undefined, 2);
    },

  // 에러 응답 처리를 위한 헬퍼 메소드
    handleError(error) {
    this.res_errmess = error.response.data;
    this.res_status = error.response.status;
    
      const headers = {
        "X-M2M-RI": error.response.headers["x-m2m-ri"],
        "X-M2M-RSC": error.response.headers["x-m2m-rsc"],
        "X-M2M-RVI": error.response.headers["x-m2m-rvi"],
        "Content-Length": error.response.headers["content-length"],
        "Content-Type": error.response.headers["content-type"]
      };
    
      this.response_header_change(headers);
      this.response_text = this.res_errmess;
    },
    // 리소스 생성 요청
    post_request() {
      let url =
        "http://" + this.data_obj.Platform_addr + "/" + this.data_obj.Res_Id;
      const headers = {};
      headers["X-M2M-RI"] = this.data_obj.X_M2M_RI;
      headers["X-M2M-Origin"] = this.data_obj.X_M2M_Origin;
      headers["X-M2M-RVI"] = "2a";
      headers["Content-Type"] = this.data_obj["Content-Type"];
      headers["Accept"] = this.data_obj.Accept;

      let body = this.data_obj.Body;
      axios
        .post(url, body, { headers })
        .then((response) => {
          this.res_mess = response.data;
          this.res_status = response.status;
          let headers = {};
          headers["X-M2M-RI"] = response.headers["x-m2m-ri"];
          headers["X-M2M-RSC"] = response.headers["x-m2m-rsc"];
          headers["X-M2M-RVI"] = response.headers["x-m2m-rvi"];
          headers["Content-Length"] = response.headers["content-length"];
          headers["Content-Type"] = response.headers["content-type"];
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
          headers["X-M2M-RI"] = error.response.headers["x-m2m-ri"];
          headers["X-M2M-RSC"] = error.response.headers["x-m2m-rsc"];
          headers["X-M2M-RVI"] = error.response.headers["x-m2m-rvi"];
          headers["Content-Length"] = error.response.headers["content-length"];
          headers["Content-Type"] = error.response.headers["content-type"];
          this.response_header_change(headers);

          return (this.response_text = this.res_errmess);
        });
    },
  }
}
</script>
