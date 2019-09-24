module.exports =(sequelize, DataTypes) => {
  var songList = sequelize.define('SongList', {
    playlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    songId: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  },
  {
    timestamps: true,
  });

  songList.associate = function (models) {
    songList.belongsTo(models.Playlist, {
      foreignKey: "playlistId",
      onDelete: "cascade"
    })
  };
  return songList;
};
