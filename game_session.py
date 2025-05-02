import ast
from llm_model import LLMModel
import subprocess
import json

class GameSession:
    def __init__(self, player1: LLMModel, player2: LLMModel, translator: LLMModel, game: str, excepted_format: str, game_rules: str, max_turns: int = 10):
        self.players = {
            "player1": player1,
            "player2": player2
        }
        self.messages = {
            "player1": [
                {
                    "role": "user",
                    "content": "You are the first player.",
                }],
            "player2": [
                {
                    "role": "user",
                    "content": "You are the second player.",
                }]
        }
        self.translator = translator
        self.game = game
        self.game_rules = game_rules
        self.excepted_format = excepted_format
        self.max_turns = max_turns
        self.board = self._initialize_board()
        self.history = []
        self.legal_moves = []
        self.current_player = "player1"
        self.last_player = "player2"
        self.current_raw_response = ""
        self.current_response = ""
        self.current_move = ""
        self.valid = 0
        self.status = None
        self.winner = None
        self.count_winning = 0
        self._build_prompt()

    def _initialize_board(self):
        process = subprocess.Popen(
            ['node', 'loadStates.js',  self.game],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        stdout, stderr = process.communicate()

        if stdout:
            try:
                output_data = json.loads(stdout.decode())
                return output_data.get('board')
            except json.JSONDecodeError:
                print("Error al decodificar la salida del script de Node.js.")
        if stderr:
            print("Errores:\n", stderr.decode())
        
        raise ValueError(f"Tipo de juego no soportado: {self.game}")

    def _switch_player(self):
        self.current_player = "player2" if self.current_player == "player1" else "player1"

    def get_legal_moves(self) -> list:
        return self.legal_moves

    def _validate_move(self, move) -> bool:
        return move in self.get_legal_moves()

    def _build_prompt(self) -> dict:
        for player in self.players:
            self.messages[player] = [{"role": "system", "content": self.game_rules,},{"role": "user","content": f"Initial conditions: {self.board}"}]
    
    def _update_messages(self, messages):
        try:
            self.messages[self.current_player] = messages
            return True
        except:
            return False
        
    def _update_messages_opponent(self, response):
        try: 
            self.messages[self.last_player].append({
                    "role": "user",
                    "content": response,
                }) 
            return True
        except:
            return False

    def execute_turn(self, move: str):
        process = subprocess.Popen(
            ['node', 'script.js', "x", json.dumps(move), self.game, json.dumps(self.board)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        stdout, stderr = process.communicate()

        if stdout:
            try:
                output_data = json.loads(stdout.decode())
                #print(output_data)
                #conn_mongodb(id_match, model, role, output_data, move, game, reason, execution_time)
                return output_data.get('board'), output_data.get('win'), output_data.get('legalMoves'), output_data.get('valid')
            except json.JSONDecodeError:
                print("Error al decodificar la salida del script de Node.js.")
        if stderr:
            print("Errores:\n", stderr.decode())

    def play_turn(self):
        player = self.players[self.current_player]
        messages = self.messages[self.current_player]

        #print(f"JUGADOR NUMERO {self.current_player} ****************************************************************")
        #print(messages)
        #print("*******************************************************************************")
        # Obtener respuesta del LLM
        raw_response, messages = player.call_model(messages)
        # Obtener solo el movimiento en el formato correcto
        response = self.translator.translate_response(raw_response, self.excepted_format)

        self.current_raw_response = raw_response
        self.current_response = response

        try:
            # Parsear y validar movimiento
            move = json.loads(response) if response.startswith("{") else ast.literal_eval(response)

            self.current_move = move

            self.board, win, self.legal_moves, valid = self.execute_turn(move["move"])

            if valid == 1:
                self.valid = 1

                self.history.append({
                    "player": self.current_player,
                    "move": move,
                    "board_state": self.board.copy(),
                    "response": raw_response
                })

                if win == 1 and self.status is None:
                    self.winner = self.current_player
                    self.count_winning += 1
                    if self.game == "tictactoe" or self.game == "tic-tac-toe":
                        self.status = {"player": self.current_player}
                    elif self.game == "suicide":
                        self.status = {"player": self.current_player}
                elif win == 1 and self.status is not None:
                    self.count_winning += 1
                
                self._update_messages_opponent(raw_response)
                # Cambia el jugador
                self.last_player = self.current_player
                self._update_messages(messages)
                self._switch_player()
            else:
                self.valid = 0
                self.last_player = self.current_player
                messages.append({
                    "role": "user",
                    "content": "Maybe you chose a position already occupied or you were not clear with your movement and reason.",
                })
                self._update_messages(messages)
            
        except (SyntaxError, ValueError) as e:
            print(f"Error procesando movimiento: {str(e)}")
            # Registrar intento fallido
            self.valid = 0
            self.last_player = self.current_player
            self.history.append({
                "player": self.current_player,
                "error": str(e),
                "invalid_response": raw_response
            })

    def play_human_turn(self, move):
        move = [str(elemento) for elemento in move]
        self.current_move = move
        self.board, win, self.legal_moves, valid = self.execute_turn(move)

        if valid == 1:
            self.valid = 1
            self.history.append({
                "player": "human",
                "move": {"move": move},
                "board_state": self.board.copy()
            })

            self._update_messages_opponent(f"I do this move to complete one step {move}")

            if win == 1 and self.status is None:
                self.winner = "human"
                self.count_winning += 1
                self.status = {"player": "human"}
            elif win == 1 and self.status is not None:
                self.count_winning += 1

            self.last_player = "human"
            if(self.players["player1"] == "human"):
                self.current_player = "player1"
            elif(self.players["player2"] == "human"):
                self.current_player = "player2"
            self._switch_player()
            return True
        else:
            self.valid = 0
            return False

    def play_llm_turn(self):
        player = self.players[self.current_player]
        messages = self.messages[self.current_player]

        print(player)

        raw_response, messages = player.call_model(messages)
        response = self.translator.translate_response(raw_response, self.excepted_format)

        self.current_raw_response = raw_response
        self.current_response = response

        try:
            move = json.loads(response) if response.startswith("{") else ast.literal_eval(response)
            self.current_move = move

            self.board, win, self.legal_moves, valid = self.execute_turn(move["move"])

            if valid == 1:
                self.valid = 1
                self.history.append({
                    "player": self.current_player,
                    "move": move,
                    "board_state": self.board.copy(),
                    "response": raw_response
                })

                if win == 1 and self.status is None:
                    self.winner = self.current_player
                    self.count_winning += 1
                    self.status = {"player": self.current_player}
                elif win == 1 and self.status is not None:
                    self.count_winning += 1

                self._update_messages_opponent(raw_response)
                self.last_player = self.current_player
                self._update_messages(messages)
            else:
                self.valid = 0
                self.last_player = self.current_player
                messages.append({
                    "role": "user",
                    "content": "Maybe you chose a position already occupied or you were not clear with your movement and reason.",
                })
                self._update_messages(messages)

        except (SyntaxError, ValueError) as e:
            self.valid = 0
            self.last_player = self.current_player
            self.history.append({
                "player": self.current_player,
                "error": str(e),
                "invalid_response": raw_response
            })

    def run_full_game(self):
        for turn in range(self.max_turns):
            if self.status != None and self.count_winning >= 2:
                break
            print(self.get_game_state())
            self.play_turn()
        
        return {
            "status": self.status,
            "winner": self.winner,
            "total_turns": len(self.history),
            "final_board": self.board,
            "history": self.history
        }
    
    def get_game_state(self):
        return {
            'board': self.board,
            'current_player': self.last_player,
            'legal_moves': self.get_legal_moves(),
            'status': self.status,
            'winner': self.winner,
            'raw_response': self.current_raw_response,
            'response': self.current_response,
            'move': self.current_move,
            'valid': self.valid
        }