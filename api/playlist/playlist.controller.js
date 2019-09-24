const models = require("../../models")
const moment = require('moment');
const appUser = require("../../middleware/appuser")

// show all playlists
exports.index = (req, res) => {
  console.log("index approach")
  models.Playlist
    .findAll()
    .then((result) => {
      res.json(result);
    })
}

exports.show = (req, res) => {
  console.log("show approach")
  let playlistId = req.params.playlistId
  models.Playlist
    .findOne({
      where: { playlistId: playlistId },
      include: { model: models.SongList }
    })
    .then((result) => {
      res.json(result);
    })
}

exports.add = (req, res) => {

  if (!appUser.isLogin(req, res)){
    return
  }

  console.log("add approach")

  let title = !req.body.title ? "Playlist" : req.body.title ;
  let rawFriends = req.body.friends;
  let place = req.body.place;
  let timeStr = req.body.time;
  let time = moment(timeStr, "YYYY.MM.dd HH:mm:ss").isValid() ? moment(timeStr, "YYYY.MM.dd HH:mm:ss") : new Date()

  let userId = req.AppUser.userId;
  rawFriends.push(userId)

  models.Playlist.create({
    title: title,
    place: place,
    startedAt: time
  })
  .then(result => {
    models.PlaylistShare
      .bulkCreate(rawFriends.map(name => {
        return {
          playlistId: result.playlistId,
          userId: name
        }
      }))
  })
  .then(result => {
    res.json(result)
  })

}
