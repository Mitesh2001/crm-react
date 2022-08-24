import React from "react";
import { Link, useLocation, useParams, Redirect } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { nl2br } from '../../../helpers/Helper';
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import App from '../../../Configs/app';
import moment from 'moment';

function Comment({ note }) {
    const { id } = useParams(); 

    const picture = note?.user && note.user?.picture !== '' ? App.assetUrl + note.user?.picture : toAbsoluteUrl("/media/users/default.jpg");
    return (
        <div className="row comment pt-5">
            <div className="col-md-1 text-center">
                <Image className="avatar" src={picture} roundedCircle />
            </div>
            <div className="col-md-11">
                <ul className="pl-5">
                    <li><h4>{note.get_user.name}  {moment(note.created_at).format("lll")}</h4></li>
                    <li><p dangerouslySetInnerHTML={{ __html: nl2br(note.note) }}></p></li>
                    {/* <li className="text-right"><p className="text-muted">{moment(note.created_at).format("lll")}</p></li> */}
                </ul>
            </div>
        </div>
    );
};

export default React.memo(Comment);