const models = require("../../models")

// show all playlists
exports.index = (req, res) => {
  console.log("index approach")
  models.Playlist
    .findAll()
    .then(function(result) {
      res.json(result)
    })
}
