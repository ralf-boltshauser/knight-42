import nmap
import argparse
import json
import requests

def scan_target(target):
    """
    Scan the target and retrieve OS, IP, and related information.
    :param target: Target IP, range, or hostname
    :return: List of scanned host data in JSON format
    """
    nm = nmap.PortScanner()
    try:
        print(f"Scanning target: {target}...")
        scan_result = nm.scan(hosts=target, arguments='-O -Pn -sV')

        output = []

        # Parse results for each scanned host
        for host in nm.all_hosts():
            os_match = scan_result['scan'][host].get('osmatch', [{}])
            hostname = nm[host].hostname()
            print(f'Host: {host}, Hostname: {hostname}')

            os_name = os_match[0].get('name', 'Unknown') if os_match else 'Unknown'
            ip_address = scan_result['scan'][host]['addresses'].get('ipv4', 'Unknown')

            # Extract services information
            services = []
            for port in nm[host].all_tcp():
                service_info = nm[host]['tcp'][port]
                services.append({
                    "port": port,
                    "service": service_info.get('name', 'Unknown'),
                    "state": service_info.get('state', 'Unknown'),
                    "version": service_info.get('version', 'Unknown')
                })

            host_info = {
                "name": host,
                "metadata": {
                    "OS": os_name,
                    "IP": ip_address,
                    "location": "Unknown",  # Placeholder for location
                    "services": services
                }
            }
            output.append(host_info)

        return output

    except Exception as e:
        print(f"Error during scanning: {e}")
        return []

def send_to_server(data, server_ip):
    """
    Send the scan results to the specified server endpoint.
    :param data: Scanned data in JSON format
    :param server_ip: Server IP address
    """
    url = f"http://{server_ip}:3000/api/assets"
    print(data)
    try:
        print(f"Sending data to {url}...")
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, json=data, headers=headers)

        if response.status_code == 200:
            print("Data sent successfully!")
        else:
            print(f"Failed to send data. Server responded with status code: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error during sending: {e}")

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description="Scan a target and send results to a server.")
    parser.add_argument("-t", "--target", required=True, help="The target to scan (e.g., 192.168.0.1, 192.168.0.1/24, or hostname)")
    parser.add_argument("-s", "--server", required=True, help="The server IP to send results to")
    args = parser.parse_args()

    # Run the scan
    scan_results = scan_target(args.target)

    # Send results to the server if any were found
    if scan_results:
        send_to_server(scan_results, args.server)
    else:
        print("No results to send.")

if __name__ == "__main__":
    main()
