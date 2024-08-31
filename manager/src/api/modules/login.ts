//登录接口
import {baseURL} from '../base'

import {request} from '../base';

export const Login = async(username:string,password:string) => {
    const res = request.post(`${baseURL}/login`,{
        username:username,
        password:password,
       });
    return res;
}

