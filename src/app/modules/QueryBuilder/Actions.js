import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  add = (d) => SuperAxios.post("/query-rule/add", d);
  update = (d) => SuperAxios.put("/query-rule/" + d.id, d);
  delete = (id) => SuperAxios.post("/query-rule/" + id, { _method: "DELETE" });
  list = (d) => SuperAxios.get("/query-rule/all", d);
  info = (id) => SuperAxios.get("/query-rule/" + id);
  column = (id) => SuperAxios.get("/column-structure/" + id);
  summary = (d) => SuperAxios.post("/summary-report", d);
  columnData = (id) => SuperAxios.get("/column/" + id);
  groupBy = (id) => SuperAxios.get("/groupby-column/" + id);
}

export default new Actions();
