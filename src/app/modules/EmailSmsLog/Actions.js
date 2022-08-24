import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  show = (d) => SuperAxios.get("/tele-caller-contact/all", d);
  add = (d) => SuperAxios.post("/tele-caller-contact/add", d);
  log = (d) => SuperAxios.get("/lead-assign/all", d);
  email_sms_log = (d) => SuperAxios.get("/email-and-sms-log", d);
  users = (d) => SuperAxios.get("/employees/all", d);
  castadd = (d) => SuperAxios.post("/cast/add", d);
  cast = (d) => SuperAxios.get("/cast/all", d);
  countries = (d) => SuperAxios.get("/country/all", d);
  assignLead = (d) => SuperAxios.post("/lead-assign", d);
  states = (cid) => SuperAxios.get("/states/get");
  city=(d)=>SuperAxios.get("/city/get",d);
  postcode=(d)=>SuperAxios.get("/postcode/get",d);

}

export default new Actions();
