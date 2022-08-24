import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/permission", d);
  update = (d) => SuperAxios.put("/permission/" + d.id, d);
  delete = (id) => SuperAxios.post("/permission/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/permission/" + id);
  list = (d) => SuperAxios.get("/permission", d);
}

export default new Actions();