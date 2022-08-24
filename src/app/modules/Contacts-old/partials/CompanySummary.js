import React from "react";

export default React.memo(function ({ item }) {
    return (
        <div className="row item-summary">
            <div className="col-md-4">
                <label><strong>Company Name:</strong></label>
                <p>{item?.company_name}</p>
            </div>
            <div className="col-md-4">
                <label><strong>Company Type:</strong></label>
                <p>{item?.company_type ? item.company_type?.name : null}</p>
            </div>
            <div className="col-md-4">
                <label><strong>Industry:</strong></label>
                <p>{item?.industry_type ? item.industry_type?.name : null}</p>
            </div>
            <div className="col-md-4">
                <label><strong>Establish Year:</strong></label>
                <p>{item?.established_in}</p>
            </div>
            <div className="col-md-4">
                <label><strong>PAN Number:</strong></label>
                <p>{item?.pan_no}</p>
            </div>
            <div className="col-md-4">
                <label><strong>Number of Employees:</strong></label>
                <p>{item?.no_of_employees}</p>
            </div>
            <div className="col-md-4">
                <label><strong>Website:</strong></label>
                <p>{item?.website}</p>
            </div>
        </div>
    );
});
