import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  info = (d) => SuperAxios.get("/announcement/all", d);
}

export default new Actions();
