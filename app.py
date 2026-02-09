from flask import Flask, render_template,request,send_file
from rembg import remove
from PIL import Image
import os
import uuid


app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/remove-background", methods=["POST"])
def remove_background():
    if "image" not in request.files:
        return "not file", 400
    file = request.files["image"]
    if file.filename == "":
        return "File could not be selected", 400
    
    filename = f"{uuid.uuid4()}.png"
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    output_path = os.path.join(OUTPUT_FOLDER, filename)

    file.save(input_path)
    with Image.open(input_path) as img:
        output = remove(img)
        output.save(output_path)
        return send_file(output_path, mimetype="image/png", as_attachment=True, download_name=filename)

if __name__ == "__main__":
    app.run(debug=True)