import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# Load the hidden env variables from .env file
load_dotenv()

# initialize thw flask application
app = Flask(__name__)

# Enable CORS to allow Next js talk to the server
CORS(app, origins=["http://localhost:3000"])

# Lets connect to supabase using the Service role key
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SERVICE_ROLE_KEY")

# check if both the url and j=key exist is not return an error message
if not url or not key:
    raise ValueError("Missing Supabase Credentials")

# Initialize the supabase client (create client using the url and key )
supabase: Client = create_client (url , key)

# Create a post request to submit new ideas
@app.route('/api/ideas', methods=['POST'])
def submit_idea():
    # parse the incoming data in JSON from next js
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    
    # VALIDATION
    # 1. Idea(text) cannot be enpty
    if not text: 
        return jsonify({"error": "Idea text cannot be empty. "}), 400
    
    # 2. Idea cannot exceed 200 characters
    if len(text) > 200:
        return jsonify({"error": "Idea text cannot exceed 200 characters . "}), 400
    
    # DATABAE EXECUTION
    # Use service role key to bypass RLS and insert data
    # we explicitly set upvotes to 0 for new ideas
    try:
        response = supabase.table("ideas").insert({
                "text": text,
                "upvotes": 0
                
            }).execute()
            
            # return a 201 created status and the new database row back to the client 
        return jsonify ({
                "message":"Idea successfully submitted",
                "data": response.data[0]
            }), 201
    except Exception as e:
        # catch any unexpected error
        return jsonify({"error": "Database error", "details":str(e)}), 500
    
if __name__ == '__main__':
    # start flask server
    app.run(port=5000, debug=True)
