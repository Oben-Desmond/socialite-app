async function sendNotification() {
    db.ref('tokens').child('obend678@gmailcom').once('value', (snapshot) => {
        const token = snapshot.val()
        if (token) {
            axios.post('https://socialiteapp-backend.herokuapp.com/message/single', { token }).catch(alert).then(alert)
        }
    })//

}