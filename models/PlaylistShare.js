module.exports =(sequelize, DataTypes) => {
  var playlistShare = sequelize.define('PlaylistShare', {
    playlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  },
  {
    timestamps: true,
  });

  playlistShare.associate = function (models) {
    playlistShare.belongsTo(models.Playlist, {
      foreignKey: "playlistId",
      onDelete: "cascade"
    })
    playlistShare.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "cascade"
    })
  };
  return playlistShare;
};
