# backend/model/train_model.py
import pandas as pd
import string
import re
import numpy as np
import joblib
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from sklearn.model_selection import StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from imblearn.over_sampling import SMOTE
from collections import Counter

# Load data
df = pd.read_csv("data/bersih2kelas.csv", encoding='utf-8')
df.dropna(subset=['hasil_akhir', 'Sentimen'], inplace=True)
df['Sentimen'] = df['Sentimen'].astype(str)

# TF-IDF
X = df['hasil_akhir']
y = df['Sentimen'].values
vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=3000, max_df=0.85, min_df=3)
X_tfidf = vectorizer.fit_transform(X).toarray()

# Cross-validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
min_samples_leaf_values = [2]

for min_samples_leaf in min_samples_leaf_values:
    print(f"\n### Evaluasi min_samples_leaf = {min_samples_leaf} ###")
    train_accuracies = []
    test_accuracies = []
    all_y_true = []
    all_y_pred = []

    for fold, (train_idx, test_idx) in enumerate(skf.split(X_tfidf, y), start=1):
        X_train, X_test = X_tfidf[train_idx], X_tfidf[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]

        smote = SMOTE(random_state=42)
        X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=min_samples_leaf,
            max_features='sqrt',
            bootstrap=True,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train_res, y_train_res)

        train_accuracies.append(model.score(X_train_res, y_train_res))
        test_accuracies.append(model.score(X_test, y_test))

        y_pred = model.predict(X_test)
        all_y_true.extend(y_test)
        all_y_pred.extend(y_pred)

    print(f"\n==== Rata-rata Train/Test ====")
    print(f"Train Avg: {np.mean(train_accuracies):.4f} | Test Avg: {np.mean(test_accuracies):.4f}")
    print("\n=== Confusion Matrix Gabungan ===")
    print(confusion_matrix(all_y_true, all_y_pred, labels=['negatif', 'positif']))
    print("\n=== Classification Report Gabungan ===")
    print(classification_report(all_y_true, all_y_pred, labels=['negatif', 'positif']))

    # Latih ulang model pada seluruh data untuk disimpan
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_tfidf, y)

    final_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=min_samples_leaf,
        max_features='sqrt',
        bootstrap=True,
        random_state=42,
        n_jobs=-1
    )
    final_model.fit(X_resampled, y_resampled)

    joblib.dump(final_model, 'model/rf_model.pkl')
    joblib.dump(vectorizer, 'model/vectorizer.pkl')
    print("\nModel dan vectorizer berhasil disimpan.")

