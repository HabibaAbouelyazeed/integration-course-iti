import axios from "axios";

export const server = axios.create({
    baseURL:'http://localhost:3000/',
    headers: {
        "Content-Type": 'application/json',
    }
})

server.interceptors.request.use(
    (config) =>{
        const accessToken = JSON.parse(localStorage.getItem('token'));
        if(accessToken){
            if(config.headers){
                config.headers.token = accessToken;
            }
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error)
    }
);

server.interceptors.response.use(
    (response) =>{
        // console.log('response: ', response);
        return response;
    },

    (error) => {
        return Promise.reject(error);
    }
);