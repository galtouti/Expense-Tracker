import sys
import requests
import os
from datetime import datetime

def run_api_tests():
    # Setup output file
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"api_test_results_{current_time}.txt"
    output = open(filename, "w")
    sys.stdout = output

    # Get base URL from environment or default to localhost
    base_url = os.getenv('API_BASE_URL', 'http://localhost:3000')
    
    print("=" * 50)
    print("EXPENSE TRACKER API TESTS")
    print("=" * 50)
    print(f"Testing against server: {base_url}")
    print("Make sure your Node.js server is running!")
    print("=" * 50)
    print()

    print("Testing getting the about")
    print("-------------------------")
    try:
        url = f"{base_url}/api/about"  # Removed trailing slash
        print(f"Sending GET request to: {url}")
        data = requests.get(url)
        print(f"Status code: {data.status_code}")
        if data.status_code == 200:
            print("Response content:")
            print(data.json())
        else:
            print(f"Error response: {data.text}")
    except requests.exceptions.ConnectionError:
        print("Connection Error: Make sure your Node.js server is running on port 3000")
    except Exception as e:
        print("Error:", str(e))
    print()

    print("Testing getting the report - 1")
    print("------------------------------")
    try:
        url = f"{base_url}/api/report"  # Changed to match Express route
        params = {
            'id': '123123',
            'year': '2025',
            'month': '2'
        }
        print(f"Sending GET request to: {url}")
        print(f"With params: {params}")
        data = requests.get(url, params=params)
        print(f"Status code: {data.status_code}")
        if data.status_code == 200:
            print("Response content:")
            print(data.json())
        else:
            print(f"Error response: {data.text}")
    except requests.exceptions.ConnectionError:
        print("Connection Error: Make sure your Node.js server is running on port 3000")
    except Exception as e:
        print("Error:", str(e))
    print()

    print("Testing adding cost item")
    print("----------------------------------")
    try:
        url = f"{base_url}/api/add"  # Changed to match Express route
        cost_data = {
            'userid': 123123,
            'description': 'milk 9',
            'category': 'food',
            'sum': 8
        }
        print(f"Sending POST request to: {url}")
        print(f"With data: {cost_data}")
        data = requests.post(url, json=cost_data)
        print(f"Status code: {data.status_code}")
        if data.status_code in [200, 201]:
            print("Response content:")
            print(data.json())
        else:
            print(f"Error response: {data.text}")
    except requests.exceptions.ConnectionError:
        print("Connection Error: Make sure your Node.js server is running on port 3000")
    except Exception as e:
        print("Error:", str(e))
    print()

    print("Testing getting the report - 2")
    print("------------------------------")
    try:
        url = f"{base_url}/api/report"  # Changed to match Express route
        params = {
            'id': '123123',
            'year': '2025',
            'month': '2'
        }
        print(f"Sending GET request to: {url}")
        print(f"With params: {params}")
        data = requests.get(url, params=params)
        print(f"Status code: {data.status_code}")
        if data.status_code == 200:
            print("Response content:")
            print(data.json())
        else:
            print(f"Error response: {data.text}")
    except requests.exceptions.ConnectionError:
        print("Connection Error: Make sure your Node.js server is running on port 3000")
    except Exception as e:
        print("Error:", str(e))
    print()

    # Reset stdout to default
    sys.stdout = sys.__stdout__
    print(f"Test results have been written to {filename}")

if __name__ == "__main__":
    run_api_tests() 