import React from "react";

export default React.memo(function ({ item }) {
    return (
        <div className="row item-summary">
            <div className="col-md-4">
                <label><strong>Subject:</strong></label>
                <p>{item?.name}</p>
            </div>

            <div className="col-md-4">
                <label><strong>Email Content</strong></label>
                <p>{item?.SMS_content}</p>
            </div>

        </div>
    );
});
