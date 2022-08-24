import axios from "axios";
import App from '../Configs/app';

const createQueryParams = params => Object.keys(params).map(k => `${k}=${encodeURI(params[k])}`).join('&');

const { PUBLIC_URL } = process.env;

const base = (method, url, data = {}) => {
    var myurl = App.apiUrl + url;
    
    if (method === 'get') {
        const queryParams = createQueryParams(data);
        if (queryParams !== '')
            myurl += '?' + queryParams;
    }

    return axios({
        url: myurl,
        method,
        data: method === 'get' ? undefined : data,
    }).then((response) => {
        const contentType = response.headers['content-type'];
        if (contentType !== 'application/json') return response.data.blob();
        if (response.status === 200) {
            return response.data;
        } else if (response.status === 500) {
            return {
                status: 'FAIL',
                message: 'API: We have some technical issue. Please try later.'
            }
        } else if (response.status === 404) {
            return {
                status: 'FAIL',
                message: 'ERROR CODE: 404'
            }
        }
    }).then((response) => {
        if (response.status && (response.status !== 'SUCCESS' && response.status !== 'FAIL')) {
            window.location.href = PUBLIC_URL + '/logout';
        }
        return response;
    }).catch((error) => {
        return {
            status: 'FAIL',
            message: 'Server Error'
        }
    });
};

const SuperFetch = {};
['get', 'post', 'put', 'delete'].forEach(method => {
    SuperFetch[method] = base.bind(null, method);
});
export default SuperFetch;