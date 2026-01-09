from sentence_transformers import SentenceTransformer

# This downloads and caches the model
model = SentenceTransformer("all-MiniLM-L6-v2")

print("Model downloaded successfully")
