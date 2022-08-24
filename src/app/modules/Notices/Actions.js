import SuperAxios from "../../helpers/SuperAxios";

class Actions {
  info = (d) => SuperAxios.get("/notice/all", d);
}

export default new Actions();
