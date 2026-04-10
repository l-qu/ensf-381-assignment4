import re
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import bcrypt
from datetime import datetime
import json
import random

users = [
    {
        "id": 1,
        "username": "sweet_alice",
        "email": "alice@example.com",
        "password_hash": b"$2b$12$IaWhApQhKwWgMfJX5rkiKONV0rCRiDwq/JgZ9SIJNBw8rEQvJdHAO",
        "cart": [
            {
            "flavorId": 2,
            "name": "Chocolate Bliss",
            "price": 5.49,
            "quantity": 2
            }
        ],
        "orders": [
            {
            "orderId": 1,
            "items": [
            {
            "flavorId": 1,
            "name": "Vanilla Dream",
            "price": 4.99,
            "quantity": 1
            }
            ],
            "total": 4.99,
            "timestamp": "2026-03-30 18:30:00"
            }
        ]
    }
]

app = Flask(__name__)
CORS(app)

def is_valid_username(username):
    return re.match(r'^[A-Za-z][A-Za-z0-9_-]{2,19}$', username)

def is_valid_email(email):
    return re.match(r'^[^@]+@[^@]+\.[^@]+$', email)

def is_valid_password(password):
    return (
        len(password) >= 8 and
        re.search(r'[A-Z]', password) and
        re.search(r'[a-z]', password) and
        re.search(r'[0-9]', password) and
        re.search(r'[!@#$%^&*(),.?":{}|<>]', password)
    )

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    if not is_valid_username(username):
        return jsonify({
            "success": False,
            "message": "Username must be between 3 and 20 characters, start with a letter and must contain letters, numbers, underscores, and hyphens only."
        }), 400
    if not is_valid_email(email):
        return jsonify({
            "success": False,
            "message": "Invalid email format."
        }), 400
    if not is_valid_password(password):
        return jsonify({
            "success": False,
            "message": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        }), 400
    for user in users:
        if user["username"] == username:
            return jsonify({
                "success": False,
                "message": "Username is already taken."
            }), 400
        if user["email"] == email:
            return jsonify({
                "success": False,
                "message": "Email is already registered."
            }), 400
    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    new_user = {
        "id": len(users) + 1,
        "username": username,
        "email": email,
        "password_hash": hashed_pw,
        "cart": [],
        "orders": []
    }
    users.append(new_user)
    return jsonify({
        "success": True,
        "message": "Registration successful."
    }), 201

def check_user_exists(username):
    for user in users:
        if(user["username"]) == username:
            return user
    return None

def check_password_match(password, password_hash):
    return bcrypt.checkpw(password.encode(), password_hash)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username", "").strip()
    password = data.get("password", "")
    user = check_user_exists(username)
    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401
    if not check_password_match(password, user["password_hash"]):
        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "userId": user["id"],
        "username": username
    }), 200

with open("reviews.json") as f:
    reviews = json.load(f)

@app.route("/reviews", methods=["GET"])
def get_reviews():
    random_reviews = random.sample(reviews, 2)
    return jsonify({
        "success": True,
        "message": "Reviews loaded.",
        "reviews": random_reviews
    })

with open("flavors.json") as f:
    flavors = json.load(f)

@app.route("/flavors", methods=["GET"])
def get_flavors():
    return jsonify({
        "success": True,
        "message": "Flavors loaded.",
        "flavors": flavors
    })
