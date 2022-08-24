import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/contacts", d);
  update = (d) => SuperAxios.put("/contacts/" + d.id, d);
  delete = (id) => SuperAxios.post("/contacts/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/contacts/" + id);
  list = (d) => SuperAxios.get("/contacts", d);
  listProducts = (d) => SuperAxios.get("/products", d);
  infoProducts = (id) => SuperAxios.get("/products/" + id);
  listEmployee = (d) => SuperAxios.get("/employee", d);
  listRole = (d) => SuperAxios.get("/role/all", d);
  countries = (d) => SuperAxios.get("/country/all", d);
  states = (cid) => SuperAxios.get("/state/all/" + cid);
  companyTypes = (d) => SuperAxios.get("/company-type/all", d);
  industries = (d) => SuperAxios.get("/industry-type/all", d);
  import = (d) => SuperAxios.post("/contacts/import", d);
  converttolead = (id) => SuperAxios.get("/contacts/converttolead/" + id);
  notes = (d) => SuperAxios.post("/tele-caller-contact/note/all", d);
  addnote = (d) => SuperAxios.post("/tele-caller-contact/note/add",d); 
  addfollowup=(d)=>SuperAxios.post("/follow-up/add",d); 
  followUp=(d)=>SuperAxios.post("/follow-up/all", d); 
  addProduct=(d)=>SuperAxios.post("/interested-product/add",d); 
  lock=(d)=>SuperAxios.post("/tele-caller-contact/working-status", d); 
  emailTemplate=(d)=>SuperAxios.get("/emailTemplate", d);
  selectTemplate = (id) => SuperAxios.get("/emailTemplate/" + id);
  sendEmail=(d)=>SuperAxios.post("/send-email/contact", d); 
  category = (d) => SuperAxios.get("/contact-category/all", d);
  

}

export default new Actions();