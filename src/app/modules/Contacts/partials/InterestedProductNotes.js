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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

function Comment({ note}) {
    // const picture = comment?.user && comment.user?.picture !== '' ? App.assetUrl + comment.user?.picture : toAbsoluteUrl("/media/users/default.jpg");
    return (
        <div className="row comment pt-5">
            {/* <div className="col-md-1 text-center">
                <Image className="avatar" src={picture} roundedCircle />
            </div> */}
            {note.user!=="" ? <AccountCircleIcon fontSize="large" style={{marginLeft:"3%"}}/> : <CheckRoundedIcon />}
            <div className="col-md-11">
                <ul className="pl-5">
                    <li><h4>{ note.user.name }</h4></li>
                    <li><p dangerouslySetInnerHTML={{ __html: nl2br(note.remark) }}></p></li>
                    <li className="text-right"><p className="text-muted">{moment(note.created_at).format("lll")}</p></li>
                </ul>
            </div>
        </div>
    );
};

export default React.memo(Comment); 