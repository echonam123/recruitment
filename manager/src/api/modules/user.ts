// admin/user接口
import {baseURL} from '../base'

import {request} from '../base';

export const CheckApplicants = async(Authorization:string,college?:string,major?:string,stageId?:number,isOut?:boolean) => {
    //可选参数也必须传参 晕 :（
    const Major = major || '';
    const College = college || '';
    const StageId = stageId || '';
    const IsOut = isOut || '';
    const res = await request.post(`${baseURL}/user/select`,
        {college:College,major:Major,stageId:StageId,isOut:IsOut},
        {
            headers: {
                Authorization:Authorization,
            }
        }
    )
    return res;
}

//按姓名、学号搜索对应用户 接口
export const SelectUser = async(token:string,name?:string,studentId?:string) => {
    const res = await request.post('/user/selectUser',
        {name:name,studentId:studentId},
        {
            headers: {
                Authorization:token,
            }
        }
    )
    return res;
}

//批量淘汰人 接口
export const BatchOut = async(Authorization:string,userIds:number[]) => {
    const res = await request.post('/user/batch',
        {userId:userIds},
        {
            headers: {Authorization:Authorization}
        }
    )
    return res;
}

//批量淘汰用户 接口
export const BatchOutUser = async(Authorization:string,userIds:number[]) => {
    const res = await request.put(`${baseURL}/admin/out`,
        {array:userIds},
        {
            headers: {Authorization:Authorization}
        }
    )
    return res;
}