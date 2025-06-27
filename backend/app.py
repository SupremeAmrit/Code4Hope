from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
from utils import get_upcycling_suggestion

app = Flask(__name__)
model = YOLO("model/yolov8n.pt")  

@app.route('/detect', methods=['POST'])
def detect_plastic():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    image = Image.open(file.stream)

    results = model(image)

    detections = []
    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = model.names[cls]

            recommendation = get_upcycling_suggestion(label)

            detections.append({
                'label': label,
                'confidence': f"{conf * 100:.1f}%",
                'recommendation': recommendation
            })

    return jsonify({'results': detections})

if __name__ == '__main__':
    app.run(debug=True)
