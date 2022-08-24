import SuperAxios from '../../helpers/SuperAxios';

class Actions {
    
    
    show = (d) => SuperAxios.get("/tele-caller-contact/all",d);
   // delete = (id) => SuperAxios.post("/tele-caller-contact/remove" + id, { _method: 'DELETE' });  
   delete = (d) => SuperAxios.post("/tele-caller-contact/remove",d);    
    users = (d) => SuperAxios.get("/employees/all", d);   

}

export default new Actions();
