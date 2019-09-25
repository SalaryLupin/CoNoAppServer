const models = require("../../models")
const moment = require('moment');
const appUser = require("../../middleware/appuser")

// show all playlists
exports.index = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }

  console.log("index approach")
  models.Playlist
    .findAll()
    .then((result) => {
      res.json(result);
    })
}

exports.show = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }

  console.log("show approach")
  let playlistId = req.params.playlistId
  models.Playlist
    .findOne({
      where: { playlistId: playlistId },
      include: [
        { model: models.SongList },
        { model: models.PlaylistShare }
      ]
    })
    .then((result) => {
      res.json(result);
    })
}

exports.add = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }

  console.log("add approach")

  let title = !req.body.title ? "Playlist" : req.body.title ;
  let rawFriends = req.body.friends ? req.body.friends : [];
  let place = req.body.place;
  let timeStr = req.body.time;
  let time = moment(timeStr, "YYYY.MM.dd HH:mm:ss").isValid() ? moment(timeStr, "YYYY.MM.dd HH:mm:ss") : null

  let userId = req.AppUser.userId;
  rawFriends.push(userId)
  console.log(rawFriends);

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

exports.leavePlaylist = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }
  let playlistId = req.params.playlistId;
  let userId = req.AppUser ? req.AppUser.userId ? req.AppUser.userId : false : false;

  models.PlaylistShare
    .destroy({
      where: { playlistId: playlistId, userId: userId }
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(400).json({err: "Internal Server Error"})
    })

}

exports.listMember = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }
  let playlistId = req.params.playlistId;
  let userId = req.AppUser ? req.AppUser.userId ? req.AppUser.userId : false : false;

  models.PlaylistShare
    .findAll({
      where: { playlistId: playlistId },
      attributes: ["userId"]
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(400).json({err: "Internal Server Error"})
    })

}

// 플레이리스트에서 유저를 초대하는 api
exports.inviteMember = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }
  let playlistId = req.params.playlistId;
  let userId = req.AppUser ? req.AppUser.userId ? req.AppUser.userId : false : false;
  let friends = req.body.friends ? req.body.friends : []
  console.log(req.body)
  console.log(friends)

  if (!playlistId) {
    res.status(400).json({error: "Invalid Playlist"})
    return;
  }

  if (!userId) {
    res.status(400).json({error: "Invalid Account"})
    return;
  }

  function addPlaylistSharer(playlist){
    return new Promise(function(resolve, reject){
      if (playlist) {
        models.PlaylistShare
          .bulkCreate(friends.map(name => {
            return {
              playlistId: playlist.playlistId,
              userId: name
            }
          }))
          .then(resolve)
      }
      else {
        reject("No Playlist")
      }
    });
  }

  models.Playlist
    .findOne({
      where: { playlistId: playlistId }
    })
    .then(result => {
      addPlaylistSharer(result)
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(400).json({err: "Invalid Playlist Id"})
    });

}
