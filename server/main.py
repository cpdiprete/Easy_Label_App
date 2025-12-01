# from flask import Flask, request, jsonify


# app = Flask(__name__)

# @app.route("/")
# def hello_world():
#     tag = "<p>Hello, World!</p>\n"
#     tag += "<p>Hello, World!</p>\n"
#     return tag
# @app.route("/upload_project", methods=['POST'])
# def upload_project():
#     data = request.get_json()
#     print("🔥 Received JSON from mobile app:")
#     print(data)  # full dictionary
    


# # if __name__ == "__main__":
# from flask import Flask, request, jsonify

# display_data = {"status": "Flask server is running!", "ok": True}

# app = Flask(__name__)
# @app.get("/")
# def home():
#     # return {"status": "Flask server is running!", "ok": True}
#     return display_data

# # Receive data from your React Native app
# @app.route("/upload_project", methods=["POST"])
# def upload_project():
#     print("UPLOAD PROJECT CALLED!")
#     data = request.get_json()

#     print("🔥 Received JSON from mobile app:")
#     print(data)  # full dictionary
#     display_data = jsonify({"message": "Data received!", "received_keys": list(data.keys())})

#     return jsonify({"message": "Data received!", "received_keys": list(data.keys())})

# # View the latest posted data (optional)
# latest_data = {}

# @app.route("/upload", methods=["POST"])
# def upload():
#     global latest_data
#     latest_data = request.get_json()
#     return jsonify({"status": "ok"})

# @app.route("/view")
# def view():
#     return jsonify(latest_data)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=True)

from flask import Flask, request, jsonify

display_data = {"status": "Flask server is running!", "ok": True}

app = Flask(__name__)

@app.get("/")
def home():
    return jsonify(display_data)

@app.route("/upload_project", methods=["POST"])
def upload_project():
    global display_data   # <-- IMPORTANT

    print("UPLOAD PROJECT CALLED!")
    data = request.get_json()

    print("🔥 Received JSON from mobile app:")
    print(data)

    # Update global state
    display_data = {
        "message": "Data received!",
        "received_keys": list(data.keys()),
        "other details = " :list(data),
        "raw_data": data
    }

    return jsonify({"status": "ok"})
