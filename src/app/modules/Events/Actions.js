import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  add = (d) => SuperAxios.post("/event/add", d);
  update = (d) => SuperAxios.put("/event/" + d.id, d);
  delete = (id) => SuperAxios.get("/event-delete/" + id);
  events = (d) => SuperAxios.get("/events", d);
  event = (id) => SuperAxios.get("/event/" + id);
  users = (d) => SuperAxios.get("/employees/all", d);
  follow_up = (d) => SuperAxios.post("/follow-up/all", d);
}

export default new Actions();
