#!/usr/bin/env python3
import requests, time

# Wait for services
base = 'http://localhost'

def wait(url, timeout=120):
    t0 = time.time()
    while time.time() - t0 < timeout:
        try:
            r = requests.get(url, timeout=3)
            if r.status_code < 500:
                return True
        except Exception:
            pass
        time.sleep(1)
    raise RuntimeError('service not ready: '+url)

print('Waiting for auth...')
wait('http://localhost:8082/healthz')
print('Waiting for exec-engine...')
wait('http://localhost:8081/healthz')

# Signup
d = {'email':'e2e@example.com','password':'pass','name':'E2E'}
r = requests.post('http://localhost:8082/signup', json=d)
print('signup', r.status_code, r.text)
if r.status_code!=200:
    raise SystemExit('signup failed')

tok = r.json()['access_token']
headers = {'Authorization': 'Bearer '+tok}

# Run simple python
payload = {'language':'python', 'files': {'main.py':'print("hello e2e")'}}
r = requests.post('http://localhost:8081/run', json=payload, headers=headers, timeout=30)
print('run status', r.status_code)
print(r.text[:1000])
if r.status_code != 200:
    raise SystemExit('run failed')

print('E2E success')
