// @flow strict

import { IonItem, IonGrid, IonRow, IonCol, IonLabel, IonAvatar, IonImg } from '@ionic/react';
import { timeStamp } from 'console';
import  React,{useState} from 'react';
import { ReviewItemInterface } from '../../interfaces/classifiedItems';
import LetteredAvatar from '../LetterAvatar';
import { ReadableDate } from '../text formaters/date-formater';
import { GetHoursAgo } from '../top stories/StoriesCard';
import { StarReview } from './itemmodal';

const ReviewItem: React.FC<{ data: ReviewItemInterface }> = function ({ data: { photoUrl, rating, text, timestamp, username } }) {
    const colors = [`primary`, `secondary`, `danger`, `success`, `warning`, `tertiary`, `dark`, `medium`]
    const alpha = `abcdefghijklmnopqrstuvwxyz`;
    const [randomColor] = useState(colors[getColorIndex(username)])
    function getColorIndex(name: string) {
        let num = 0
        if (!name) return num;

        const index = alpha.indexOf(name[0].toLowerCase())
        num = index >= 0 ? index : 0;

        return num % colors.length
    }
    return (
        <IonItem className={`review-item`}>
            <IonGrid>
                <IonRow>
                    <IonCol size={`3.4`}>
                        {photoUrl && <IonAvatar   >
                            <IonImg src={photoUrl} />
                        </IonAvatar>}
                        {
                            !photoUrl && username && <LetteredAvatar style={{ fontSize: `12px` }} size={40} backgroundColor={`var(--ion-color-${randomColor})`} name={username}></LetteredAvatar>
                        }
                    </IonCol>
                    <IonCol style={{ textAlign: `center` }} className={`date`}>
                        <GetHoursAgo timestamp={timestamp} />
                        <IonLabel>{username}</IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol style={{ textAlign: `right` }}>
                        <IonRow>
                            <StarReview value={rating}></StarReview>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <div>{text}</div>
            </IonGrid>
        </IonItem>
    );
};

export default ReviewItem;