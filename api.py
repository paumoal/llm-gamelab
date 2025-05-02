from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import threading
import time
import json
from game_session import GameSession
from llm_model import LLMModel
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timezone
import time

load_dotenv()
API_KEY_OPENROUTER = os.getenv('OPENAI_API_KEY')
API_KEY_OPENAI = os.getenv('API_KEY_OPENAI')
IP_MONGO = os.getenv('IP_MONGO')
USER_MONGO = os.getenv('USER_MONGO')
PASS_MONGO = os.getenv('PASS_MONGO')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'LLMG4m3$L9b.'
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=60, ping_interval=25)

user_rooms = {}

def run_game_session(game, game_rules, mark, model1_name, model2_name, room, optional_api_key):
    api_key = API_KEY_OPENROUTER
    if optional_api_key != "":
        api_key = optional_api_key

    model1 = LLMModel(model1_name, "openrouter", api_key)
    model2 = LLMModel(model2_name, "openrouter", api_key)
    translator = LLMModel("gpt-4o", "openai", API_KEY_OPENAI)
    game_session = GameSession(model1, model2, translator, game, mark, game_rules)
    
    for i in range(game_session.max_turns):
        try:
            if game_session.status is not None and game_session.count_winning >= 1:
                break
            
            start_time = time.perf_counter()
            game_session.play_turn()
            state = game_session.get_game_state()
            end_time = time.perf_counter()

            execution_time = end_time - start_time

            conn_mongodb(room, game_session.players[state['current_player']].get_model(), state['legal_moves'], state['board'], state['valid'], state['winner'], state['move'], game, state['raw_response'], execution_time)
            socketio.emit('game_update', {
                'board': state['board'],
                'current_player': state['current_player'],
                'legal_moves': state['legal_moves'],
                'status': state['status'],
                'winner': state['winner'],
                'raw_response': state['raw_response'],
                'response': state['response'],
                'move': state['move'],
                'valid': state['valid']
            }, room=room)
            socketio.sleep(1)
        except TypeError:
            socketio.emit('game_crashed', {
                'msg': 'API over the limit.'
            }, room=room)
            socketio.sleep(1)
            print("API_key agotada")
            break

    socketio.emit('game_finished', {
        'final_board': state['board'],
        'winner': state['winner'],
        'legal_moves': state['legal_moves'],
    }, room=room)

def run_game_session_human(game, game_rules, mark, model_id, room, order, optional_api_key):
    api_key = API_KEY_OPENROUTER
    if optional_api_key != "":
        api_key = optional_api_key

    llm = LLMModel(model_id, "openrouter", api_key)
    translator = LLMModel("gpt-4o", "openai", API_KEY_OPENAI)

    if(order == 1):
        game_session = GameSession("human", llm, translator, game, mark, game_rules)

        socketio.emit('game_ready', {
            'board': game_session.get_game_state()['board'],
            'current_player': game_session.current_player
        }, room=room)
        
        # Guardamos la sesión en memoria para este room
        user_rooms[room] = {
            'session': game_session
        }
    elif(order == 2):
        game_session = GameSession(llm, "human", translator, game, mark, game_rules)
        socketio.emit('game_ready', {
            'board': game_session.get_game_state()['board'],
            'current_player': game_session.current_player
        }, room=room)
        
        # Guardamos la sesión en memoria para este room
        user_rooms[room] = {
            'session': game_session
        }

        print(game_session.players)

        for i in range(game_session.max_turns):
            try:
                start_time = time.perf_counter()
                game_session.play_llm_turn()
                state = game_session.get_game_state()
                end_time = time.perf_counter()

                execution_time = end_time - start_time

                conn_mongodb(room, game_session.players[state['current_player']].get_model(), state['legal_moves'], state['board'], state['valid'], state['winner'], state['move'], game, state['raw_response'], execution_time)
                socketio.emit('game_update_human_llm', {
                    'board': state['board'],
                    'current_player': state['current_player'],
                    'legal_moves': state['legal_moves'],
                    'status': state['status'],
                    'winner': state['winner'],
                    'move': state['move'],
                    'valid': state['valid'],
                    'raw_response': state['raw_response'],
                    'response': state['response']
                }, room=room)
                socketio.sleep(1)

                if game_session.status or game_session.count_winning >= 1:
                    socketio.emit('game_finished', {
                        'final_board': state['board'],
                        'winner': state['winner'],
                        'legal_moves': state['legal_moves'],
                    }, room=room)
                
                if(state['valid'] == 1):
                    break
            except TypeError:
                socketio.emit('game_crashed', {
                    'msg': 'API over the limit.'
                }, room=room)
                socketio.sleep(1)
                print("API_key agotada")
                break

def conn_mongodb(id_match, model, legal_moves, board, valid, win, move, game, reason, execution_time):
    client = MongoClient(f'mongodb://{USER_MONGO}:{PASS_MONGO}@{IP_MONGO}:27017/')
    db = client['db_app_web']
    collection = db['matches']

    game_data = {
        'id_match': id_match,
        'legalMoves': legal_moves,
        'board': board,
        'move': move,
        'valid': valid,
        'win': win,
        'model': model,
        'game': game,
        'reason': reason,
        'execution_time': execution_time,
        "timestamp": datetime.now(timezone.utc)
    }

    result = collection.insert_one(game_data)

    print(f'Datos insertados con ID: {result.inserted_id}')

# Evento para unirse a una sala
@socketio.on('join_game')
def handle_join(data):
    user_id = request.sid
    room = data.get('room')
    join_room(room)
    user_rooms[user_id] = room
    emit('joined', {'room': room})

@socketio.on("disconnect")
def handle_disconnect():
    user_id = request.sid
    if user_id in user_rooms:
        room_id = user_rooms.pop(user_id, None)
        print(f"⚠️ Usuario {user_id} salió de la room {room_id}")

@socketio.on('start_game')
def handle_start_game(data):
    room = data.get('room')
    game = data.get('game')
    game_rules = data.get('game_rules')
    mark = data.get('mark')
    model1_name = data.get('model1')
    model2_name = data.get('model2')
    optional_api_key = data.get('optional_api_key')
    
    # Inicia el juego en un hilo separado para no bloquear el servidor
    thread = threading.Thread(target=run_game_session, args=(game, game_rules, mark, model1_name, model2_name, room, optional_api_key))
    thread.start()

@socketio.on('start_game_human')
def handle_start_game(data):
    room = data.get('room')
    game = data.get('game')
    game_rules = data.get('game_rules')
    mark = data.get('mark')
    model_name = data.get('model')
    order = data.get('order')
    optional_api_key = data.get('optional_api_key')

    #print(model_name)
    
    # Inicia el juego en un hilo separado para no bloquear el servidor
    thread = threading.Thread(target=run_game_session_human, args=(game, game_rules, mark, model_name, room, order, optional_api_key))
    thread.start()

@socketio.on('human_move')
def handle_human_move(data):
    room = data.get('room')
    move = data.get('move')

    session_data = user_rooms.get(room)
    if not session_data:
        return

    game_session = session_data['session']

    valid = game_session.play_human_turn(move)

    state = game_session.get_game_state()

    conn_mongodb(room, "human", state['legal_moves'], state['board'], state['valid'], state['winner'], state['move'], game_session.game, "human", "0")
    socketio.emit('game_update_human_llm', {
        'board': state['board'],
        'current_player': state['current_player'],
        'legal_moves': state['legal_moves'],
        'status': state['status'],
        'winner': state['winner'],
        'move': state['move'],
        'valid': valid,
    }, room=room)
    socketio.sleep(1)

    if game_session.status or game_session.count_winning >= 1:
        socketio.emit('game_finished', {
            'final_board': state['board'],
            'legal_moves': state['legal_moves'],
            'winner': state['winner']
        }, room=room)
        socketio.sleep(1)
        return

    for i in range(game_session.max_turns):
        try:
            start_time = time.perf_counter()
            game_session.play_llm_turn()
            state = game_session.get_game_state()
            end_time = time.perf_counter()

            execution_time = end_time - start_time

            conn_mongodb(room, game_session.players[state['current_player']].get_model(), state['legal_moves'], state['board'], state['valid'], state['winner'], state['move'], game_session.game, state['raw_response'], execution_time)
            socketio.emit('game_update_human_llm', {
                'board': state['board'],
                'current_player': state['current_player'],
                'legal_moves': state['legal_moves'],
                'status': state['status'],
                'winner': state['winner'],
                'move': state['move'],
                'valid': state['valid'],
                'raw_response': state['raw_response'],
                'response': state['response']
            }, room=room)
            socketio.sleep(1)

            if game_session.status or game_session.count_winning >= 1:
                socketio.emit('game_finished', {
                    'final_board': state['board'],
                    'winner': state['winner'],
                    'legal_moves': state['legal_moves'],
                }, room=room)
            
            if(state['valid'] == 1):
                break
        except TypeError:
            socketio.emit('game_crashed', {
                'msg': 'API over the limit.'
            }, room=room)
            socketio.sleep(1)
            print("API_key agotada")
            break

if __name__ == '__main__':
    socketio.run(app, port=5000, debug=True)
