import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/role", d);
  update = (d) => SuperAxios.put("/role/" + d.id, d);
  delete = (id) => SuperAxios.post("/role/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/role/" + id);
  list = (d) => SuperAxios.get("/role/all", d);
  permissions = (d) => SuperAxios.get("/permission/all", d); 
}

export default new Actions();