import { CustomEmail } from "../../interfaces/emailtypes";
import { PostInterface } from "../../interfaces/posts";
import { UserInterface } from "../../interfaces/users";
import { sendNotification } from "./notifications";

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
    sendReactionEmail({text,user,post})

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
    sendReactionEmail({text,user,post})

}

export function sendReactionEmail(props: { user: UserInterface, post: PostInterface, text:string }) {
    const { user, post,text } = props
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
