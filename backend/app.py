from flask import Flask, request, jsonify
import joblib
import re
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
import pandas as pd
from flask_cors import CORS
from nltk.tokenize import WhitespaceTokenizer

# Inisialisasi Flask
app = Flask(__name__)
CORS(app)

# === Load Model dan Vectorizer ===
model = joblib.load('model/rf_model.pkl')
vectorizer = joblib.load('model/vectorizer.pkl')

# Load normalisasi kamus dan inisialisasi NLP
kamus_df = pd.read_csv('data/kamus_baku.csv')
normalisasi_kamus = dict(zip(kamus_df['singkatan'], kamus_df['baku']))

stop_factory = StopWordRemoverFactory()
stop_words = set(stop_factory.get_stop_words())

stem_factory = StemmerFactory()
stemmer = stem_factory.create_stemmer()

# Inisialisasi tokenizer
tokenizer = WhitespaceTokenizer()

def clean_text(text):
    text = text.lower()                                 # Case folding
    text = re.sub(r'http\S+', ' ', text)                # Hapus URL
    text = re.sub(r'[^a-z\s]', ' ', text)               # Hapus angka & simbol
    text = re.sub(r'\s+', ' ', text)                    # Hapus spasi berlebih
    return text.strip()

def normalisasi_kata(tokens):
    return [normalisasi_kamus.get(t, t) for t in tokens]

def preprocess(text):
    text = clean_text(text)                             # Step 2 & 3
    tokens = tokenizer.tokenize(text)                   # Step 4: Tokenisasi
    tokens = [t for t in tokens if t not in stop_words] # Step 5: Stopword removal
    tokens = normalisasi_kata(tokens)                   # Step 6: Normalisasi
    tokens = [stemmer.stem(t) for t in tokens]          # Step 7: Stemming
    return ' '.join(tokens)

# === Route Predict ===
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    review = data.get('review', '')

    if not review:
        return jsonify({'error': 'Review tidak ditemukan'}), 400

    preprocessed_text = preprocess(review)
    transformed = vectorizer.transform([preprocessed_text])
    prediction = model.predict(transformed)[0]

    return jsonify({'sentimen': prediction})

# === Run Server ===
if __name__ == '__main__':
    app.run(debug=True)
