/**
 * Created by rishabhkhanna on 17/07/17.
 */
let User = require('../app/models/user');
let axios = require('axios');
function authenticateUser(firstName, lastName, token, userId,callback) {

    User.findOne({where: {id: userId}})
        .then(function (user, err) {
            console.log(user);
            if (err) {
                throw err
                callback({success:false}) ;
            }
            console.log(JSON.stringify(user));
            if(user.access_token != token){
                callback({success:true});
            }else{
                axios.get('https://graph.facebook.com/v2.6/'+ userId +'?fields=email&access_token=' + token)
                    .then(function (response) {
                        const user = User.build({
                            id: userId,
                            access_token: token,
                            email: response.data.email,
                            name: firstName + " " + lastName
                        });
                        user.save().then(function () {
                            console.log("success in saving");
                            callback( {success: true, email: response.data.email})
                        }).catch(function (err) {
                            console.log(err)
                        })
                    })

            }
        })
}

module.exports = authenticateUser;
