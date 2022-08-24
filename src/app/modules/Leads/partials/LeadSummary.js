import React from "react";
import { nl2br } from '../../../helpers/Helper';
import ListStatus from './ListStatus';

export default React.memo(function ({ lead, stickyNote }) {
    console.log(lead)
    return (
        <div className="row lead-summary">
            <div className="col-md-4">
                <label>Lead Name:</label>
                <p>{lead?.lead_name}</p>
            </div>

            <div className="col-md-4">
                <label>Lead Source:</label>
                <p>{lead?.lead_source}</p>
            </div>

            <div className="col-md-4">
                <label>Lead Status:</label>
                <p><ListStatus status={lead.lead_status} /></p>
            </div>

            <div className="col-md-4">
                <label>Email:</label>
                <p>{lead?.email}</p>
            </div>

            <div className="col-md-4">
                <label>Secondary email:</label>
                <p>{lead?.secondary_email}</p>
            </div>

            <div className="col-md-4">
                <label>Primary Mobile:</label>
                <p>{lead?.mobile_no}</p>
            </div>

            <div className="col-md-4">
                <label>Secondary Mobile:</label>
                <p>{lead?.secondary_mobile_no}</p>
            </div>

            <div className="col-md-4">
                <label>Address Line 1:</label>
                <p>{lead?.address_line_1}</p>
            </div>

            <div className="col-md-4">
                <label>Address Line 2:</label>
                <p>{lead?.address_line_2}</p>
            </div>

            <div className="col-md-4">
                <label>City:</label>
                <p>{lead?.city}</p>
            </div>

            <div className="col-md-4">
                <label>State:</label>
                <p>{lead.state_id}</p>
            </div>

            <div className="col-md-4">
                <label>Country:</label>
                <p>{lead?.country ? lead.country?.name : null}</p>
            </div>

            <div className="col-md-4">
                <label>Postcode:</label>
                <p>{lead?.postcode}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Sticky Note:</strong></label><br/>
                <span className="st-note ml-4">{stickyNote ? stickyNote : lead.sticky_note}</span>
            </div>
            
            {lead?.notes !== '' && lead?.notes !== null && (
                <div className="col-md-12">
                    <label>Notes:</label>
                    <p dangerouslySetInnerHTML={{ __html: nl2br(lead?.notes) }}></p>
                </div>
            )}

            {lead?.special_instructions !== '' && lead?.special_instructions !== null && (
                <div className="col-md-12">
                    <label>Special Instructions:</label>
                    <p dangerouslySetInnerHTML={{ __html: nl2br(lead?.special_instructions) }}></p>
                </div>
            )}

            {lead?.description !== '' && lead?.description !== null && (
                <div className="col-md-12">
                    <label>Description:</label>
                    <p dangerouslySetInnerHTML={{ __html: nl2br(lead?.description) }}></p>
                </div>
            )}
        </div>
    );
});
