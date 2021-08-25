// @flow strict

import { IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonNote, IonSpinner, IonTextarea } from '@ionic/react';
import { paperPlane, send, sendOutline, star, starOutline } from 'ionicons/icons';
import * as React from 'react';
import FlipMove from 'react-flip-move';
import { useSelector } from 'react-redux';
import { fstore } from '../../Firebase/Firebase';
import { UserInterface } from '../../interfaces/users';
import { selectUser } from '../../states/reducers/userReducers';
import * as uuid from "uuid";
import { classifiedItemInterface, ReviewItemInterface } from '../../interfaces/classifiedItems';

const ReviewInput: React.FC<{ reviewSent: () => void,item:classifiedItemInterface }> = function ({ reviewSent,item }) {

    const [stars, setstars] = React.useState<number[]>([1, 1, 1, 0, 0])
    const [starCount, setstarCount] = React.useState(3)
    const [sendExperience, setsendExperience] = React.useState(false)
    const user: UserInterface = useSelector(selectUser)
    const [reviewId, setreviewId] = React.useState(user.email)
    const [descText, setdescText] = React.useState(``)
    const [loading, setloading] = React.useState(false)

    function changeStarRate(selected: number) {
        const newstars = [...stars.map((num, index) => index <= selected ? 1 : 0)]
        setstars([...newstars])
        let count = 0;
        newstars.map(num => count += num)
        setstarCount(count)
    }

    function uploadStarRating() {
        const review: ReviewItemInterface = {
            email: user.email,
            id: user.email,
            photoUrl: user.photoUrl,
            rating: starCount,
            text: descText,
            timestamp: Date.now(),
            username: user.name
        }
        fstore.collection(`users`).doc(item.item_contact.user_email).collection(`classified_reviews`).doc(reviewId).set(review).then(console.log).catch(console.log);
        setsendExperience(true)
    }

    async function uploadDescription() {
        setloading(true)
          await fstore.collection(`users`).doc(item.item_contact.user_email).collection(`classified_reviews`).doc(reviewId).update({ text: descText }).then(console.log).catch(console.log);
        reviewSent();
        setsendExperience(false)
    }

    return (
        <div>
            <div className={`${sendExperience ? `` : `star-input`}`}>
                <FlipMove>
                    {
                        (!sendExperience &&
                            <div className={`star-button`}><IonButtons>
                                {
                                    stars.map((num, index) => {
                                        return <IonButton onClick={() => changeStarRate(index)} color={`secondary`}><IonIcon icon={num ? star : starOutline} /></IonButton>

                                    })
                                }
                            </IonButtons>
                                <IonNote className={`star-expression`}>
                                    <ShowRatingExpression value={starCount}></ShowRatingExpression>
                                </IonNote>
                            </div>)
                    }
                </FlipMove>
                {!sendExperience && <IonItem className={`star-btn-next`}>
                    <IonButton onClick={() => { uploadStarRating() }} color={`secondary`} slot={`end`} ><IonIcon slot={`end`} icon={send}></IonIcon> <IonLabel> send </IonLabel> </IonButton>
                </IonItem>}
                <FlipMove>
                    {
                        (sendExperience &&

                            <div className="input">
                                <IonTextarea onIonChange={(e) => setdescText(e.detail.value || ``)} value={descText} placeholder={`please add a description of your experience`}></IonTextarea>
                            </div>)
                    }
                </FlipMove>
            </div>


            {sendExperience && <IonItem className={`star-btn-next`}>
                <IonButton disabled={loading} onClick={() => { uploadDescription() }} color={`secondary`} slot={`end`} >{
                    loading?<IonSpinner></IonSpinner>:<>
                    <IonIcon slot={`end`} icon={send}></IonIcon> <IonLabel> submit </IonLabel></>
                } </IonButton>
            </IonItem>}
        </div>
    );
};

export default ReviewInput;



function ShowRatingExpression(props: { value: number }) {
    if (props.value == 5)
        return (
            <> This supplier is amazing <span className="emoji">😍</span></>
        )
    if (props.value == 4)
        return (
            <> Supplier is good <span className="emoji">😇</span></>
        )

    if (props.value == 3)
        return (
            <> Average Service <span className="emoji">😊</span></>
        )
    if (props.value == 2)
        return (
            <> Not so good <span className="emoji">😞</span></>
        )

    return (
        <> Not satisfied at all <span className="emoji">😠</span></>
    )
}