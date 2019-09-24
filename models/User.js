module.exports =(sequelize, DataTypes) => {
  var user = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userPw: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: true,
  });

  user.associate = function (models) {
    user.hasMany(models.SongTag);
    user.hasMany(models.Relationship);
    user.hasMany(models.PlaylistShare);
  };
  return user;
};
