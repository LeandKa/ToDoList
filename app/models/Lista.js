const { Model, DataTypes } = require('sequelize');

class Lista extends Model {
    static init(sequelize){
        super.init({
            id:{
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            titulo:{
                type: DataTypes.STRING,
                allowNull: false
            },
            descricao:{
                type: DataTypes.STRING,
                allowNull: false
            },
            usuario_id: {
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
            tableName: 'lista'
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "usuario_id", as: "user"});
        this.hasMany(models.Item, { foreignKey: "lista_id", as: "itens_lista" });
    }

}

module.exports = Lista
