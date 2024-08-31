//user接口
import {baseURL} from '../base'

import {request} from '../base';

//stageId 确保整型-待处理
export const CheckApplicants = async(Authorization:string,college?:string,major?:string,stageId?:number,isOut?:boolean) => {
    if (stageId !== undefined && !Number.isInteger(stageId)) {
        throw new Error('stageId 必须是整数');
    }
    const res = await request.post(`${baseURL}/user/select`,
        {college:college,major:major,stageId:stageId,isOut:isOut},
        {
            headers: {
                Authorization:Authorization,
            }
        }
    )
    return res;
}

//按姓名、学号搜索对应用户 接口
export const SelectUser = async(name?:string,studentId?:string) => {
    const res = await request.post(`${baseURL}/user/select`,
        {name:name,studentId:studentId}
    )
    return res;
}

//批量淘汰人 接口
export const BatchOut = async(Authorization:string,userIds:number[]) => {
    if (!Array.isArray(userIds) || !userIds.every(id => Number.isInteger(id))) {
        throw new Error('userIds 必须是一个包含整数的数组');
    }
    const res = await request.post(`${baseURL}/user/batch`,
        {userIds:userIds},
        {
            headers: {Authorization:Authorization}
        }
    )
    return res;
}

//批量淘汰用户 接口
export const BatchOutUser = async(Authorization:string,userIds:number[]) => {
    if (!Array.isArray(userIds) || !userIds.every(id => Number.isInteger(id))) {
        throw new Error('userIds 必须是一个包含整数的数组');
    }
    const res = await request.put(`${baseURL}/user/batch`,
        {array:userIds},
        {
            headers: {Authorization:Authorization}
        }
    )
    return res;
}