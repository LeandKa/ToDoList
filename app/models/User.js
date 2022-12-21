const { Model, DataTypes } = require('sequelize')


class User extends Model {
    static init(sequelize){
        super.init({
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            nome: {
                type: DataTypes.STRING,
                allowNull:false
            },
            sobrenome: {
                type: DataTypes.STRING,
                allowNull:false
            },
            data_nascimento: {
                type: DataTypes.DATE,
                allowNull:false
            },
            cpf: {
                type: DataTypes.STRING,
                allowNull:false
            },
            email: {
                type: DataTypes.STRING,
                allowNull:false,
                unique:true
            },
            senha: {
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
        }, {
            sequelize,
            timestamps: false,
            tableName: 'user'
        })
    }

    static associate(models){
        this.hasMany(models.Lista, { foreignKey: "usuario_id", as: "listas" });
    }
}

module.exports = User