import { CustomEmail } from "../../interfaces/emailtypes";
import { PostInterface } from "../../interfaces/posts";
import { UserInterface } from "../../interfaces/users";
import { db } from "../Firebase";
import { sendNotification } from "./notifications";
import * as uuid from "uuid";
import { dbReactionNotification, InAppNotification } from "../../interfaces/notifications";

export function sendCommentReaction(text = '', user: UserInterface, post: PostInterface) {

    
    sendNotification({
        data: {
            id: post.id,
            type: 'feed'
        },
        email: user?.email || '',
        notification: {
            body: text,
            image: user?.photoUrl || (post.images.length > 0 ? post.images[0] : ''),
            title: (user?.name || 'someone') + ' commented on your post'
        }

    })
    sendReactionEmail({ text, user, post })

}



export function sendReactionNotificaton(text = '', user: UserInterface, post: PostInterface) {

    sendNotification({
        data: {
            id: post.id,
            type: 'feed'
        },
        email: user?.email || '',
        notification: {
            body: (user?.name || 'someone ') + ' reacted to your local feed \n' + text,
            image: user?.photoUrl || (post.images.length > 0 ? post.images[0] : ''),
            title: 'new reactions on your post'
        }

    })
    sendReactionEmail({ text, user, post })
    const notif_id = uuid.v4();
     
    // saveNotification({ user, message: 'recently reacted to your post', path: '', post })


}


export function saveNotification(params: { user: UserInterface, message: string, path: string, post: PostInterface }) {
    const { user, message, path,post } = params

    const notif_id = uuid.v4();
    const dbnotification: dbReactionNotification = {
        sender: user.email,
        sender_photo: user.photoUrl,
        message: user.name + ' '+message,
        post_id: post.id,
        timestamp: Date.now(),
        id: notif_id,
        path
    }
    db.ref('notifications').child(post.email).child(notif_id).push(dbnotification)
}

export function sendReactionEmail(props: { user: UserInterface, post: PostInterface, text: string }) {
    const { user, post, text } = props
    let email: CustomEmail = {
        fromName: user.name + ' on Socionet says...',
        html: `
            <div>
              <h2>
              ${user.name} Reacted to your post
              </h2>
              <p>
                ${post.description}
               <hr/>
               <p>
               ${text}
                 Visit socionet to see reactions to your post
               </p>
                </p>

            
            </div>
        `,
        subject: `${user.name} Reacted to your post`,
        text: '',
        to: user.email
    }

}
