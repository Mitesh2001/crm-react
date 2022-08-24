import SuperAxios from '../../helpers/SuperAxios';

class Actions {
    
    
    show = (d) => SuperAxios.get("/tele-caller-contact/all",d); 
    add = (d) => SuperAxios.post("/tele-caller-contact/add", d);
    //users = (d) => SuperAxios.post("/tele-caller-contact/user",d);
    list_followup=(d)=>SuperAxios.post("/follow-up/all", d);
    // list_leads = (d) => SuperAxios.get("/lead-assign/all", d);
   // list_leads = (d) => SuperAxios.get("/lead/all", d);
    users = (d) => SuperAxios.get("/employees/all", d);   
    castadd = (d) => SuperAxios.post("/cast/add",d); 
    cast = (d) => SuperAxios.get("/cast/all", d);
    assignLead=(d)=>SuperAxios.post("/follow-up-assign", d);
    states = (cid) => SuperAxios.get("/state/all/" + cid);
    roles = (d) => SuperAxios.get("/role/all", d);
    listEmployee = (d) => SuperAxios.get("/employee", d);


}

export default new Actions();
