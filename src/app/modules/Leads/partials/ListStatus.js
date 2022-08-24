import React from 'react';

function ListStatus({ status }) {
    return status === null || status === undefined ? 'PENDING' : status.title;
}
export default React.memo(ListStatus);