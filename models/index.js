const config = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.productTemplete = require("../models/ProductModel")(sequelize, Sequelize);
db.saleorder = require("./saleorder.model")(sequelize, Sequelize);
db.company = require("./company.model")(sequelize, Sequelize);
db.message = require("./message.model")(sequelize, Sequelize);
db.state = require("./state.model")(sequelize, Sequelize);
db.category = require("./category")(sequelize, Sequelize);
db.userdue = require("./userDue")(sequelize, Sequelize);

// relation between tables

// Sale Order
db.productTemplete.hasMany(db.saleorder, {
  foreignKey: "product_id",
  onDelete: 'CASCADE',
})
db.saleorder.belongsTo(db.productTemplete, {
  foreignKey: "product_id",
  onDelete: 'CASCADE',
})

// State
db.user.hasMany(db.state, {
  foreignKey: "userId",
  onDelete: 'CASCADE',
})
db.state.belongsTo(db.user, {
  foreignKey: "userId",
  onDelete: 'CASCADE',
})
// SaleOrder
db.user.hasMany(db.saleorder, {
  foreignKey: "userId",
  onDelete: 'CASCADE',
})
db.saleorder.belongsTo(db.user, {
  foreignKey: "userId",
  onDelete: 'CASCADE',
})

// UserDue
db.user.hasMany(db.userdue, {
  foreignKey: "userId",
  onDelete: 'CASCADE',
})
db.userdue.belongsTo(db.user, {
  foreignKey: "userId",
  onDelete: 'CASCADE',
})

module.exports = db;