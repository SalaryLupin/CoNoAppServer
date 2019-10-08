const models = require("../models")

module.exports =(sequelize, DataTypes) => {
  var songTag = sequelize.define('SongTag', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    songId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
  });

  songTag.associate = function(models){
    songTag.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "cascade"
    })
  };

  return songTag;
};
