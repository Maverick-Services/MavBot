import logging
from flask import Flask, request, jsonify
import string
from utils import predict_intent, generate_response

# Initialize Flask app
app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle incoming messages and respond using the trained model."""
    try:
        # Get the incoming data
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        user_message = data['message'].strip().lower()

        # Clean up punctuation and preprocess the message
        user_message = user_message.translate(str.maketrans('', '', string.punctuation))

        # Get the predicted intent
        intent = predict_intent(user_message)
        bot_response = generate_response(intent)

        # Initialize options
        options = []

        # If the intent is related to services, we will add options to choose from
        if intent == 'services':  
            if "What services are you interested in?" in bot_response:
                options = [
                    "Digital Presence Management",
                    "IT Core Services"
                ]

        # Debugging logs
        app.logger.debug(f'User Message: {user_message}')
        app.logger.debug(f'Predicted Intent: {intent}')
        app.logger.debug(f'Bot Response: {bot_response}')
        app.logger.debug(f'Options: {options}')

        # Return the response and options as JSON
        return jsonify({
            'userMessage': user_message,
            'botResponse': bot_response,
            'options': options
        })

    except Exception as e:
        app.logger.error(f'Error: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
