import mysql.connector
import telebot

# Configurações do bot
TOKEN = '6279111686:AAHNRqLvO310tiT3grOx-UvFo5KauGpu-Qc'
DATABASE_CONFIG = {
    'host': 'localhost',
    'user': '',
    'password': '',
    'database': 'mapostest'
}

# Inicializa o bot
bot = telebot.TeleBot(TOKEN)


@bot.message_handler(commands=['os'])
def os(message):
    os_id = message.text.split('/os ')[-1]

    if not os_id.isdigit():
        bot.send_message(message.chat.id, 'Por favor, forneça um ID de OS válido.')
        return

    try:
        connection = mysql.connector.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()

        query = "SELECT status, datafinal, defeito, valortotal, valor_desconto FROM os WHERE idOS = %s"
        cursor.execute(query, (os_id,))
        os_data = cursor.fetchone()

        if os_data:
            status, datafinal, defeito, valortotal, valor_desconto = os_data
            os_info = (
                f"Status: {status}\n"
                f"Data Final: {datafinal}\n"
                f"Defeito: {defeito}\n"
                f"Valor Total: {valortotal}\n"
                f"Valor com Desconto: {valor_desconto}"

            )
            bot.send_message(message.chat.id, os_info)
        else:
            bot.send_message(message.chat.id, f"OS com ID {os_id} não encontrada.")

    except Exception as e:
        bot.send_message(message.chat.id, 'Ocorreu um erro ao acessar o banco de dados.')

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@bot.message_handler(func=lambda message: True)
def unknown(message):
    bot.send_message(message.chat.id, "Desculpe, não entendi o que você quis dizer.")

if __name__ == '__main__':
    bot.polling()