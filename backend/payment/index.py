import json
import os
import uuid
from datetime import datetime
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create and manage Steam payment transactions
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with payment details
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            steam_id = body_data.get('steam_id', '').strip()
            amount = body_data.get('amount', 0)
            payment_method = body_data.get('payment_method', 'card')
            
            if not steam_id or amount <= 0:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Invalid steam_id or amount'}),
                    'isBase64Encoded': False
                }
            
            transaction_id = str(uuid.uuid4())
            
            cursor.execute(
                "INSERT INTO payments (steam_id, amount, payment_method, status, transaction_id) "
                "VALUES (%s, %s, %s, %s, %s) RETURNING id, steam_id, amount, payment_method, status, transaction_id, created_at",
                (steam_id, amount, payment_method, 'pending', transaction_id)
            )
            payment = cursor.fetchone()
            conn.commit()
            
            result = {
                'id': payment['id'],
                'steam_id': payment['steam_id'],
                'amount': payment['amount'],
                'payment_method': payment['payment_method'],
                'status': payment['status'],
                'transaction_id': payment['transaction_id'],
                'created_at': payment['created_at'].isoformat(),
                'payment_url': f'https://payment.example.com/pay?tx={transaction_id}'
            }
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            transaction_id = params.get('transaction_id')
            
            if transaction_id:
                cursor.execute(
                    "SELECT id, steam_id, amount, payment_method, status, transaction_id, created_at "
                    "FROM payments WHERE transaction_id = %s",
                    (transaction_id,)
                )
                payment = cursor.fetchone()
                
                if not payment:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Payment not found'}),
                        'isBase64Encoded': False
                    }
                
                result = {
                    'id': payment['id'],
                    'steam_id': payment['steam_id'],
                    'amount': payment['amount'],
                    'payment_method': payment['payment_method'],
                    'status': payment['status'],
                    'transaction_id': payment['transaction_id'],
                    'created_at': payment['created_at'].isoformat()
                }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
            else:
                cursor.execute(
                    "SELECT id, steam_id, amount, payment_method, status, transaction_id, created_at "
                    "FROM payments ORDER BY created_at DESC LIMIT 50"
                )
                payments = cursor.fetchall()
                
                result = [{
                    'id': p['id'],
                    'steam_id': p['steam_id'],
                    'amount': p['amount'],
                    'payment_method': p['payment_method'],
                    'status': p['status'],
                    'transaction_id': p['transaction_id'],
                    'created_at': p['created_at'].isoformat()
                } for p in payments]
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'payments': result}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
