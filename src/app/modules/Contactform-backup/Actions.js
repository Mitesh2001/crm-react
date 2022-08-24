import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/contacts", d);
  update = (d) => SuperAxios.put("/contacts/" + d.id, d);
  delete = (id) => SuperAxios.post("/contacts/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/contacts/" + id);
  list = (d) => SuperAxios.get("/contacts", d);
  converttolead = (id) => SuperAxios.get("/contacts/converttolead/" + id);
  import = (d) => SuperAxios.post("/contacts/import", d);
  cast = (d) => SuperAxios.get("/cast/all", d);
  castadd = (d) => SuperAxios.post("/cast/add",d); 
  addnote = (d) => SuperAxios.post("/tele-caller-contact/note/add",d); 
  viewnote = (d) => SuperAxios.post("/tele-caller-contact/note/all",d); 
  
}

export default new Actions();