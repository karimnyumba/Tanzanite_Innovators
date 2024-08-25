# AI Crop Recommendation System

## Overview
This part focuses on developing an AI system for crop and fertilzer model training and comparison. The repository contains data, model training scripts, and notebooks used for evaluating and comparing different models.

## Folder Structure
- **Data/**: Contains all the datasets used for training and evaluation.
- **Improved Modelling/**: Includes the trained models and related files.
- **Notebooks/**: Jupyter notebooks used for training, evaluating, and comparing models.
  - `modelcomparison.png`: Visualization of model comparison results.
  - `modelscomparison2.png`: Additional visualization of model comparison results
     
## How to Run
1. **Install dependencies**:
   Make sure you have Python and Jupyter Notebook installed. Install necessary Python packages using:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Jupyter Notebook**:
   Launch Jupyter Notebook to explore and run the scripts in `playground.ipynb`:
   ```bash
   jupyter notebook
   ```

## AI recommendation system architecture
The AI recommendation system architecture depicted consists of a data-driven predictive 
model pipeline. It begins with Data Acquisition, where raw data is collected from the system. 
Next, in Preprocessing, this data is cleaned and standardized, which may include handling 
soil and environmental data. Feature Extraction follows, selecting and formatting the 
necessary data features for model input. Model Inference then uses these features to make 
predictions. Finally, postprocessing formats these predictions into interpretable 
recommendations, which are delivered to the user in Recommendation Delivery.

![Screenshot 2024-07-21 133039](https://github.com/user-attachments/assets/7ae3e866-c033-4302-8afd-1452929aa4dc)


