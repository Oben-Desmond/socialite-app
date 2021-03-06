import { Dialog } from "@capacitor/dialog";
import { storage, fstore } from "../../Firebase/Firebase";
import { countryInfoInterface } from "../../interfaces/country";
import { PostInterface } from "../../interfaces/posts";
import { UserInterface } from "../../interfaces/users";

 



export async function UploadPublicNotice(data: { category: string, title: string, story: string }, images: string[], user: UserInterface, country: countryInfoInterface | undefined) {

    const country_name = country?.name || `South Africa`;
    const post: PostInterface = {
        images: images,
        location: country_name,
        timestamp: Date.now(),
        title: data.title,
        description: data.story,
        author_name: user.name,
        author_url: user.photoUrl,
        id: Date.now() + user.email,
        email: user.email,
        geohash:'0000'
    }
    return (new Promise(async (resolve, reject) => {

        const main = images[0]
        const blob = await (await fetch(main)).blob()
        console.log(blob)
        storage.ref(`posts/${country_name}/notice/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            if (url) {
                console.log(url)
                fstore.collection(`posts/${country_name}/notice`).doc(post.timestamp + `${user.email}`).set({ ...post, images: [url] })
                    .then(async () => {
                        console.log(`resolving`)
                        resolve(`successfull`)
                        console.log(`uploading others`)
                        let imageUrls: string[] = [];
                        for (let i = 1; i < images.length; i++) {
                            const blob = await (await fetch(images[i])).blob()
                            if (blob) {
                                const u = await (await storage.ref(`notice/${user.email}`).put(blob)).ref.getDownloadURL()
                                if (u)
                                    imageUrls = [...imageUrls, u]
                            }
                        }
                        console.log(imageUrls)
                        fstore.collection(`posts/${country_name}/notice`).doc(post.timestamp + `${user.email}`).update({ images: [url, ...imageUrls] })
                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}


export function fetchNoticeById(id:string, country:string, callBack: (val:PostInterface|any)=>void, failed:(err:any)=>void){
     
    fstore.collection(`posts`).doc(country).collection(`notice`).doc(id)
    .get().then(snapshot=>{
        if(snapshot.data()){
            callBack(snapshot.data());
            return
        }
        failed({message:`no data`})
        Dialog.alert({title:`Error getting Post`,message:`Post does not Exist. it may have been deleted`})
    }).catch((err)=>{
        Dialog.alert({title:`Error getting Post`,message:err.message||err||``})
        failed(err)
    })
 
}