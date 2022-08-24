import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/industry-type", d);
  update = (d) => SuperAxios.put("/industry-type/" + d.id, d);
  delete = (id) => SuperAxios.post("/industry-type/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/industry-type/" + id);
  list = (d) => SuperAxios.get("/industry-type", d);
}

export default new Actions();