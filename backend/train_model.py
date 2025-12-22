# backend/train_model.py
import pandas as pd
import numpy as np
import joblib
import time
from sklearn.model_selection import StratifiedKFold, RandomizedSearchCV, train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

import os

# === Konfigurasi ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "bersih2kelas.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model", "rf_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "model", "vectorizer.pkl")
RANDOM_STATE = 42
N_ITER_SEARCH = 20  # Jumlah kombinasi parameter yang dicoba (tambah jika ingin lebih teliti)
CV_FOLDS = 5

def load_data(path):
    print("Loading data...")
    df = pd.read_csv(path, encoding='utf-8')
    df.dropna(subset=['hasil_akhir', 'Sentimen'], inplace=True)
    df['Sentimen'] = df['Sentimen'].astype(str)
    print(f"Total data: {len(df)}")
    print(f"Distribusi kelas:\n{df['Sentimen'].value_counts()}")
    return df['hasil_akhir'], df['Sentimen']

def train_optimized_model():
    X_text, y = load_data(DATA_PATH)

    # 1. Pipeline Gabungan (TF-IDF -> SMOTE -> Random Forest)
    # Penting: SMOTE hanya boleh dilakukan pada data TRAIN di setiap fold CV
    # Pipeline imblearn menghandle ini secara otomatis.
    pipeline = ImbPipeline([
        ('tfidf', TfidfVectorizer()),
        ('smote', SMOTE(random_state=RANDOM_STATE)),
        ('clf', RandomForestClassifier(random_state=RANDOM_STATE, n_jobs=-1))
    ])

    # 2. Hyperparameter Space
    param_dist = {
        'tfidf__ngram_range': [(1, 1), (1, 2)],
        'tfidf__max_features': [3000, 5000, None],
        'tfidf__min_df': [1, 3, 5],
        'clf__n_estimators': [100, 200, 300, 500],
        'clf__max_depth': [10, 20, 30, 50, None],
        'clf__min_samples_split': [2, 5, 10],
        'clf__min_samples_leaf': [1, 2, 4],
        'clf__max_features': ['sqrt', 'log2'],
        'clf__bootstrap': [True]
    }

    # 3. Setup Cross-Validation Search
    cv = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)
    
    print("\nMemulai Hyperparameter Tuning (RandomizedSearchCV)...")
    print(f"Mencoba {N_ITER_SEARCH} kombinasi parameter...")
    
    start_time = time.time()
    random_search = RandomizedSearchCV(
        pipeline,
        param_distributions=param_dist,
        n_iter=N_ITER_SEARCH,
        scoring='f1_macro', # Fokus ke balance kedua kelas
        cv=cv,
        verbose=1,
        random_state=RANDOM_STATE,
        n_jobs=-1
    )
    
    # Split data train/test (biar ada hold-out set murni buat validasi akhir)
    # Opsional: Bisa pakai seluruh data untuk CV, tapi hold-out bagus buat cek overfitting
    X_train, X_test, y_train, y_test = train_test_split(X_text, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y)
    
    random_search.fit(X_train, y_train)
    
    end_time = time.time()
    print(f"Selesai dalam {end_time - start_time:.2f} detik.")
    
    best_model = random_search.best_estimator_
    print("\n=== Parameter Terbaik ===")
    print(random_search.best_params_)
    print(f"Best CV Score (F1 Macro): {random_search.best_score_:.4f}")

    # 4. Evaluasi Final pada Test Set
    print("\n=== Evaluasi pada Test Set (Data Baru) ===")
    y_pred = best_model.predict(X_test)
    y_train_pred = best_model.predict(X_train)
    
    print("\nClassification Report (Test Set):")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix (Test Set):")
    print(confusion_matrix(y_test, y_pred))

    # Cek Overfitting
    acc_train = accuracy_score(y_train, y_train_pred)
    acc_test = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy Train: {acc_train:.4f}")
    print(f"Accuracy Test : {acc_test:.4f}")
    
    if acc_train - acc_test > 0.1:
        print("WARNING: Terindikasi Overfitting (>10% gap). Coba kurangi max_depth atau tambah min_samples_leaf.")
    else:
        print("Good: Model cukup balance (tidak overfitting parah).")

    # 5. Simpan Model Akhir (Fit ulang ke seluruh data? Atau pakai best estimator dari train?)
    # Biasanya best practice: Pakai model yang sudah dituning, lalu fit ulang ke ALL data (X_text, y)
    print("\nMelatih ulang model terbaik pada SELURUH dataset untuk production...")
    best_model.fit(X_text, y)
    
    # Save components separately like before? 
    # Current app.py expects: model/rf_model.pkl (model only) and model/vectorizer.pkl
    # But our pipeline has both. We need to split them or update app.py.
    # To keep app.py compatible for now: Extract vectorizer and classifier from pipeline.
    
    final_vectorizer = best_model.named_steps['tfidf']
    final_classifier = best_model.named_steps['clf']
    
    # Note: If we just save these two, we LOSE the SMOTE step? 
    # NO: SMOTE is only for training upsampling. Inference doesn't use SMOTE.
    # So saving Vectorizer -> Classifier is CORRECT for inference.
    
    joblib.dump(final_classifier, MODEL_PATH)
    joblib.dump(final_vectorizer, VECTORIZER_PATH)
    print(f"Model disimpan ke {MODEL_PATH}")
    print(f"Vectorizer disimpan ke {VECTORIZER_PATH}")

if __name__ == "__main__":
    train_optimized_model()
