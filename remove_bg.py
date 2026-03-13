import os
import glob
from rembg import remove
from PIL import Image

def process_images(directory):
    # Find all PNGs
    pattern = os.path.join(directory, "*.png")
    files = glob.glob(pattern)
    
    print(f"Found {len(files)} images to process in {directory}...")
    
    for file_path in files:
        # We only want to process the raw generations, let's avoid double-processing
        if "_nobg" in file_path:
            continue
            
        print(f"Removing background for: {os.path.basename(file_path)}")
        try:
            with open(file_path, 'rb') as i:
                input_data = i.read()
                
            # Rembg automatically detects the foreground character
            output_data = remove(input_data)
            
            # Save it back out, overwriting the original
            with open(file_path, 'wb') as o:
                o.write(output_data)
                
            print(f"Successfully cleaned: {os.path.basename(file_path)}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    target_dir = r"C:\Users\heman\OneDrive\Desktop\Hearthlight - VisualNovel\hearthlight\public\assets\chars"
    process_images(target_dir)
