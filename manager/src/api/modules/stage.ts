//stage接口
import {baseURL} from '../base'

import {request} from '../base';

//新增阶段
export const AddStage = async(
    Authorization:string,
    startTime:string,
    endTime:string,
    stageTag:string
) => {
    const res = await request.post(`${baseURL}/stage`,
       {
        startTime:startTime,
        endTime:endTime,
        stageTag:stageTag
       },
       {
        headers:{
            Authorization:Authorization
        }
       }
    )
    return res;
}

//修改阶段
export const EditStage = async(
    stageId:string,
    Authorization:string,
    startTime?:string,
    endTime?:string,
    stageTag?:string
) => {
    const res = await request.post(`${baseURL}/updateStage`,
       {
        startTime:startTime,
        endTime:endTime,
        stageTag:stageTag,
        stageId:stageId
       },
       {
        headers:{
            Authorization:Authorization
        }
       }
    )
    return res;
}

//查看所有状态
export const GetList = async(
    code:number,
    message:string,
    data:GetListresponse,
) => {
    const res = await request.get(`${baseURL}/listStage`,
        {params:{
            code:code,
            message:message,
            data:data
        }}
    )
    return res;
}

export interface GetListresponse{
    stageId:number,
    startTime:string,
    endTime:string,
    stageName:string,
}