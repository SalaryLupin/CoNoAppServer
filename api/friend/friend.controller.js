const models = require("../../models")

exports.addFriends = (req, res) => {

  let userId = req.AppUser.userId
  let friends = req.body.friends ? req.body.friends : []
  friends = friends.map(name => { return { relatingUserId: userId, relatedUserId: name }})

  models.Relationship
    .bulkCreate(friends)
    .then(result=> {
      res.json(result)
    })
    .catch(err=>{
      console.log(err)
      req.Error.internal(res)
    })

}

exports.deleteFriends = (req, res) => {

  let userId = req.AppUser.userId
  let friends = req.body.friends ? req.body.friends : []

  models.Relationship
    .destroy(
      { where: {
        relatingUserId: userId,
        relatedUserId: friends
      }})
    .then(result=>{
      res.json({ msg: "success" })
    })
    .catch(err=>{
      console.log(err)
      req.Error.internal(res)
    })

}
