module.exports =(sequelize, DataTypes) => {
  var playlistShare = sequelize.define('PlaylistShare', {
    playlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
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
