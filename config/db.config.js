const config = {
    HOST: "sql.freedb.tech",
    USER: "freedb_erpusers",
    PASSWORD: "tn!s@Z5j!wCJdzC",
    DB: "freedb_Mehedi_erp",
    dialect: "mysql",
    pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

module.exports = config;