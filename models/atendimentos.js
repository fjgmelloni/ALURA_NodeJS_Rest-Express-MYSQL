const moment = require('moment')
const conexao =  require('../infraestrutura/conexao')

class Atendimento {

    adiciona(atendimento,res)
    {
        const dataCriacao =  moment().format("YYYY-MM-DD HH:mm:ss")
        const data = moment(atendimento.data, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss")
        
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 5
       
        const validacoes = [{nome: 'data',
                            valido : dataEhValida,
                            mensagem :'Data deve ser maior ou igual data atual'},
                            {
                                nome: 'cliente',
                                valido : clienteEhValido,
                                mensagem :'Cliente deve ter nome maior que cinco caracteres'},
                            ]
       const  erros = validacoes.filter(campo => !campo.valido)
       const existemErros = erros.length
        
       if(existemErros)
       {
           res.status(400).json(erros)
       }else
       {
        const atendimenoDatado = {...atendimento,dataCriacao,data}
        const sql = 'INSERT INTO Atendimentos SET ?'
        conexao.query(sql, atendimenoDatado, (erro,resultados)=>
        {
            if(erro)
            {
                res.status(400).json(erro)
            }
            else
            {
                res.status(201).json(atendimento)
            }

        })
       }


    }
    lista (res)
    {
       const sql = 'select * from Atendimentos' 
        conexao.query (sql,(erro,resultados)=>
        {
            if(erro)
            {

                res.status(400).json(erro)
            }
            else
            {
                res.status(200).json(resultados)
            }
        })

    }
    buscaPorId(id,res)
    {
        const sql = `select * from Atendimentos Where id = ${id}`
        conexao.query (sql,(erro,resultados)=>
        {
            const atendimento =  resultados[0]
            if(erro)
            {

                res.status(400).json(erro)
            }
            else
            {
                res.status(200).json(atendimento)
            }
        })
       
    }

    altera (id, valores, res)
    {
        if(valores.data){

            valores.data =  moment(valores.data, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss")
        }

        const sql = 'Update Atendimentos Set ? Where id = ? '
        conexao.query (sql,[valores,id],(erro,resultados)=>
        {
            
            if(erro)
            {

                res.status(400).json(erro)
            }
            else
            {
                res.status(200).json({...valores,id})
            }
        })
    }


    deleta (id,res)
    {
        const sql =  'delete from Atendimentos Where id = ?'
        conexao.query (sql ,id,(erro,resultados)=>
        {
            
            if(erro)
            {

                res.status(400).json(erro)
            }
            else
            {
                res.status(200).json({id})
            }
        })
    }
}
module.exports = new Atendimento