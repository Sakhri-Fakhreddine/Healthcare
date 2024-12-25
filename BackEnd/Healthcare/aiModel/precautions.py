import pandas as pd

def load_precautions(file_path):
    """Load the CSV file and transform it into a dictionary."""
    # Load the CSV file into a pandas DataFrame
    data = pd.read_csv(file_path)
    
    # Ensure the dataset has the correct columns
    if "disease" not in data.columns or "precautions" not in data.columns:
        raise ValueError("CSV file must contain 'disease' and 'precautions' columns.")
    
    # Transform the DataFrame into a dictionary
    precautions_mapping = data.set_index("disease")["precautions"].to_dict()
    return precautions_mapping

def get_precautions(disease, precautions_mapping):
    """Retrieve precautions for a given disease."""
    return precautions_mapping.get(disease, "Please check with your doctor for check ups .")

# if __name__ == "__main__":
#     # Example usage
#     file_path = "diseases_with_precautions.csv"  # Replace with your dataset file path
#     try:
#         precautions_mapping = load_precautions(file_path)
#         print("Precautions loaded successfully.")
        
#         # Test with an example disease
#         disease = input("Enter the disease name: ")
#         precautions = get_precautions(disease, precautions_mapping)
#         print(f"Precautions for {disease}: {precautions}")
#     except Exception as e:
#         print(f"An error occurred: {e}")
