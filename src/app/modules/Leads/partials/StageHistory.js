import React from "react";
import { Link, useLocation, useParams, Redirect } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { nl2br } from '../../../helpers/Helper';
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import App from '../../../Configs/app';
import moment from 'moment';

function Comment({ history }) {
    const { id } = useParams(); 

    return (
        <div className="row comment pt-5">
            <div className="col-md-11">
                 <ul className="pl-5">
                    {/* <li><h4>{history.user.name}</h4></li> */}
                    <li> This is <span dangerouslySetInnerHTML={{ __html: nl2br(history.lead_stage) }}></span> customer </li>
                    <li className="text-right"><p className="text-muted">{moment(history.created_at).format("lll")}</p></li>
 
                </ul> 
            </div>
        </div>
    );
};

export default React.memo(Comment);