module.exports = {
    
    genCodigo(){
        var codigo = ''
        var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

        for (let index = 0; index < 6; index++) {
            codigo += abc.charAt(Math.floor(Math.random() * abc.length))
        }

        return codigo
    },

    validaEmail(email){
        var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
        if (!filter.test(email)) {
            return false;
        }else{
            return true
        }
    },

    validaPassword(senha){
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
        if(!regex.test(senha)){
            return false
        }else{
            return true
        }

    },


    validaCPF(cpf){
        cpf = cpf.toString()
        cpf = cpf.replace(/[^\d]/g, '')

        while(cpf.length < 11){
            cpf = "0" + cpf
        }
        
        var Soma
        var Resto

        Soma = 0

        if (cpf == "00000000000"){
            return false
        } 

        for (i=1; i<=9; i++){
             Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
        }

        Resto = (Soma * 10) % 11

        if ((Resto == 10) || (Resto == 11)){
            Resto = 0
        }

        if (Resto != parseInt(cpf.substring(9, 10)) ){
            return false
        }

        Soma = 0;

        for (i = 1; i <= 10; i++){
            Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
        }

        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)){
            Resto = 0
        }

        if (Resto != parseInt(cpf.substring(10, 11) ) ){
            return false
        }

        return { isValid:true, cpf:cpf};
    },


}