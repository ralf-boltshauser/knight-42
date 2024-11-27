import requests
import os
import argparse

# 1. GET Request to URL, gets the assets in format ¨[{id, metadata: {IP: string}}]
# 2. Check for each asset if it is up or down, using the IP (ping) and then create an array with [{id, up: boolean}]
# 3. POST Request to URL with the array of assets with the status of each one

def check_assets(server, https=False):
    URL = f"{'https' if https else 'http'}://{server}:4200/api/assets"
    assets = requests.get(URL).json()
    print("Assets retrieved from server:")
    for asset in assets:
        print(asset)
    up_assets = []
    for asset in assets:
        ip = asset["metadata"]["IP"]
        print(f"Checking IP: {ip}")
        response = os.system("ping -c 1 " + ip + " > /dev/null 2>&1")
        if response == 0:
            print(f"IP {ip} is up.")
            up_assets.append({"id": asset["id"], "up": True})
        else:
            print(f"IP {ip} is down.")
            up_assets.append({"id": asset["id"], "up": False})
    print("Posting results to server...")
    requests.post(URL, json=up_assets)
    response = requests.post(URL, json=up_assets)
    if response.status_code == 200:
        print("Results posted successfully.")
    else:
        print(f"Failed to post results. HTTP Status Code: {response.status_code}")

def main():
    parser = argparse.ArgumentParser(description="Check the uptime of all assets and send the results to the server.")
    parser.add_argument("-s", "--server", required=True, help="The server IP to send results to")
    parser.add_argument("--https", help="Use HTTPS for requests", action="store_true")
    
    args = parser.parse_args()

    check_assets(args.server, args.https)

if __name__ == "__main__":
    main()
