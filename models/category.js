module.exports = (sequelize, Sequelize) => {
    const ProductCategory = sequelize.define("product_category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        active: {
            type: Sequelize.BOOLEAN,
        },
        name: {
            type: Sequelize.STRING
        },
        image_url: {
            type: Sequelize.STRING
        }
    });

    return ProductCategory;
};
