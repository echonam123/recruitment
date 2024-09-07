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
    const res = await request.post('/score',
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

export const GetRate = async(token:string,userId:number) => {
    const res = await request.get("/score" + userId,
        {
            headers: {
                Authorization:token
            }
        }
    );
    return res;
}