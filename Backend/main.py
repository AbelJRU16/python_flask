from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS

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
    
        #execuitng query
        cur = mysql.connection.cursor()
        query = 'INSERT INTO users (name, last_name, email, cellphone) VALUES (%s, %s, %s, %s)'
        values = (name, last_name, email, cellphone)
        cur.execute(query, values)
        mysql.connection.commit()
        cur.close()
        return "Cliente guardado"
    except Exception as e:
        return "Ha sucedido un error: "+e
    
@app.route('/customers/<int:user_id>', methods=['PUT'])
def edit_customer(user_id):
    try:        
        #getting data
        name = request.json['name']
        last_name = request.json['last_name']
        email = request.json['email']
        cellphone = request.json['cellphone']
    
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
        return "Cliente actualizado"
    except Exception as e:
        return "Ha sucedido un error: "+e

@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    try:    
        #execuitng query
        cur = mysql.connection.cursor()
        query = f'DELETE FROM users WHERE id = {id}'
        cur.execute(query)
        mysql.connection.commit()
        cur.close()
        return 'Se ha eliminado el cliente'
    except Exception as e:
        return "Ha sucedido un error: "+e

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
        return jsonify(result)
    except Exception as e:
        return "Ha sucedido un error: "+e

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
        return jsonify(result)
    except Exception as e:
        return "Ha sucedido un error: "+e

@app.route('/')
def index():
    return 'Hello World'

if __name__ == '__main__':
    app.run(None, 3000, True)