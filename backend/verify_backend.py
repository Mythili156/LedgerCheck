import requests
import os

url = "http://localhost:8000/upload/"
files = {'file': open('../sample.csv', 'rb')}

try:
    response = requests.post(url, files=files)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    if response.status_code == 200:
        print("SUCCESS: File upload and mock analysis working!")
    else:
        print("FAILED: Backend returned error.")
except Exception as e:
    print(f"FAILED: Could not connect to backend. {e}")
