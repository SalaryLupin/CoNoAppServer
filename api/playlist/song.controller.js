const models = require("../../models")
const moment = require('moment');

// show all song
exports.list = (req, res) => {

  let playlistId = req.params.playlistId;
  let userId = req.AppUser.userId

  let sql =
    "select sl.songId, ps.userId, st.tags "+
    "from (playlistshares ps join songlists sl on ps.playlistId = sl.playlistId) join songtags as st on st.userId = ps.userId and st.songId = sl.songId " +
    "where ps.playlistId = " + playlistId;

  models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT})
  .then(users => {
    res.json(users)
  })
  .catch(err => {
    req.Error.internal(res)
  })
}

/**
  플레이리스트의 곡 정보를 보여주는 api
*/
exports.show = (req, res) => {
  console.log("show approach")
  let playlistId = req.params.playlistId
  let songId = req.params.songId

  let sql =
    "select ps.userId, st.tags "+
    "from (playlistshares ps join songlists sl on ps.playlistId = sl.playlistId) join songtags as st on st.userId = ps.userId and st.songId = sl.songId " +
    "where ps.playlistId = " + playlistId + " and sl.songId = \"" + songId + "\"";

  models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT})
  .then(users => {
    res.json(users)
  })
  .catch(err => {
    req.Error.internal(res)
  })

}

/**
  플레이리스트에 곡을 추가하는 api
*/
exports.add = (req, res) => {

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
  .catch(err => {
    req.Error.internal(res)
  })
}

/**
  플레이리스트에 곡을 제거하는 api
*/
exports.delete = (req, res) => {
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
  .catch(err => {
    req.Error.internal(res)
  })
}
