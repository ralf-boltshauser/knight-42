import requests
import os
import argparse

# 1. GET Request to URL, gets the assets in format ¨[{id, metadata: {IP: string}}]
# 2. Check for each asset if it is up or down, using the IP (ping) and then create an array with [{id, up: boolean}]
# 3. POST Request to URL with the array of assets with the status of each one

def log(message, debug):
    if debug:
        print(message)

def check_assets(server, https=False, debug=False):
    URL = f"{'https' if https else 'http'}://{server}:4200/api/assets"
    assets = requests.get(URL).json()
    log("Assets retrieved from server:", debug)
    for asset in assets:
        log(asset, debug)
    up_assets = []
    for asset in assets:
        ip = asset["metadata"]["IP"]
        log(f"Checking IP: {ip}", debug)
        response = os.system("ping -c 1 " + ip + " > /dev/null 2>&1")
        if response == 0:
            log(f"IP {ip} is up.", debug)
            up_assets.append({"id": asset["id"], "up": True})
        else:
            log(f"IP {ip} is down.", debug)
            up_assets.append({"id": asset["id"], "up": False})
    log("Posting results to server...", debug)
    response = requests.post(URL, json=up_assets)
    if response.status_code == 200:
        log("Results posted successfully.", debug)
    else:
        log(f"Failed to post results. HTTP Status Code: {response.status_code}", debug)

def main():
    parser = argparse.ArgumentParser(description="Check the uptime of all assets and send the results to the server.")
    parser.add_argument("-s", "--server", required=True, help="The server IP to send results to")
    parser.add_argument("--https", help="Use HTTPS for requests", action="store_true")
    parser.add_argument("--debug", help="Enable debug output", action="store_true")
    
    args = parser.parse_args()

    check_assets(args.server, args.https, args.debug)

if __name__ == "__main__":
    main()
