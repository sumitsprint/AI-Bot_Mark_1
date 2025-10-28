import csv
from pathlib import Path
import numpy as np 
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
# from slLearn.linear_model import LinearRegression


# from sklearn.metrics import mean_squared_error, r2_score

from sklearn.metrics import accuracy_score, mean_squared_error, mean_absolute_error, r2_score

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
    ("clf", LogisticRegression(max_iter=1000, C=0.5))
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

print(confusion_matrix(y_test, pred))
print(classification_report(y_test, pred, digits=3))

# 6) Save the whole pipeline (vectorizer + model together)

OUT.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(pipe, OUT)
print(f"Saved pipeline to: {OUT}")


# import csv
# from pathlib import Path
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.pipeline import Pipeline
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression, LinearRegression
# from sklearn.metrics import accuracy_score, mean_squared_error, mean_absolute_error, r2_score
# import joblib

# # 0) Paths
# DATA = Path("data/intents.csv")
# OUT_DIR = Path("model")

# # 1) Load CSV
# texts, intents = [], []
# with open(DATA, "r", encoding="utf-8") as f:
#     reader = csv.DictReader(f)
#     for row in reader:
#         texts.append(row["text"].strip())
#         intents.append(row["intent"].strip())

# # 2) Synthetic numeric target in [0,1)
# rng = np.random.RandomState(42)
# confidence_scores = rng.rand(len(texts))

# # 3) Split for both tasks (classification + regression)
# X_train, X_test, y_cls_train, y_cls_test, y_reg_train, y_reg_test = train_test_split(
#     texts, intents, confidence_scores,
#     test_size=0.25, random_state=42, stratify=intents
# )

# # 4) Classification: TF-IDF + Logistic Regression
# cls_pipe = Pipeline([
#     ("tfidf", TfidfVectorizer(ngram_range=(1, 2), lowercase=True)),
#     ("clf",  LogisticRegression(max_iter=1000))
# ])


# cls_pipe.fit(X_train, y_cls_train)
# y_cls_pred = cls_pipe.predict(X_test)
# cls_acc = accuracy_score(y_cls_test, y_cls_pred)
# print(f"[Classification] Accuracy: {cls_acc:.3f}")

# # 5) Regression: TF-IDF + Linear Regression
# reg_pipe = Pipeline([
#     ("tfidf", TfidfVectorizer(ngram_range=(1, 2), lowercase=True)),
#     ("reg",   LinearRegression())
# ])



# reg_pipe.fit(X_train, y_reg_train)
# y_reg_pred = reg_pipe.predict(X_test)
# reg_mae = mean_absolute_error(y_reg_test, y_reg_pred)
# reg_mse = mean_squared_error(y_reg_test, y_reg_pred)
# reg_r2  = r2_score(y_reg_test, y_reg_pred)
# print(f"[Regression] MAE: {reg_mae:.4f} | MSE: {reg_mse:.4f} | R²: {reg_r2:.3f}")

# # 6) Quick side-by-side peek
# print("\nSample predictions (first 5):")
# for i in range(min(5, len(X_test))):
#     print(f"- Text: {X_test[i]!r}")
#     print(f"  True intent: {y_cls_test[i]} | Pred intent: {y_cls_pred[i]}")
#     print(f"  True score:  {y_reg_test[i]:.3f} | Pred score:  {y_reg_pred[i]:.3f}")
#     print("")

# # 7) Save both pipelines (optional)
# OUT_DIR.mkdir(parents=True, exist_ok=True)
# joblib.dump(cls_pipe, OUT_DIR / "pipeline_classification.joblib")
# joblib.dump(reg_pipe, OUT_DIR / "pipeline_regression.joblib")
# print("Saved classifier to model/pipeline_classification.joblib")
# print("Saved regressor  to model/pipeline_regression.joblib")







