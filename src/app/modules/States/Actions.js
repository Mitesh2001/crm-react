import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/state", d);
  update = (d) => SuperAxios.put("/state/" + d.id, d);
  delete = (id) => SuperAxios.post("/state/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/state/" + id);
  list = (d) => SuperAxios.get("/state", d);
  countries = (d) => SuperAxios.get("/country/all", d);
}

export default new Actions();