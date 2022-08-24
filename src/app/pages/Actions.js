import SuperAxios from "../helpers/SuperAxios";

class Actions {
  updateProfile = (d) => SuperAxios.post("/update-profile", d);
  changePassword = (d) => SuperAxios.post("/change-password", d);
  resetPassword = (d) => SuperAxios.post("/reset-password", d);
  countries = (d) => SuperAxios.get("/country/all", d);
  states = (d) => SuperAxios.get("/states/get", d);
  dashboard = (d) => SuperAxios.get("/dashboard", d);
  invoice=(d)=>SuperAxios.get("/invoice-download/"+ d);
  city=(d)=>SuperAxios.get("/city/get",d);
  postcode=(d)=>SuperAxios.get("/postcode/get",d);
}

export default new Actions();
