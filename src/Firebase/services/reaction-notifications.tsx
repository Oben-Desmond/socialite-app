import { PostInterface } from "../../interfaces/posts";
import { UserInterface } from "../../interfaces/users";
import { sendNotification } from "./notifications";

export function sendCommentReaction(text='', user:UserInterface, post:PostInterface){
        
    sendNotification({
        data:{
            id:post.id,
            type:'feed'
        },
        email:user?.email ||'',
        notification:{
            body:text,
            image:user?.photoUrl||(post.images.length>0?post.images[0]:''),
            title:(user?.name||'someone')+' commented on your post'
        }

    })
}


export function sendReactionNotificaton(text='', user:UserInterface, post:PostInterface){
        
    sendNotification({
        data:{
            id:post.id,
            type:'feed'
        },
        email:user?.email ||'',
        notification:{
            body:(user?.name||'someone ')+' reacted to your local feed \n'+text,
            image:user?.photoUrl||(post.images.length>0?post.images[0]:''),
            title:'new reactions on your post'
        }

    })
}
