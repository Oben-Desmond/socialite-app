import { countryInfoInterface } from "../../interfaces/country";
import { commentInterface } from "../../interfaces/posts";
import { fstore } from "../Firebase";
import * as uuid  from "uuid";


export function uploadCommentToFirebase(comment:commentInterface, page:string,countryInfo:countryInfoInterface,postId:string){
    return( new Promise((resolve, reject)=>{
        console.log(page)
        fstore.collection(`posts/${countryInfo.name|| `South Africa`}/${page}-reactions`).doc(`${postId}`).collection(`comments`).doc(`${comment.id}`).set(comment).then((res)=>{
            resolve(res)
            console.log(`done`)
        }).catch((err)=>{
            reject(err)
        })
    }))
     
}
 