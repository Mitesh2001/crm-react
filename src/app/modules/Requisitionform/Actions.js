import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  add = (d) => SuperAxios.post("/requisition/store", d);
  update = (d) => SuperAxios.put("/requisition/" + d.id, d);
  delete = (id) => SuperAxios.post("/requisition/" + id, { _method: "DELETE" });
  info = (id) => SuperAxios.get("/requisition/" + id);
  list = (d) => SuperAxios.get("/requisition/all", d);
}

export default new Actions();
