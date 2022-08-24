import React from "react";

export default React.memo(function ({ item }) {
    return (
        <div className="row item-summary">
            <div className="col-md-4">
                <label><strong>Name:</strong></label>
                <p>{item?.name}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Email:</strong></label>
                <p>{item?.email}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Secondary email:</strong></label>
                <p>{item?.secondary_email}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Primary Mobile:</strong></label>
                <p>{item?.mobile_no}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Secondary Mobile:</strong></label>
                <p>{item?.secondary_mobile_no}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Address Line 1:</strong></label>
                <p>{item?.address_line_1}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Address Line 2:</strong></label>
                <p>{item?.address_line_2}</p>
            </div>

            <div className="col-md-4">
                <label><strong>City:</strong></label>
                <p>{item?.city}</p>
            </div>

            <div className="col-md-4">
                <label><strong>State:</strong></label>
                <p>{item?.state ? item?.state?.name : null}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Country:</strong></label>
                <p>{item?.country ? item.country?.name : null}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Postcode:</strong></label>
                <p>{item?.postcode}</p>
            </div>
        </div>
    );
});
