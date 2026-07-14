# Potato Leaf Disease Classification using EfficientNetB0

This project demonstrates a deep learning approach to classify potato leaf diseases using image data. The goal is to build a robust model that can accurately identify different diseases, which can aid in early detection and treatment in agriculture.

## Dataset

The dataset used for this project is the **Potato Leaf Disease Dataset** from Kaggle ([https://www.kaggle.com/datasets/nirmalsankalana/potato-leaf-disease-dataset](https://www.kaggle.com/datasets/nirmalsankalana/potato-leaf-disease-dataset)). It contains images of potato leaves categorized into various disease classes, including 'Bacteria', 'Fungi', 'Healthy', 'Nematode', 'Pest', 'Phytopthora', and 'Virus'.

- **Total Images**: 3076
- **Classes**: 7
- **Image Size**: (224, 224) pixels

## Project Workflow

1. Download and prepare the dataset.
2. Split the data into training and validation sets (80/20).
3. Build TensorFlow data pipelines for loading and preprocessing.
4. Apply data augmentation to improve model performance.
5. Calculate class weights to handle class imbalance.
6. Train an EfficientNetB0 transfer learning model.
7. Evaluate the model using validation data.
8. Save the best-performing model.
9. Use the trained model for single image prediction.

## Model Architecture

The model utilizes `EfficientNetB0` as a pre-trained backbone. The pre-trained layers are frozen, and a custom classification head is added on top. The head consists of:

-   `GlobalAveragePooling2D`
-   `BatchNormalization`
-   `Dropout` (0.30)
-   `Dense` layer with 256 units and `relu` activation (with L2 regularization)
-   `Dropout` (0.30)
-   `Dense` output layer with `softmax` activation for 7 classes.

## Training Details

-   **Optimizer**: AdamW with learning rate 1e-3 and weight decay 1e-4
-   **Loss Function**: CategoricalCrossentropy with label smoothing (0.1)
-   **Metrics**: Accuracy, Precision, Recall
-   **Epochs**: Up to 30 (with Early Stopping)
-   **Batch Size**: 32
-   **Callbacks**:
    -   `EarlyStopping`: Monitors 'val_loss', patience=8, restores best weights.
    -   `ReduceLROnPlateau`: Monitors 'val_loss', factor=0.2, patience=3, min_lr=1e-7.
    -   `ModelCheckpoint`: Saves the best model based on 'val_loss'.

## Results

The model achieved the following performance on the validation set:

**Classification Report:**
```
              precision    recall  f1-score   support

    Bacteria       0.92      0.91      0.92       113
       Fungi       0.65      0.77      0.70       149
     Healthy       0.50      0.85      0.63        40
    Nematode       0.50      0.31      0.38        13
        Pest       0.57      0.60      0.58       122
 Phytopthora       0.74      0.70      0.72        69
       Virus       0.89      0.44      0.59       106

    accuracy                           0.69       612
   macro avg       0.68      0.65      0.65       612
weighted avg       0.72      0.69      0.69       612
```

The training history plots (Accuracy and Loss) are also generated to visualize the model's learning progress over epochs.

## How to Use (Inference)

To use the trained model for inference on a single image, you can load the saved model and preprocess your image accordingly:

```python
import tensorflow as tf
import numpy as np
import cv2
import os
import json

# Load class names
with open('class.json', 'r') as f:
    class_names = json.load(f)

# Load the trained model
model = tf.keras.models.load_model('trained_potato_disease_model_efficientnet.keras')

IMAGE_SIZE = (224, 224) # Ensure this matches training

def predict_image(image_path):
    img = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    inp = tf.keras.preprocessing.image.img_to_array(
          tf.keras.preprocessing.image.load_img(image_path, target_size=IMAGE_SIZE))
    inp = np.expand_dims(inp, axis=0) # Add batch dimension

    preds      = model.predict(inp)
    idx        = np.argmax(preds)
    confidence = preds[0][idx] * 100

    predicted_class = class_names[idx]
    print(f"Predicted class: {predicted_class} with confidence: {confidence:.2f}%")

    # Display image (optional)
    import matplotlib.pyplot as plt
    plt.imshow(img)
    plt.title(f'Prediction: {predicted_class}  ({confidence:.1f}%)')
    plt.axis('off'); plt.show()

# Example usage:
# Replace 'path/to/your/image.jpg' with the actual image path
# predict_image('path/to/your/image.jpg')
```

Feel free to explore the notebook for detailed steps and code implementation.