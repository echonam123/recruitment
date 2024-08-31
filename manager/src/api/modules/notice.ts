//通知接口
import {baseURL} from '../base'

import {request} from '../base';

export const SendNotice = async(phone:string[],message:string,Authorization:string) => {
    if (!Array.isArray(phone) || !phone.every(id => typeof id === 'string')) {
        throw new Error('phone 必须是一个字符串数组');
    }
    const res = request.post(`${baseURL}/notification/send`,{
        phone:phone,
        message:message,
       }, {headers:{Authorization:Authorization}});
    return res;
}

