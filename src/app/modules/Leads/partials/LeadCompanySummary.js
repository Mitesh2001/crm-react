import React from "react";

export default React.memo(function ({ lead }) {
    return (
        <div className="row lead-summary">
            <div className="col-md-4">
                <label>Company Name:</label>
                <p>{lead?.company_name}</p>
            </div>
            <div className="col-md-4">
                <label>Company Type:</label>
                <p>{lead?.company_type ? lead.company_type?.name : null}</p>
            </div>
            <div className="col-md-4">
                <label>Industry:</label>
                <p>{lead?.industry_type ? lead.industry_type?.name : null}</p>
            </div>
            <div className="col-md-4">
                <label>Establish Year:</label>
                <p>{lead?.established_in}</p>
            </div>
            <div className="col-md-4">
                <label>PAN Number:</label>
                <p>{lead?.pan_no}</p>
            </div>
            <div className="col-md-4">
                <label>Number of Employees:</label>
                <p>{lead?.no_of_employees}</p>
            </div>
            <div className="col-md-4">
                <label>Website:</label>
                <p>{lead?.website}</p>
            </div>
        </div>
    );
});
