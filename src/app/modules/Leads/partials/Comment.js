import React from "react";
import { Image } from "react-bootstrap";
import { nl2br } from "../../../helpers/Helper";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import App from "../../../Configs/app";
import moment from "moment";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";

function Comment({ comment }) {
  return (
    <div className="row comment pt-5">
      {comment.user &&
      comment.user !== "" &&
      comment.user.name &&
      comment.remark ? (
        <AccountCircleIcon fontSize="large" style={{ marginLeft: "3%" }} />
      ) : (
        <CheckRoundedIcon />
      )}
      {comment.user &&
        comment.user !== "" &&
        comment.user.name &&
        comment.remark && (
          <div className="col-md-11">
            <ul className="pl-5">
              <li>
                <h4>{comment?.user?.name}</h4>
              </li>
              <li>
                <p
                  dangerouslySetInnerHTML={{ __html: nl2br(comment.remark) }}
                ></p>
              </li>
              <li className="text-right">
                <p className="text-muted">
                  {moment(comment.created_at).format("lll")}
                </p>
              </li>
            </ul>
          </div>
        )}
    </div>
  );
}

export default React.memo(Comment);
