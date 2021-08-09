import { commentInterface } from "../../interfaces/posts";
import { fstore } from "../Firebase";


export function uploadCommentToFirebase(comment:commentInterface,postid:string, page:string){

    return( new Promise((resolve, reject)=>{
        console.log(page)
        fstore.collection(`${page}-comment`).doc(`${postid}`).collection(`comments`).doc(`${comment.id}`).set(comment).then((res)=>{
            resolve(res)
            console.log(`done`)
        }).catch((err)=>{
            reject(err)
        })
    }))
     
}
 