import pandas as pd
import joblib
import re
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

# --- Load Resources ---
model = joblib.load('backend/model/rf_model.pkl')
vectorizer = joblib.load('backend/model/vectorizer.pkl')

kamus_df = pd.read_csv('backend/data/kamus_baku.csv')
normalisasi_kamus = dict(zip(kamus_df['singkatan'], kamus_df['baku']))

stop_factory = StopWordRemoverFactory()
stop_words = set(stop_factory.get_stop_words())

stem_factory = StemmerFactory()
stemmer = stem_factory.create_stemmer()

def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+', ' ', text)
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def normalisasi_kata(tokens):
    return [normalisasi_kamus.get(t, t) for t in tokens]

def preprocess(text):
    print(f"Original: {text}")
    text = clean_text(text)
    print(f"Cleaned: {text}")
    tokens = text.split()
    
    # Check if 'jelek' is in tokens
    if 'jelek' in tokens:
        print(f"'jelek' found in tokens.")
    
    # Check if 'jelek' is in stop_words
    if 'jelek' in stop_words:
        print(f"WARNING: 'jelek' IS A STOP WORD!")

    tokens = [t for t in tokens if t not in stop_words]
    print(f"After Stopwords: {tokens}")
    
    tokens = normalisasi_kata(tokens)
    print(f"After Normalization: {tokens}")
    
    tokens = [stemmer.stem(t) for t in tokens]
    print(f"After Stemming: {tokens}")
    
    return ' '.join(tokens)

# --- Test Case ---
input_text = "game nya jelek banget"
processed = preprocess(input_text)
vector = vectorizer.transform([processed])
prediction = model.predict(vector)[0]
proba = model.predict_proba(vector)

print(f"\nFinal Input to Model: '{processed}'")
print(f"Prediction: {prediction}")
print(f"Probability: {proba}")
