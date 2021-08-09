import { countryInfoInterface } from "../../interfaces/country"
import { PostInterface } from "../../interfaces/posts"
import { UserInterface } from "../../interfaces/users"
import { fstore, storage } from "../Firebase"

export async function UploadContent(data: { category: string, title: string, story: string }, images: string[], user: UserInterface, country: countryInfoInterface | undefined) {

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
        storage.ref(`posts/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            if (url) {
                console.log(url)
                fstore.collection(`posts`).doc(post.timestamp + `${user.email}`).set({ ...post, images: [url] })
                    .then(async () => {
                        console.log(`resolving`)
                        resolve(`successfull`)
                        console.log(`uploading others`)
                        let imageUrls: string[] = [];
                        for (let i = 1; i < images.length; i++) {
                            const blob = await (await fetch(images[i])).blob()
                            if (blob) {
                                const u = await (await storage.ref(`posts/${user.email}`).put(blob)).ref.getDownloadURL()
                                if (u)
                                    imageUrls = [...imageUrls, u]
                            }
                        }
                        console.log(imageUrls)
                        fstore.collection(`posts`).doc(post.timestamp + `${user.email}`).update({ images: [url, ...imageUrls] })
                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}

export async function UploadEventContent(data: { category: string, title: string, story: string }, images: string[], user: UserInterface, country: countryInfoInterface | undefined) {

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
        storage.ref(`events/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            if (url) {
                console.log(url)
                fstore.collection(`events`).doc(post.timestamp + `${user.email}`).set({ ...post, images: [url] })
                    .then(async () => {
                        console.log(`resolving`)
                        resolve(`successfull`)
                        console.log(`uploading others`)
                        let imageUrls: string[] = [];
                        for (let i = 1; i < images.length; i++) {
                            const blob = await (await fetch(images[i])).blob()
                            if (blob) {
                                const u = await (await storage.ref(`events/${user.email}`).put(blob)).ref.getDownloadURL()
                                if (u)
                                    imageUrls = [...imageUrls, u]
                            }
                        }
                        console.log(imageUrls)
                        fstore.collection(`events`).doc(post.timestamp + `${user.email}`).update({ images: [url, ...imageUrls] })
                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}




export { };