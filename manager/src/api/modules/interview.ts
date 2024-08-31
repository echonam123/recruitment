//interview 接口
import {baseURL} from '../base'

import {request} from '../base';


//管理端设置可预约时间和人数
export const SetInterview = async(
    Authorization:string,
    startTime:string,
    endTime:string,
    capacity:number,
    stageId:number,
    direction:number) => {
        if (capacity !== undefined && !Number.isInteger(capacity)) {
            throw new Error('capacity 必须是整数');
        }
        if (stageId !== undefined && !Number.isInteger(stageId)) {
            throw new Error('stageId 必须是整数');
        }
        if (direction !== undefined && !Number.isInteger(direction)) {
            throw new Error('direction 必须是整数');
        }
        const res = await request.post(`${baseURL}/interview/set`,
            {startTime:startTime,
            endTime:endTime,
            capacity:capacity,
            stageId:stageId,
            direction:direction
            },
            {
                headers:{Authorization:Authorization}
            }
        )
        return res
}

//根据timeId 获取所有预约了该时间的所有用户信息
//url 未确定！！
export const GetInterviewByTime = async(Authorization:string,timeId:string) => {
    const res = await request.get(`${baseURL}/interview/{timeId}`,
        {
            params:{timeId:timeId},
            headers:{Authorization:Authorization}
        }
    )
    return res
}

//删除已预约时间
//url 未确定！！
export const DeleteInterviewTime = async(Authorization:string,timeId:string) => {
    const res = await request.delete(`${baseURL}/interview/delete`,
        {
            params:{timeId:timeId},
            headers:{Authorization:Authorization}
        }
    )
    return res
}


//修改可预约时间
export const UpdateInterviewTime = async(
    Authorization:string,
    startTime:string,
    endTime:string,
    capacity:number,
    stageId:number,
    direction:number,
    timeId:number) => {
        if (capacity !== undefined && !Number.isInteger(capacity)) {
            throw new Error('capacity 必须是整数');
        }
        if (stageId !== undefined && !Number.isInteger(stageId)) {
            throw new Error('stageId 必须是整数');
        }
        if (direction !== undefined && !Number.isInteger(direction)) {
            throw new Error('direction 必须是整数');
        }
        if (timeId !== undefined && !Number.isInteger(timeId)) {
            throw new Error('timeId 必须是整数');
        }
        const res = await request.put(`${baseURL}/interview/modify`,
            {startTime:startTime,endTime:endTime,capacity:capacity,stageId:stageId,direction:direction,timeId:timeId},
            {
                headers:{Authorization:Authorization}
            }
        )
        return res;
}