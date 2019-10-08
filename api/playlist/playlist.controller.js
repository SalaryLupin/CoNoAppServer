const models = require("../../models")
const moment = require('moment');

exports.getPlaylist = (req, res, next) => {

  const userId = req.AppUser.userId
  const playlistId = req.params.playlistId
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

  console.log("add approach")

  const title = !req.body.title ? "Playlist" : req.body.title ;
  const rawFriends = req.body.friends ? req.body.friends : [];
  const place = req.body.place;
  const timeStr = req.body.time;
  const time = moment(timeStr, "YYYY.MM.dd HH:mm:ss").isValid() ? moment(timeStr, "YYYY.MM.dd HH:mm:ss") : null

  const userId = req.AppUser.userId;
  rawFriends.push(userId)
  console.log(rawFriends);
  // TODO: 친구 아이디 유효성 검사

  const playlist = {}
  models.Playlist.create({
    title: title,
    place: place,
    startedAt: time
  })
  .then(result => {
    playlist = result
    models.PlaylistShare
      .bulkCreate(rawFriends.map(name => {
        return {
          playlistId: result.playlistId,
          userId: name
        }
      }))
  })
  .then(result => {
    res.json(playlist)
  })
  .catch(err => {
    req.Error.internal(res)
  })
}

exports.leavePlaylist = (req, res) => {

  const playlistId = req.params.playlistId;
  const userId = req.AppUser.userId

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

  const playlistId = req.params.playlistId;
  const userId = req.AppUser.userId

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

  const playlistId = req.params.playlistId;
  const userId = req.AppUser.userId
  const friends = req.body.friends ? req.body.friends : []

  models.PlaylistShare
    .bulkCreate(friends.map(name => {
      return {
        playlistId: playlistId,
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
