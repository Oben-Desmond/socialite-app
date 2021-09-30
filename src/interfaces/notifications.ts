
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
    sender_name:string,
    sender_photo:string,
    message:string,
    post_id:string,
    post_title:string,
    timestamp:number,
    id:string,
    category:'events'|'feed'|'public notice' | 'classified'|'incident'
    path:string,
    type:'reaction'|'comment'|'review'|'incident'
}