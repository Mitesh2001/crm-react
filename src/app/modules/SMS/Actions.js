import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/smsTemplate", d);
  list = (d) => SuperAxios.get("/smsTemplate", d);
  update = (d) => SuperAxios.put("/smsTemplate/" + d.id, d);
  info = (id) => SuperAxios.get("/smsTemplate/" + id);
  delete = (id) => SuperAxios.post("/smsTemplate/" + id, { _method: 'DELETE' });
  updateID=(id)=>SuperAxios.get("/smsTemplate/" + id + "/duplicate");
  contactlist = (d) => SuperAxios.get("/contacts", d);
  countries = (d) => SuperAxios.get("/country/all", d);
  states = (cid) => SuperAxios.get("/state/all/" + cid);
  companyTypes = (d) => SuperAxios.get("/company-type/all", d);
  industries = (d) => SuperAxios.get("/industry-type/all", d);
  sendSms = (d) => SuperAxios.post("/smsTemplate/contacts/send", d);
  
  }
  export default new Actions();