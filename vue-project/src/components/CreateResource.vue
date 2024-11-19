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
        X_M2M_Origin: 'S',
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
  },
}
</script>
