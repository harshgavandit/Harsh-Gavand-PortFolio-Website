import json, urllib.request, urllib.error, concurrent.futures, time
from pathlib import Path
root=Path(__file__).resolve().parents[1]
projects=json.loads((root/'src/data/projects.json').read_text())
urls=list(dict.fromkeys([p[k] for p in projects for k in ('githubUrl','demoUrl') if k in p]))
def check(url):
    start=time.time()
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 Portfolio-Link-Check'},method='GET')
        with urllib.request.urlopen(req,timeout=25) as response:
            html=response.read(20000).decode('utf-8',errors='replace')
            return {'url':url,'status':response.status,'resolved':response.url,'renderWakeup':'Application loading' in html,'seconds':round(time.time()-start,1)}
    except urllib.error.HTTPError as error: return {'url':url,'status':error.code}
    except Exception as error: return {'url':url,'error':str(error),'seconds':round(time.time()-start,1)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor: results=list(executor.map(check,urls))
(root/'verification/link-checks.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
