from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json
from PIL import Image

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model.keras"
CLASS_JSON = "class.json"

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_JSON, "r") as f:
    class_names = json.load(f)

if isinstance(class_names, dict):
    class_names = list(class_names.values())

IMAGE_SIZE = model.input_shape[1:3]

print("Model loaded")
print("Input size:", IMAGE_SIZE)
print("Classes:", class_names)

def predict_image(image):

    image = image.convert("RGB")
    image = image.resize(IMAGE_SIZE)

    img_array = tf.keras.preprocessing.image.img_to_array(image)

    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array, verbose=0)

    idx = int(np.argmax(preds[0]))
    confidence = float(preds[0][idx]) * 100

    THRESHOLD = 40.0

    all_scores = {
        class_names[i]: round(float(preds[0][i]) * 100, 2)
        for i in range(len(class_names))
    }

    if confidence < THRESHOLD:
        return {
            "class_name": "Disease Not Found",
            "confidence": round(confidence, 2),
            "scores": all_scores
        }

    return {
        "class_name": class_names[idx],
        "confidence": round(confidence, 2),
        "scores": all_scores
}

# Health Check
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "model_input_size": IMAGE_SIZE,
        "num_classes": len(class_names)
    })

# Predict Endpoint
@app.route("/predict", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "error": "No file uploaded"
        }), 400

    try:
        file = request.files["file"]

        image = Image.open(file.stream)

        result = predict_image(image)

        return jsonify({
            "success": True,
            **result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Run
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )