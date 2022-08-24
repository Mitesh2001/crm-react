import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  add = (d) => SuperAxios.post("/products", d);
  update = (d) => SuperAxios.put("/products/" + d.id, d);
  delete = (id) => SuperAxios.post("/products/" + id, { _method: "DELETE" });
  info = (id) => SuperAxios.get("/products/" + id);
  list = (d) => SuperAxios.get("/products", d);
  castadd = (d) => SuperAxios.post("/cast/add", d);

  category = (d) => SuperAxios.get("/product-category/all", d);
 dynamiccontact = (d) => SuperAxios.get("/dynamic-form/product", d);
 categoryadd = (d) => SuperAxios.post("/product-category/add", d);
  
}

export default new Actions();
