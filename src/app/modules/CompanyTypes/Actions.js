import SuperAxios from '../../helpers/SuperAxios';

class Actions {
  add = (d) => SuperAxios.post("/company-type", d);
  update = (d) => SuperAxios.put("/company-type/" + d.id, d);
  delete = (id) => SuperAxios.post("/company-type/" + id, { _method: 'DELETE' });
  info = (id) => SuperAxios.get("/company-type/" + id);
  list = (d) => SuperAxios.get("/company-type", d);
}

export default new Actions();