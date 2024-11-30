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
  }
}
</script>
