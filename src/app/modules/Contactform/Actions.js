import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/dynamic-form/store/contact", d);
  update = (d) => SuperAxios.put("/dynamic-form/update/contact/" + d.id, d);
  delete = (id) => SuperAxios.post("/contacts/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/dynamic-form-value/contact" + id);
  list = (d) => SuperAxios.get("/contacts", d);
  converttolead = (id) => SuperAxios.get("/contacts/converttolead/" + id);
  cast = (d) => SuperAxios.get("/cast/all", d);
  castadd = (d) => SuperAxios.post("/cast/add",d); 
  dynamic = (d) => SuperAxios.get("/module/all", d);
  dynamiccontact = (d) => SuperAxios.get("/dynamic-form/contact", d);
}

export default new Actions();