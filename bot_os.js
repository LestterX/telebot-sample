const mysql = require('mysql2');
const TeleBot = require('telebot');

const TOKEN = ''; //Vai no telegram e procura por @BotFather, clica em menu, NewBot e configura, depois só pedir o token
const DATABASE_CONFIG = {
    host: 'localhost', //NOME DA HOSPEDÁGEM, geralmente eles fornecem na configuração
    user: 'root', //USUÁRIO, se não tiver coloca root e deixa a senha em branco para testar
    password: '', //SENHA SE TIVER
    database: 'mapostest' //NOME DO BANCO DE DADOS
};

const bot = new TeleBot(TOKEN);


// O CÓDIGO DE TESTE ABAIXO INFORMA SE CONSEGUIU SE CONECTAR AO BANCO DE DADOS
// -------------------- APENAS PARA TESTE (PODE APAGAR) --------------------
const connection = mysql.createConnection(DATABASE_CONFIG);
connection.connect((err) => {
    if (err) return console.log('Error: ' + err);
    console.log('Conectado ao DB');
    const os = connection.execute('SELECT * FROM os WHERE idOs=1', (err, res) => {
        if(err) return console.log(err);
        console.log(res);
    })
    console.log(os);
    return connection.end();
})
// -------------------- APENAS PARA TESTE (PODE APAGAR) --------------------


bot.on('/os', (message) => {
    const os_id = message.text.split('/os ')[1];
    if (!os_id || !Number.isInteger(Number(os_id))) {
        bot.sendMessage(message.chat.id, 'Por favor, forneça um ID de OS válido.');
        return;
    }
    const connection = mysql.createConnection(DATABASE_CONFIG);
    connection.connect((err) => {
        if (err) {
            console.log(err);
            bot.sendMessage(message.chat.id, 'Ocorreu um erro ao se conectar ao banco de dados.');
            return;
        }
        const query = "SELECT status, datafinal, defeito, valortotal, valor_desconto FROM os WHERE idOS = ?";
        connection.query(query, [os_id], (err, results) => {
            if (err) {
                console.log(err);
                bot.sendMessage(message.chat.id, 'Ocorreu um erro ao acessar o banco de dados.');
                return;
            }
            if (results.length > 0) {
                const os_data = results[0];
                const { status, datafinal, defeito, valortotal, valor_desconto } = os_data;
                const os_info = `Status: ${status}\nData Final: ${datafinal}\nDefeito: ${defeito}\nValor Total: ${valortotal}\nValor com Desconto: ${valor_desconto}`;
                bot.sendMessage(message.chat.id, os_info);
            } else {
                bot.sendMessage(message.chat.id, `OS com ID ${os_id} não encontrada.`);
            }
        });
    });
});

bot.start();