const { Model, DataTypes } = require('sequelize');


class Item extends Model {
    static init(sequelize){
        super.init({
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            descricao: {
                type: DataTypes.STRING,
                allowNull: false
            },

            lista_id: {
                type: DataTypes.STRING,
                allowNull: false
            },

            status: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            criado_por: {
                type: DataTypes.STRING,
                allowNull: false
            },
            atualizado_por: {
                type: DataTypes.STRING,
                allowNull: false
            },
            criado_em: {
                type: DataTypes.DATE,
                allowNull: true
            },
            atualizado_em: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },{
            sequelize,
            timestamps: false,
            tableName: 'item'
        })
    }

    static associate(models) {
        this.belongsTo(models.Lista, { foreignKey: "lista_id", as: "lista" })
    }

}


module.exports = Item