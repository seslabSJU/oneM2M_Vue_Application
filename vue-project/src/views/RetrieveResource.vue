<template>
  <div>
    <h2>Retrieve Resource</h2>
    <form @submit.prevent="handleRetrieve">
      <div>
        <label>Resource Name:</label>
        <input type="text" v-model="resourceName" />
      </div>
      <button type="submit">Retrieve</button>
    </form>
    <p v-if="response">{{ response }}</p>
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
      query_Params: "",
      request_text: "",
      response_text: "",
      res_name: "",
      res_mess: "",
      res_errmess: "",
      res_status: "",
    }
  },
  methods: {
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
      let url = `/${this.data_obj.Res_Id}/${this.query_Params}`;

      const headers = {};
      headers["X-M2M-RI"] = this.data_obj.X_M2M_RI;
      headers["X-M2M-Origin"] = this.data_obj.X_M2M_Origin;
      headers["Accept"] = this.data_obj.Accept;

      this.request_header_change(headers);
      axios
        .get(url, { headers })
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

          return (this.response_text = this.res_errmess);
        });
    },
  },
};
</script>
