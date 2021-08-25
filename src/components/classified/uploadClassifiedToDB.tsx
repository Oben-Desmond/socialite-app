import { Geolocation } from "@capacitor/geolocation";
import { storage, fstore, db } from "../../Firebase/Firebase";
import { classifiedItemInterface } from "../../interfaces/classifiedItems";
import { countryInfoInterface } from "../../interfaces/country";
import { PostInterface } from "../../interfaces/posts";
import { UserInterface } from "../../interfaces/users";
import { CalculateDistanceKm } from "./itemmodal";

interface dataInterface { category: string, name: string, desc: string, cost: string };

export async function UploadClassifiedItem(data: dataInterface, images: string[], user: UserInterface, country: countryInfoInterface | undefined, features: string[],location:{long:number,lat:number}) {

    
     
    console.log(location)
    const country_name = country?.name || `South Africa`;
    const item_id = Date.now() + removeOccurence(`${user.email}`,[`.`, `$`, `#`, `[`, `]`, `-`, `+`, `*`])

    const post: classifiedItemInterface = {
        item_category: data.category,
        item_images: images,
        item_location: location ?location : { long: 0, lat: 0 },
        timestamp: Date.now(),
        item_name: data.name,
        item_desc: data.desc,
        item_contact: { user_email: user.email, user_name: user.name, user_tel: user.tel||`677277277`, user_photo: `` },
        item_id,
        item_cost: data.cost,
        item_features: features,
        country_code: country?.country || `SA`,
        item_views: 0,
    }

    return (new Promise(async (resolve, reject) => {

        const keywords = getKeyWords(data, user, country, features)
        const main = images[0]
        const blob = await (await fetch(main)).blob()
        console.log(blob)
        console.log(keywords);

        storage.ref(`classified/${country_name}/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            console.log(blob)
            if (url) {
                console.log(url)
                fstore.collection(`classified`).doc(item_id).set({ ...post, item_images: [url] })
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
                        fstore.collection(`classified`).doc(item_id).update({ item_images: [url, ...imageUrls] })

                        for (let i in keywords) {
                            const word = keywords[i];
                            const text = [post.item_name, ...post.item_features, post.item_desc.substr(0, 30)]
                            const index = (+i)%text.length
                            db.ref(`indices`).child(word).child(item_id).set(text[index]).catch(console.log)
                        }

                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}


function getKeyWords(data: dataInterface, user: UserInterface, country: countryInfoInterface | undefined, features: string[]) {

    const words = [data.category.toLowerCase(), ...data.desc.toLowerCase().split(` `), data.name.toLowerCase(), ...user.name.toLowerCase().split(` `), user.email.replace(`.`, ``), country?.name?.toLowerCase() || `south africa`, ...features.map(feature => feature.toLowerCase())]

    return words.map(word => removeOccurence(word, [`.`, `$`, `#`, `[`, `]`, `-`, `+`, `*`,` `])).filter((word, index) => (word.trim() != `` && (!(words.indexOf(word, index + 1) >= 0))));
}

function queryWord(word: string) {
    word = removeOccurence(word,[`.`, `$`, `#`, `[`, `]`, `-`, `+`, `*`])
    return ((new Promise((resolve, reject) => {
        db.ref(`indices`).child(word).once(`value`, snapshot => {
            const val = snapshot.val()
            if (val) {
                resolve(val)
            }
            else {
                resolve(undefined)
            }
        })
    })))
}

export function searchKeys(text: string) {


    const words = text.toLowerCase().trim().split(` `)
    let query: any[] = []
    for (let i in words) {
        const word = words[i]
        query = [...query, queryWord(word)]
    }
    return Promise.all(query).then((res) => {
        let results = res.filter(el => (el != undefined))
        results = [...results.map(el => Object.values(el))]
        results = [...results.filter((el, index) => (!(results.indexOf(el, index + 1) >= 0)))]
        let final_results: any[] = []
        results.map(res => {
            final_results = [...final_results, ...res]
        })
        final_results = [...final_results.filter((el, index) => (!(final_results.indexOf(el, index + 1) >= 0)))]


        return (final_results)
    })
}


export function removeOccurence(str: string | undefined, litarray: string[]) {
    if (!str) {
        return ``
    }
    for (let i = 0; i < litarray.length; i++) {
        const lit = litarray[i]
        while (str.indexOf(lit) >= 0) {
            str = str.replace(lit, ``)
        }
    }
    return str
}


export async function getItemsMatching(text: string,location:{long:number,lat:number}) {

    const keys = await getValidIds(text)
    let query: any[] = []
    for (let i in keys) {
        const key = keys[i]
        query = [...query, queryFirestoreDoc(key)]
    }
    if (keys.length < 20) {
        query = [...query, getLast20ClassifiedsNotIn(keys)]
    }
    return (
        Promise.all(query).then(res=>{
            let result:any[]=res.filter((el,index)=>(index<res.length-1))
            result=[...result, ...res[res.length-1]]
             console.log(result)
             result.sort((a,b)=>{
                 const {long,lat}=a.item_location
                 return(CalculateDistanceKm({long,lat},location)-CalculateDistanceKm(b.item_location,location))
             })
             return result
        })
    )


}


function queryFirestoreDoc(key: string) {

    return (new Promise((resolve, reject) => {

        fstore.collection(`classified`).doc(key).get()
            .then((snapshot) => {
                const data = snapshot.data()
                if (data && snapshot.exists)
                    resolve(data)
                else {
                    resolve(undefined)
                }
            }).catch(reject)
    }))
}


function getValidIds(text: string) {
    const words = text.toLowerCase().trim().split(` `)
    let query: any[] = []
    for (let i in words) {
        const word = words[i]
        query = [...query, queryWord(word)]
    }
    return Promise.all(query).then((res) => {
        let results = res.filter(el => (el != undefined))
        let keys: any[] = [];
        results.map(res => {
            keys = [...keys, ...Object.keys(res)]
        })
        keys = results = [...keys.filter((el, index) => (!(keys.indexOf(el, index + 1) >= 0)))]
        console.log(keys)
        // results = [...results.map(el => Object.values(el))]
        // results = [...results.filter((el, index) => (!(results.indexOf(el, index + 1) >= 0)))]
        // let final_results:any[]=[]
        // results.map(res=>{
        //        final_results=[...final_results,...res]
        // })
        // final_results=[...final_results.filter((el, index) => (!(final_results.indexOf(el, index + 1) >= 0)))]


        return keys
    })
}



function getLast20ClassifiedsNotIn(keys: string[]) {

    return (new Promise((resolve, reject) => {
        fstore.collection(`classified`).where(`item_id`,`not-in`,[...keys]).orderBy(`item_id`).limitToLast(20).get().then((snapshot) => {
            const classifieds = snapshot.docs.map(doc => doc.data())
            resolve(classifieds)
        }).catch(reject)
    }))
}