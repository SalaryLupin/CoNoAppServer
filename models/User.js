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
    user.hasMany(models.SongTag, { foreignKey: "userId" });
    user.hasMany(models.Relationship, { foreignKey: "relatingUserId" });
    user.hasMany(models.Relationship, { foreignKey: "relatedUserId" });
    user.hasMany(models.PlaylistShare, { foreignKey: "userId" });
  };
  return user;
};
