const isValidImage = (type) => {
    if (type === 'image/jpeg' || type === 'image/jpg' || type === 'image/png') {
        return true;
    }
    return false;
}

const leadStatusArray = [
    {
        id: 0,
        name: 'Pending'
    },
    {
        id: 1,
        name: 'In Progress'
    },
    {
        id: 2,
        name: 'Completed'
    },
]

const nl2br = (str, is_xhtml) => {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

const validatePhoneOnPress = e => {
    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) || e.target.value.length > 9) e.preventDefault();
}

const disableUpDownArrow = e => {
    if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();
}

const TinyEditorKey= "659iiizl8eltocg6tx0g1jk4gwjjude56037pkgq9lwu48df";

export {
    isValidImage,
    leadStatusArray,
    nl2br,
    validatePhoneOnPress,
    disableUpDownArrow,
	TinyEditorKey
}