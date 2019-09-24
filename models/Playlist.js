module.exports =(sequelize, DataTypes) => {
  return sequelize.define('Playlist', {
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
};
