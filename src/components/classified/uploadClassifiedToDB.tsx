import { Geolocation } from "@capacitor/geolocation";
import { storage, fstore } from "../../Firebase/Firebase";
import { classifiedItemInterface } from "../../interfaces/classifiedItems";
import { countryInfoInterface } from "../../interfaces/country";
import { PostInterface } from "../../interfaces/posts";
import { UserInterface } from "../../interfaces/users";

interface dataInterface { category: string, name: string, desc: string ,cost:string};

export async function UploadClassifiedItem(data:dataInterface, images: string[], user: UserInterface, country: countryInfoInterface | undefined, features:string[]) {

    const location = (await Geolocation.getCurrentPosition()).coords
    console.log(location)
    const country_name = country?.name || `South Africa`;
    const post: classifiedItemInterface = {
        item_category: data.category,
        item_images: images,
        item_location: location?{long:location.longitude,lat:location.latitude}:{long:0,lat:0},
        timestamp: Date.now(),
        item_name: data.name,
        item_desc: data.desc,
        item_contact:{user_email:user.email, user_name:user.name,user_tel:`6772732`,user_photo:``},
        item_id: Date.now() + user.email,
        item_cost:data.cost,
        item_features:features,
        country_code:country?.country||`SA`,
        item_views:0,
        item_keywords:getKeyWords(data,user,country,features)
    }
    
    return (new Promise(async (resolve, reject) => {

        const main = images[0]
        const blob = await (await fetch(main)).blob()
        console.log(blob)
        storage.ref(`classified/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            console.log(blob)
            if (url) {
                console.log(url)
                fstore.collection(`classified`).doc(post.timestamp + `${user.email}`).set({ ...post, item_images: [url] })
                    .then(async () => {
                        console.log(`resolving`)
                        resolve(`successfull`)
                        console.log(`uploading others`)
                        let imageUrls: string[] = [];
                        for (let i = 1; i < images.length; i++) {
                            const blob = await (await fetch(images[i])).blob()
                            if (blob) {
                                const u = await (await storage.ref(`classified/${user.email}`).put(blob)).ref.getDownloadURL()
                                if (u)
                                    imageUrls = [...imageUrls, u]
                            }
                        }
                        console.log(imageUrls)
                        fstore.collection(`classified`).doc(post.timestamp + `${user.email}`).update({ item_images : [url, ...imageUrls] })
                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}


function getKeyWords(data:dataInterface,user:UserInterface,country:countryInfoInterface|undefined,features:string[]){
  
    const words=[ data.category.toLowerCase(),...data.desc.toLowerCase().split(` `), data.name.toLowerCase(),...user.name.toLowerCase().split(` `),user.email, country?.name?.toLowerCase()||`south africa`,...features.map(feature=>feature.toLowerCase())]
    return words;
}