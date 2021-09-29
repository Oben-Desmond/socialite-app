import { Dialog } from "@capacitor/dialog";
import { distanceBetween, geohashQueryBounds } from "geofire-common";
import { fstore } from "../Firebase";

export async function getSyncedEvents(distance: number, country: string, location:{long:number, lat:number}) {
  
    // Find cities within 50km of London
    const center = [location.lat, location.long];
    const radiusInM = distance;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
        const q =  fstore.collection(`posts`).doc(country).collection(`events`)
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