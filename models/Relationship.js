module.exports =(sequelize, DataTypes) => {
  var relationship = sequelize.define('Relationship', {
    relatingUserId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    relatedUserId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    timestamps: true,
  });

  relationship.associate = function (models) {
    relationship.belongsTo(models.User, {
      foreignKey: "relatingUserId",
      onDelete: "cascade"
    })
    relationship.belongsTo(models.User, {
      foreignKey: "relatedUserId",
      onDelete: "cascade"
    })
  };
  return relationship;
};
