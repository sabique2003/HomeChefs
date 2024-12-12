import axios from "axios";

const commonApi=async(apiUrl,apiMethod,apiHeaders,apiBody)=>{
    const config = {
        url: apiUrl,
        method: apiMethod,
        headers: apiHeaders ? apiHeaders : { 'Content-Type': 'application/json' },
        data: apiBody,
    };
    
    console.log("API Request Config:", config);
    
    return axios(config)
        .then(res => res)
        .catch(err => {
            console.error("API Error Response:", err.response?.data || err.message);
            return err;
        });
    }
export default commonApi