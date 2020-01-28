import os

import pyperclip

files = ["'/'", "'/index.html'", "'/404.html'"];
directory = 'images/'
for filename in os.listdir('../'+directory):
    files.append(os.path.join("'/", directory, filename, "'"))
    continue

directory = 'styles/'
for filename in os.listdir('../'+directory):
    files.append(os.path.join("'/", directory, filename, "'"))
    continue


directory = 'scripts/'
for filename in os.listdir('../'+directory):
        if not '.py' in filename:
            files.append(os.path.join("'/", directory, filename, "'"))
            continue
        else:
            continue

str = ', \r\n'.join(files)
str = str.replace('\\', '')
str = ''.join(['const urlsToCache = [', str , '];'])
print(str)

pyperclip.copy(str)
