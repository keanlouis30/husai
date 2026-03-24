import pandas as pd
import numpy as np

# Load the UCI/Kaggle dataset
df_kaggle = pd.read_csv('student-por.csv', sep=';' if ';' in open('student-por.csv').read(100) else ',')

# Define the MELC Mapping based on DepEd format (Quarter, Grade Level, Competency)
melc_mapping = [
    {"grade": 10, "quarter": 1, "code": "M10AL-Ia-1", "topic": "Arithmetic Sequences", "threshold": 10},
    {"grade": 10, "quarter": 1, "code": "M10AL-Ib-1", "topic": "Geometric Sequences", "threshold": 10},
    {"grade": 10, "quarter": 2, "code": "M10GE-IIa-1", "topic": "Polynomial Functions", "threshold": 12},
    {"grade": 10, "quarter": 3, "code": "M10SP-IIIa-1", "topic": "Permutations", "threshold": 10}
]
df_melc = pd.DataFrame(melc_mapping)

def map_learning_gaps(student_row, melc_df):
    gaps = []
    # Logic: If G3 (Final Grade) is below the MELC threshold, identify as a gap
    # In a real scenario, you would map specific quiz columns to specific MELC codes
    for _, melc in melc_df.iterrows():
        if student_row['G3'] < melc['threshold']:
            gaps.append(melc['code'])
    return gaps

# Apply mapping to create the training labels for the Learning Gap Classifier
df_kaggle['learning_gaps'] = df_kaggle.apply(lambda row: map_learning_gaps(row, df_melc), axis=1)

# Example of the processed data structure for Model 3 training
training_data = df_kaggle[['G1', 'G2', 'G3', 'studytime', 'failures', 'learning_gaps']].copy()

print("Sample Processed Data for Model 3:")
print(training_data.head())

training_data.to_csv('labeled_learning_gaps.csv', index=False)
print("File saved successfully as labeled_learning_gaps.csv")