module.exports =(sequelize, DataTypes) => {
  var user = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        is: /^[0-9]{11}$/
      }
    },
    userPw: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING
    },
    authToken: {
      type: DataTypes.STRING
    },
    isAuthorized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

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
