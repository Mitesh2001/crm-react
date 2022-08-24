import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  add = (d) => SuperAxios.post("/employee", d);
  update = (d) => SuperAxios.put("/employee/" + d.id, d);
  delete = (id) => SuperAxios.post("/employee/" + id, { _method: "DELETE" });
  info = (id) => SuperAxios.get("/employee/" + id);
  list = (d) => SuperAxios.get("/employee", d);
  countries = (d) => SuperAxios.get("/country/all", d);
  states = (d) => SuperAxios.get("/states/get",d);
  roles = (d) => SuperAxios.get("/role/all", d);
  castadd = (d) => SuperAxios.post("/cast/add", d);
  cast = (d) => SuperAxios.get("/cast/all", d);
  dynamiccontact = (d) => SuperAxios.get("/dynamic-form/employee", d);
  permissions = (d) => SuperAxios.get("/permission/all", d); 
  permissionupdate = (d) => SuperAxios.post("/user-permission/add" , d);
  permissioninfo = (d) => SuperAxios.get("/user-permission/all" , d);
  city=(d)=>SuperAxios.get("/city/get",d);
  postcode=(d)=>SuperAxios.get("/postcode/get",d);
}

export default new Actions();
