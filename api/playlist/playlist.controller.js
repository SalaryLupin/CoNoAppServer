const models = require("../../models")
const moment = require('moment');
const appUser = require("../../middleware/appuser")

exports.getPlaylist = (req, res, next) => {

  if (!appUser.isLogin(req, res)){ return; }

  let userId = req.AppUser.userId
  let playlistId = req.params.playlistId
  if (!playlistId || !Number(playlistId)) {
    req.Error.wrongParameter(res, "playlistId is needed")
  }

  models.PlaylistShare
    .findOne({
      where: { userId: userId, playlistId: playlistId },
      attributes: [],
      include: {
        model: models.Playlist,
        where: { playlistId: playlistId },
        attributes: [ "playlistId", "title", "place", "startedAt" ],
        include: [
            { model: models.SongList, attributes: ["songId"] },
            { model: models.PlaylistShare, attributes: [ "userId" ] },
        ]
      }
    })
    .then(result => {
      if (result) {
        req.Playlist = result
        next()
      }
      else {
        req.Error.noAuthorization(res)
      }
    })
    .catch(err => {
      console.log(err)
      req.Error.internal(res)
    })

}

// show all playlists
exports.index = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }

  console.log("index approach")
  models.PlaylistShare
    .findAll({
      where: { userId: req.AppUser.userId },
      attributes: [],
      include: {
        model: models.Playlist,
        attributes: [ "playlistId", "title", "place", "startedAt" ],
        include: [
          { model: models.SongList, attributes: ["songId"] },
          { model: models.PlaylistShare, attributes: [ "userId" ] },
        ]
      }
    })
    .then(playlists => playlists.map(playlist => playlist.Playlist))
    .then(result => res.send(result))
    .catch((err) => {
      console.log(err)
      req.Error.internal(res);
    })
}

exports.show = (req, res) => {

  req.Playlist = req.Playlist.Playlist
  res.json(req.Playlist)

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
      console.log(err)
      req.Error.internal(res);
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
      console.log(err)
      req.Error.internal(res);
    })

}

// 플레이리스트에서 유저를 초대하는 api
exports.inviteMember = (req, res) => {

  if (!appUser.isLogin(req, res)){ return; }
  let playlistId = req.params.playlistId;
  let userId = req.AppUser.userId
  let friends = req.body.friends ? req.body.friends : []

  models.PlaylistShare
    .bulkCreate(friends.map(name => {
      return {
        playlistId: playlist.playlistId,
        userId: name
      }
    }))
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.log(err)
      req.Error.internal(res);
    });

}
