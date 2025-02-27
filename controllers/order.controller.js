const db = require("../models");
const SaleOrder = db.saleorder;
const UserDue = db.userdue;
const ProductTemplate = db.productTemplete;
const Op = db.Sequelize.Op;


exports.getAllOrder = async (req, res) => {

    try {
        let data = await SaleOrder.findAll({
            limit: 14,
            include: [
                {
                    model: ProductTemplate,

                }
            ],
            order: [["createdAt", "DESC"]]
        })
        res.status(200).send({
            success: true,
            items: data
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

exports.getOrder = async (req, res) => {

    try {
        let data = await SaleOrder.findAll({
            limit: 10,
            where: {
                invoice_id: req.params.id
            },
            include: [
                {
                    model: ProductTemplate,
                }
            ]
        })
        res.status(200).send({
            success: true,
            items: data
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

function getFormattedDate() {
    const date = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('bn-BD', options);
}

exports.getTodatOrder = async (req, res) => {

    try {
        let data = await SaleOrder.findAll({
            where: {
                date: getFormattedDate()
            },
            include: [
                {
                    model: ProductTemplate,
                }
            ]
        })
        res.status(200).send({
            success: true,
            items: data
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function groupSalesByHour(items) {
    const groupedSales = {};

    items.forEach(item => {
        const date = new Date(item.createdAt);
        const hour = date.getHours();

        if (!groupedSales[hour]) {
            groupedSales[hour] = { h: hour, sales: 0 };
        }

        groupedSales[hour].sales += item.price * item.qty;
    });

    return Object.values(groupedSales).sort((a, b) => a.h - b.h);
}

exports.getDailySalse = async (req, res) => {

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let data = await SaleOrder.findAll({
            where: {
                createdAt: { [Op.gte]: today }
            },
            limit: 300,
            order: [["createdAt", "DESC"]]
        })
        const calcutatedData = await groupSalesByHour(data);

        res.status(200).send({
            success: true,
            items: calcutatedData
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const UpdateProduct = async (orders) => {
    const updateProducts = orders

    if (!Array.isArray(updateProducts) || updateProducts.length === 0) {
        return 0
    }

    try {
        const Products = [];

        for (const pro of updateProducts) {
            const product = await ProductTemplate.findOne({
                where: { id: pro?.product_id },
            });

            if (product) {
                await ProductTemplate.update(
                    {
                        qty: parseInt(product?.qty) - parseInt(pro?.qty),
                    },
                    {
                        where: {
                            id: product?.id,
                        },
                    }
                );

            } else {
                console.log(`Product with ID ${pro?.id} not found`);
            }
        }

        return Products
    } catch (error) {
        return error
    }
};


const UpdateDue = async (userId, userdue) => {
    const data = await UserDue.findOne({
        where: {
            userId: userId
        }
    });

    if(data){
        console.log("Update");
    }
}

exports.CreateOrder = async (req, res) => {
    try {
        const { orders, userId, due } = req.body;
        await SaleOrder.bulkCreate(orders);
        const data = await UpdateProduct(orders)
        const userDue = await UpdateDue(userId, due)
        res.status(200).send({
            success: true,
            message: "Order Create Successfull",
            data: data

        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

exports.getYearlyOrder = async (req, res) => {
    try {
        let data = await SaleOrder.findAll({})
        res.status(200).send({
            success: true,
            items: data
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const groupByDay = async (orders) => {
    return orders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];

        if (!acc[date]) {
            acc[date] = { totalSales: 0 };
        }

        acc[date].totalSales += order?.price * order?.qty || 0;

        return acc;
    }, {});
};

exports.getMonthlyOrder = async (req, res) => {
    try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        let data = await SaleOrder.findAll({
            where: {
                createdAt: { [Op.gte]: firstDayOfMonth }
            },
            limit: 500,
            order: [["createdAt", "DESC"]]
        });

        const groupedOrders = await groupByDay(data);


        const dataPoints = Object.entries(groupedOrders).map(([dateStr, data]) => ({
            x: new Date(dateStr),
            y: data.totalSales
        }));

        dataPoints.sort((a, b) => a.x - b.x);

        res.status(200).send({
            success: true,
            items: dataPoints
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};





