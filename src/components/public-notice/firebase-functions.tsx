import { storage, fstore } from "../../Firebase/Firebase";
import { countryInfoInterface } from "../../interfaces/country";
import { PostInterface } from "../../interfaces/posts";
import { UserInterface } from "../../interfaces/users";

 



export async function UploadPublicNotice(data: { category: string, title: string, story: string }, images: string[], user: UserInterface, country: countryInfoInterface | undefined) {

    const country_name = country?.name || `South Africa`;
    const post: PostInterface = {
        category: data.category,
        images: images,
        location: country_name,
        timestamp: Date.now(),
        title: data.title,
        description: data.story,
        author_name: user.name,
        author_url: user.photoUrl,
        id: Date.now() + user.email,
        email: user.email
    }
    return (new Promise(async (resolve, reject) => {

        const main = images[0]
        const blob = await (await fetch(main)).blob()
        console.log(blob)
        storage.ref(`notice/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            if (url) {
                console.log(url)
                fstore.collection(`notice`).doc(post.timestamp + `${user.email}`).set({ ...post, images: [url] })
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
                        fstore.collection(`notice`).doc(post.timestamp + `${user.email}`).update({ images: [url, ...imageUrls] })
                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}
