import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  show = (d) => SuperAxios.get("/tele-caller-contact/all", d);
  add = (d) => SuperAxios.post("/tele-caller-contact/add", d);
  //users = (d) => SuperAxios.post("/tele-caller-contact/user",d);
  users = (d) => SuperAxios.get("/employees/all", d);
  castadd = (d) => SuperAxios.post("/cast/add", d);
  cast = (d) => SuperAxios.get("/cast/all", d);
  countries = (d) => SuperAxios.get("/country/all", d);
  states = (d) => SuperAxios.get("/states/get",d);
  companyTypes = (d) => SuperAxios.get("/company-type/all", d);
  industries = (d) => SuperAxios.get("/industry-type/all", d);
  roles = (d) => SuperAxios.get("/role/all", d);
  city=(d)=>SuperAxios.get("/city/get",d);
  postcode=(d)=>SuperAxios.get("/postcode/get",d);
}

export default new Actions();
