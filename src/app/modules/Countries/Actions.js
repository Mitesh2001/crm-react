import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/country", d);
  update = (d) => SuperAxios.put("/country/" + d.id, d);
  delete = (id) => SuperAxios.post("/country/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/country/" + id);
  list = (d) => SuperAxios.get("/country", d);
}

export default new Actions();