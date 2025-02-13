module.exports = (sequelize, Sequelize) => {
    const ProductTemplate = sequelize.define("product", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        active: {
            type: Sequelize.BOOLEAN,
        },
        sequence: {
            type: Sequelize.INTEGER,
        },
        category: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        image_url: {
            type: Sequelize.STRING
        },
        cost: {
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.INTEGER
        },
        standard_price: {
            type: Sequelize.INTEGER
        },
        qty: {
            type: Sequelize.INTEGER
        },
        product_type: {
            type: Sequelize.BOOLEAN,
        },
        
    });

    return ProductTemplate;
};

