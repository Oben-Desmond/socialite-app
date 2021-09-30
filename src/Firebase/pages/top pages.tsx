import { Dialog } from "@capacitor/dialog";
import { countryInfoInterface } from "../../interfaces/country"
import { PostInterface } from "../../interfaces/posts"
import { UserInterface } from "../../interfaces/users"
import { fstore, storage } from "../Firebase"
import { distanceBetween, geohashForLocation, geohashQueryBounds } from "geofire-common";

export async function UploadContent(data: { category: string, title: string, story: string }, images: string[], user: UserInterface, country: countryInfoInterface | undefined, location: { long: number, lat: number }) {

    const hash = geohashForLocation([location.lat, location.long])

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
        coords: [location.lat, location.long],
        geohash: hash
    }
    return (new Promise(async (resolve, reject) => {

        const main = images[0]
        const blob = await (await fetch(main)).blob()
        console.log(blob)
        storage.ref(`posts/${post.location}/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            if (url) {
                console.log(url)
                fstore.collection(`posts/${post.location}/feed`).doc(post.timestamp + `${user.email}`).set({ ...post, images: [url] })
                    .then(async () => {
                        console.log(`resolving`)
                        resolve(`successfull`)
                        console.log(`uploading others`)
                        let imageUrls: string[] = [];
                        for (let i = 1; i < images.length; i++) {
                            const blob = await (await fetch(images[i])).blob()
                            if (blob) {
                                const u = await (await storage.ref(`posts/${post.location}/${user.email}`).put(blob)).ref.getDownloadURL()
                                if (u)
                                    imageUrls = [...imageUrls, u]
                            }
                        }
                        console.log(imageUrls)
                        fstore.collection(`posts/${post.location}`).doc(post.timestamp + `${user.email}`).update({ images: [url, ...imageUrls] })
                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}

export async function UploadEventContent(data: { category: string, title: string, story: string }, images: string[], user: UserInterface, country: countryInfoInterface | undefined, location:{long:number, lat:number}) {

    const country_name = country?.name || `South Africa`;
    const hash = geohashForLocation([location.lat, location.long])
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
        geohash:hash
    }
    return (new Promise(async (resolve, reject) => {

        const main = images[0]
        const blob = await (await fetch(main)).blob()
        console.log(blob)
        storage.ref(`posts/${country_name}/events/${user.email}/${Date.now()}.png`).put(blob).then(async res => {
            const url = await res.ref.getDownloadURL()
            if (url) {
                console.log(url)
                fstore.collection(`posts/${country_name}/events`).doc(post.timestamp + `${user.email}`).set({ ...post, images: [url] })
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
                        fstore.collection(`posts/${country_name}/events`).doc(post.timestamp + `${user.email}`).update({ images: [url, ...imageUrls] })
                    }).catch(reject)
            }
            else reject({ message: `unable to obtain url, sorry` })

        }).catch(reject)
        //

    })
    )

}


export function fetchPostById(id: string, country: string, callBack: (val: PostInterface | any) => void, failed: (err: any) => void) {

    fstore.collection(`posts`).doc(country).collection(`feed`).doc(id)
        .get().then(snapshot => {
            if (snapshot.data()) {
                callBack(snapshot.data());
                return
            }
            failed({ message: `no data` })
            Dialog.alert({ title: `Error getting Post`, message: `Post does not Exist. it may have been deleted` })
        }).catch((err) => {
            Dialog.alert({ title: `Error getting Post`, message: err.message || err || `` })
            failed(err)
        })

}


export async function getSyncedFeed(distance: number, country: string, location:{long:number, lat:number}) {
  
    // Find cities within 50km of London
    const center = [location.lat, location.long];
    const radiusInM = distance;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
        const q =  fstore.collection(`posts`).doc(country).collection(`feed`)
            .orderBy('geohash')
            .startAt(b[0])
            .endAt(b[1]);

        promises.push(q.get());
    }

    // Collect all the query results together into a single list
   return  Promise.all(promises).then((snapshots) => {
        const matchingDocs = [];

        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const lat = doc.get('coords')[0];
                const lng = doc.get('coords')[1];

                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                    matchingDocs.push(doc);
                }
            }
        }

        return matchingDocs.map(doc=>doc.data());
    }).catch(err=>{
      Dialog.alert({message:err.message||err, title:'Error Occured'});
      return []
    });


}


export { };