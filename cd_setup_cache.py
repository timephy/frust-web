import sys
import os
import json

files = list(sys.stdin)
files = [f"/{f[:-1]}" for f in files]

print(os.environ)

sw_content = open("sw.js", "r").read()
sw_content = sw_content.replace("{{COMMIT_SHA}}", os.getenv("GITHUB_SHA"))
sw_content = sw_content.replace("""["{{CACHE_URLS}}"]""",
                                json.dumps(files, indent=2))
sw_file = open("sw.js", "w")
sw_file.write(sw_content)
sw_file.close()
