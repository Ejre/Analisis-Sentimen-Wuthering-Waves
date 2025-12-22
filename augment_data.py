import pandas as pd
import random
import os

# Define keywords to target
neg_keywords = ['jelek', 'buruk', 'ampas', 'sampah', 'kecewa', 'nyesel', 'lag', 'patah', 'bug', 'berat', 'gacha ampas', 'boros', 'panas']
pos_keywords = ['bagus', 'keren', 'epik', 'puas', 'seru', 'wajib main', 'terbaik', 'halus', 'grafik dewa', 'wuthering waves', 'wuwa', 'kuro']

# Templates for pattern generation
neg_templates = [
    "game nya {kw} banget",
    "sumpah {kw} parah ini game",
    "nyesel download, game nya {kw}",
    "kenapa sih {kw} gini mainnya",
    "dev tolong perbaiki, {kw} sekali",
    "grafik sih oke tapi gameplay {kw}",
    "gacha nya {kw} banget tolong",
    "hp saya panas dan {kw} main ini",
    "tidak recommended, {kw}",
    "parah banget {kw} nya",
    "asli {kw} bat",
    "game {kw}",
    "ga jelas {kw}",
    "masa {kw} gini",
]

pos_templates = [
    "game nya {kw} banget",
    "sumpah {kw} parah ini game", # Context dependent, but usually 'keren parah'
    "ga nyesel download, game nya {kw}",
    "suka banget, {kw} abis",
    "dev mantap, {kw} sekali",
    "gameplay sih oke dan grafik {kw}",
    "ceritanya {kw} banget",
    "hp saya aman dan {kw} main ini",
    "sangat recommended, {kw}",
    "keren banget {kw} nya",
    "asli {kw} bat",
    "game {kw}",
    "mantap {kw}",
    "wah {kw} gini",
]

def generate_reviews(n=150): # 150 neg + 150 pos = 300 total
    new_data = []
    
    # Generate Negative
    for _ in range(n):
        kw = random.choice(neg_keywords)
        template = random.choice(neg_templates)
        review = template.format(kw=kw)
        # Randomly add "sih" or "dong" for variance
        if random.random() > 0.7:
            review += " sih"
        
        # Preprocessing simulation (simple version matching app.py logic roughly)
        # In reality, we append to RAW 'Review' and let preprocess handle it, 
        # OR we append to 'hasil_akhir' directly if we are lazy. 
        # Best practice: Appending to 'Review' and processing is cleaner, 
        # but train_model.py reads 'hasil_akhir'. 
        # So we must provide 'hasil_akhir' manually or matching the cleaning logic.
        
        # Let's simple-clean it for 'hasil_akhir'
        clean = review.lower().replace("nya", " ").replace("sih", "").replace("dong", "").strip() 
        # Note: This is a rough approximation. Ideally we use the real preprocess function.
        # But for "jelek banget", clean version is "jelek banget".
        
        new_data.append({
            'Review': review,
            'hasil_akhir': review, # training script uses this. 
            'Sentimen': 'negatif'
        })

    # Generate Positive
    for _ in range(n):
        kw = random.choice(pos_keywords)
        template = random.choice(pos_templates)
        review = template.format(kw=kw)
        
        new_data.append({
            'Review': review,
            'hasil_akhir': review,
            'Sentimen': 'positif'
        })
        
    return pd.DataFrame(new_data)

def augment():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'backend/data/bersih2kelas.csv')
    
    print(f"Loading {file_path}...")
    df = pd.read_csv(file_path)
    initial_len = len(df)
    
    print("Generating synthetic data...")
    new_df = generate_reviews(n=150) # 300 rows
    
    # Concatenate
    combined_df = pd.concat([df, new_df], ignore_index=True)
    
    # Shuffle
    combined_df = combined_df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Save
    combined_df.to_csv(file_path, index=False)
    print(f"Success! Added {len(new_df)} rows. Total data: {initial_len} -> {len(combined_df)}")

if __name__ == "__main__":
    augment()
