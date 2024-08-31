//score接口
import {baseURL} from '../base'

import {request} from '../base';

export const Rate = async(
    Authorization:string,
    userId:number,
    stageId:number,
    score:number,
    comment:string
) => {
    if (stageId !== undefined && !Number.isInteger(stageId)) {
        throw new Error('stageId 必须是整数');
    }
    if (score !== undefined && !Number.isInteger(score)) {
        throw new Error('score 必须是整数');
    }
    if (userId !== undefined && !Number.isInteger(userId)) {
        throw new Error('userId 必须是整数');
    }
    const res = await request.post(`${baseURL}/score/rate`,
        {userId:userId,
        stageId:stageId,
        score:score,
        comment:comment
        },
        {
            headers: {
                Authorization:Authorization
            }
        }
    )
    return res
}