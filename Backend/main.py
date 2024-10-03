from flask import Flask, jsonify, request, Response
from flask_mysqldb import MySQL
from flask_cors import CORS
import json
from ValidateClient import ValidateClient

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'python_flask'
mysql = MySQL(app)

@app.route('/customers', methods=['POST'])
def save_customer():    
    try:        
        #getting data
        name = request.json['name']
        last_name = request.json['last_name']
        email = request.json['email']
        cellphone = request.json['cellphone']

        #Validating
        client = ValidateClient(name, last_name, email, cellphone)
        if(client.get_errors() == []):
            #execuitng query
            cur = mysql.connection.cursor()
            query = 'INSERT INTO users (name, last_name, email, cellphone) VALUES (%s, %s, %s, %s)'
            values = (name, last_name, email, cellphone)
            cur.execute(query, values)
            mysql.connection.commit()
            cur.close()
            return make_response({'message': "Cliente guardado"}, 201)
        else:
            return make_response({'message': "Ha sucedido un error", 'errors': client.get_errors()}, 406)
    except Exception as e:
        return make_response({'message': f"Ha sucedido un error: {e}"}, 400)
    
@app.route('/customers/<int:user_id>', methods=['PUT'])
def edit_customer(user_id):
    try:        
        #getting data
        name = request.json['name']
        last_name = request.json['last_name']
        email = request.json['email']
        cellphone = request.json['cellphone']

        #Validating
        client = ValidateClient(name, last_name, email, cellphone)
        if(client.get_errors() == []):
            #execuitng query
            cur = mysql.connection.cursor()
            query = """
            UPDATE users 
            SET name = %s, last_name = %s,email = %s, cellphone = %s
            WHERE id = %s"""
            values = (name, last_name, email, cellphone, user_id)
            cur.execute(query, values)
            mysql.connection.commit()
            cur.close()
            return make_response({'message': "Cliente actualizado"}, 201)
        else:
            return make_response({'message': "Ha sucedido un error", 'errors': client.get_errors()}, 406)
    except Exception as e:
        return make_response({'message': f"Ha sucedido un error: {e}"}, 400)

@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    try:    
        #execuitng query
        cur = mysql.connection.cursor()
        query = f'DELETE FROM users WHERE id = {id}'
        cur.execute(query)
        mysql.connection.commit()
        cur.close()
        return make_response({'message': 'Se ha eliminado el cliente'}, 200)
    except Exception as e:
        return make_response({'message': f"Ha sucedido un error: {e}"}, 400)

@app.route('/customers/<int:id>')
def get_customer(id):
    result = []
    try:    
        #execuitng query
        cur = mysql.connection.cursor()
        query = f'SELECT * FROM users WHERE id = {id}'
        cur.execute(query)
        data = cur.fetchall()
        for row in data:
            content = {
                'id': row[0], 
                'name': row[1], 
                'last_name': row[2], 
                'email': row[3], 
                'cellphone': row[4], 
            }
            result.append(content)
        mysql.connection.commit()
        cur.close()
        return make_response({'message': 'El cliente ha sido encontrado', 'data': result}, 200)
    except Exception as e:
        return make_response({'message': f"Ha sucedido un error: {e}"}, 400)

@app.route('/customers')
def list_customers():
    result = []
    try:    
        #execuitng query
        cur = mysql.connection.cursor()
        query = 'SELECT * FROM users'
        cur.execute(query)
        data = cur.fetchall()
        for row in data:
            content = {
                'id': row[0], 
                'name': row[1], 
                'last_name': row[2], 
                'email': row[3], 
                'cellphone': row[4], 
            }
            result.append(content)
        mysql.connection.commit()
        cur.close()
        return make_response({'message': 'OK', 'data': result}, 200)
    except Exception as e:
        return make_response({'message': f"Ha sucedido un error: {e}"}, 400)

@app.route('/')
def index():
    return 'Hello World' 

def make_response(data, code):
    response = Response(json.dumps(data), status=code, mimetype='application/json')
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    return response

if __name__ == '__main__':
    app.run(None, 3000, True)