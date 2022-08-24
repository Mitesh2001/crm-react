import React from "react";
import { Link, useLocation, useParams, Redirect } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { nl2br } from '../../../helpers/Helper';
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import App from '../../../Configs/app';
import moment from 'moment';
import CallIcon from '@material-ui/icons/Call';   // for the call icon
import EmailIcon from '@material-ui/icons/Email';  // for the mail icon
import PeopleIcon from '@material-ui/icons/People'; // for the meet icon
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined'; // for the task icon
import CheckRoundedIcon from '@material-ui/icons/CheckRounded'; // for the visit icon

function Comment({ followupNote }) {
    const { id } = useParams(); 

    //const picture = followupNote?.user && followupNote.user?.picture !== '' ? App.assetUrl + followupNote.user?.picture : toAbsoluteUrl("/media/users/default.jpg");
    return (
        <>
        <div className="row comment pt-5">
           
            {followupNote.assign_type===2 ? 
            <div className="col-md-11">
                <ul className="pl-5">
                <li>
                <div className="row">
                  <div className="col-md-9">
{/*                     <h3>{followupNote.get_created_by.name + ' - '}    <span className="ml-3"> Assign to {followupNote.get_assign_to_data.name } user </span></h3></li>
 */}
                    
                        <h4>
                            {followupNote.follow_up_type==="call" ? <CallIcon  /> : 
                            (followupNote.follow_up_type==="email" ? <EmailIcon  /> : 
                            (followupNote.follow_up_type==="meeting" ? <PeopleIcon /> :
                            (followupNote.follow_up_type==="task" ? <AssignmentOutlinedIcon /> :
                            <CheckRoundedIcon />)))}{followupNote.get_created_by.name + ' - '}<span className="ml-3"> Assign to {typeof followupNote.get_assign_to_data !== 'undefind' && followupNote.get_assign_to_data ? followupNote.get_assign_to_data.name : ''} user </span>
                        </h4>
                        </div>
                        <div className="col-md-3"><span className="text-muted float-right1">{moment(followupNote.dt).format("lll")}</span></div>

                        </div>
                    </li>
{/*                      <li className="text-right"><p className="text-muted">{moment(followupNote.date +" "+followupNote.time).format("lll")}</p></li> 
 */}              
        <li><h5 dangerouslySetInnerHTML={{ __html: nl2br(followupNote.note) }}></h5></li>
   </ul>
</div>




             : <div className="col-md-11">
             <ul className="pl-5">
             <li><h3>{followupNote.get_created_by.name + ' - '}    <span className="ml-3"> Assign to {followupNote.get_role.name } role</span></h3></li>

                 <li>
                     <h4>
                         {followupNote.follow_up_type==="call" ? <CallIcon  /> : 
                         (followupNote.follow_up_type==="email" ? <EmailIcon  /> : 
                         (followupNote.follow_up_type==="meeting" ? <PeopleIcon /> :
                         (followupNote.follow_up_type==="task" ? <AssignmentOutlinedIcon /> :
                         <CheckRoundedIcon />)))}{followupNote.get_created_by.name +' -'}<span className="ml-2">Assign to {typeof followupNote.get_role !== 'undefind' && followupNote.get_role ? followupNote.get_role.name : '' } role</span>
                    <div className="col-md-3"><span className="text-muted float-right1">{moment(followupNote.dt).format("LLL")}</span></div>
                     </h4>
                 </li>
                 <li><h5 dangerouslySetInnerHTML={{ __html: nl2br(followupNote.note) }}></h5></li>
                 
             </ul>
         </div>} 
        </div>
        </>
    );
};

export default React.memo(Comment);