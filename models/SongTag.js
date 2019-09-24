const models = require("../models")

module.exports =(sequelize, DataTypes) => {
  var songTag = sequelize.define('SongTag', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: { model: models.User, key: 'userId' }
    },
    songId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    tagId: {
      type: DataTypes.STRING,
      allowNull: false
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
