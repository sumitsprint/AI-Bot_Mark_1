import csv
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

import joblib


DATA = Path(__file__).resolve().parents[1] / "data" / "intents.csv"
OUT  = Path(__file__).resolve().parent / "pipeline.joblib"

# 1) Load CSV
texts, labels = [], []
with open(DATA, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        texts.append(row["text"].strip())
        labels.append(row["intent"].strip())

# 2) Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.25, random_state=42, stratify=labels
)

# 3) Build a small pipeline
pipe = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1,2), lowercase=True)),
    ("clf", LogisticRegression(max_iter=1000))
])

# 4) Train

pipe.fit(X_train, y_train)
# z = pipe.named_steps["tfidf"].get_feature_names_out()

# X = pipe.named_steps["tfidf"].transform(X_test)
# print(X.toarray())

# 5) Evaluate (quick sanity)
pred = pipe.predict(X_test)

acc = accuracy_score(y_test, pred)
print(f"Model accuracy: {acc:.2f} on held-out test set")

# 6) Save the whole pipeline (vectorizer + model together)

OUT.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(pipe, OUT)
print(f"Saved pipeline to: {OUT}")




