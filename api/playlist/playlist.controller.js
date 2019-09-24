const models = require("../../models")

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
