import SuperAxios from "../../../../../app/helpers/SuperAxios";

class Actions {
  dashboard = (d) => SuperAxios.get("/dashboard", d);
}

export default new Actions();
