import os
import datetime
import json


output = {
    "commit_sha": os.getenv("GITHUB_SHA"),
    "timestamp": datetime.datetime.now().isoformat()
}

version_file = open("version.json", "w")
version_file.write(json.dumps(output, indent=4))
version_file.close()
