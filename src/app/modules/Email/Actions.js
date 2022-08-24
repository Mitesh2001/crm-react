import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/emailTemplate", d);
  update = (d) => SuperAxios.put("/emailTemplate/" + d.id, d);
  delete = (id) => SuperAxios.post("/emailTemplate/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/emailTemplate/" + id);
  list = (d) => SuperAxios.get("/emailTemplate", d);
  updateID=(id)=>SuperAxios.get("/emailTemplate/" + id + "/duplicate");
  contactlist = (d) => SuperAxios.get("/contacts", d);
  info = (id) => SuperAxios.get("/emailTemplate/" + id);
  countries = (d) => SuperAxios.get("/country/all", d);
  states = (cid) => SuperAxios.get("/state/all/" + cid);
  companyTypes = (d) => SuperAxios.get("/company-type/all", d);
  industries = (d) => SuperAxios.get("/industry-type/all", d);
  sendEmail = (d) => SuperAxios.post("/send-email/sendbulk", d);
  }
  export default new Actions();