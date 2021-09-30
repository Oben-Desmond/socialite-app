
export interface dbReactionNotification{
    sender:string,
    sender_photo:string,
    message:string,
    post_id:string,
    timestamp:number,
    id:string,
    path:string
}

export interface InAppNotification{
    sender:string,
    sender_photo:string,
    message:string,
    post_id:string,
    timestamp:number,
    id:string,
    category:string
    path:string,
    type:'reaction'|'comment'|'review'|'incident'
}