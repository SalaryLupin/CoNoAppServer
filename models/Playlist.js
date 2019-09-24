module.exports =(sequelize, DataTypes) => {
  var playlist = sequelize.define('Playlist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  });

  playlist.associate = function (models) {
    playlist.hasMany(models.SongList);
    playlist.hasMany(models.PlaylistShare);
  };

  return playlist;
};
