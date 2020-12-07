module.exports=(sequelize,Sequelize)=>{
    const todo=sequelize.define("todos",{
        todo_id:{
            type:Sequelize.NUMBER
            
        },
        name:{
            type:Sequelize.STRING
        }
    })
};