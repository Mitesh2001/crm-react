import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  add = (d) => SuperAxios.post("/lead", d);
  update = (d) => SuperAxios.put("/lead/" + d.id, d);
  delete = (id) => SuperAxios.post("/lead/" + id, { _method: "DELETE" });
  remove = (id) => SuperAxios.get("/remove-interested-product/" + id);
  info = (id) => SuperAxios.get("/lead/" + id);
  list = (d) => SuperAxios.get("/lead", d);
  listEmployee = (d) => SuperAxios.get("/employee", d);
  listRole = (d) => SuperAxios.get("/role/all", d);
  companyTypes = (d) => SuperAxios.get("/company-type/all", d);
  selectTemplate = (id) => SuperAxios.get("/emailTemplate/" + id);
  industries = (d) => SuperAxios.get("/industry-type/all", d);
  countries = (d) => SuperAxios.get("/country/all", d);
  states = (d) => SuperAxios.get("/states/get", d);
  leadStatuses = (d) => SuperAxios.get("/status/all/lead", d);
  comments = (d) => SuperAxios.get("/leads-comments", d);
  addComment = (d) => SuperAxios.post("/leads-comments", d);
  emailTemplate = (d) => SuperAxios.get("/emailTemplate", d);
  followUp = (d) => SuperAxios.post("/follow-up/all", d);
  addfollowup = (d) => SuperAxios.post("/follow-up/add", d);
  // interestedproduct=(d)=>SuperAxios.get("/interested-product/all", d);
  addleadstage = (d) => SuperAxios.post("/lead-stage", d);
  showStage = (id) => SuperAxios.get("/lead-stage/" + id);
  sendEmail = (d) => SuperAxios.post("/send-email/lead", d);
  lock = (d) => SuperAxios.get("/lead-lock-unlock", d);
  users = (d) => SuperAxios.get("/employees/all", d);
  listProducts = (d) => SuperAxios.get("/products", d);
  loginfo = (d) => SuperAxios.post("/assign-log", d);
  city=(d)=>SuperAxios.get("/city/get",d);
  postcode=(d)=>SuperAxios.get("/postcode/get",d);
}

export default new Actions();
