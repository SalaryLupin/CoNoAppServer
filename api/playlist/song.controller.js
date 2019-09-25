const models = require("../../models")
const moment = require('moment');
const appUser = require("../../middleware/appuser")

// show all song
exports.list = (req, res) => {

  if (!appUser.isLogin(req, res)){ res.status(400).json({err: "Invalid Account"}) }
  let playlistId = req.params.playlistId;
  let userId = req.AppUser ? req.AppUser.userId ? req.AppUser.userId : false : false;

  models.SongList
    .findAll({
      where: { playlistId: playlistId },
      attributes: [ "songId" ]
    })
    .then(result =>{
      res.json(result)
    })
    .catch(err => {
      res.status(400).json({err: "Internal Server Error"})
    })
}

/**
  플레이리스트의 곡 정보를 보여주는 api
*/
exports.show = (req, res) => {

  if (!appUser.isLogin(req, res)){ res.status(400).json({err: "Invalid Account"}) }

  console.log("show approach")
  let playlistId = req.params.playlistId
  let songId = req.params.songId
  models.SongList
    .findOne({
      where: { playlistId: playlistId, songId: songId },
    })
    .then((result) => {
      res.json(result);
    })
}

/**
  플레이리스트에 곡을 추가하는 api
*/
exports.add = (req, res) => {

  if (!appUser.isLogin(req, res)){ res.status(400).json({err: "Invalid Account"}) }

  console.log("add approach")

  let playlistId = req.params.playlistId;
  let songs = req.body.songs ? req.body.songs : []
  let userId = req.AppUser.userId;

  models.SongList
    .bulkCreate(songs.map(name => {
      return {
        playlistId: playlistId,
        songId: name
      }
    }))
  .then(result => {
    res.json(result)
  })
}

/**
  플레이리스트에 곡을 제거하는 api
*/
exports.delete = (req, res) => {

  if (!appUser.isLogin(req, res)){ res.status(400).json({err: "Invalid Account"}) }

  console.log("add approach")

  let playlistId = req.params.playlistId;
  let songs = req.body.songs ? req.body.songs : []
  let userId = req.AppUser.userId;

  models.SongList
    .destroy({
      where: { songId: songs}
    })
  .then(result => {
    res.json(result)
  })
}
