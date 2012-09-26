import os
import glob
import json
import re

path = "app/templates/"
langs = ["en", "fr"]
print "Path is " + path

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    ">": "&gt;",
    "<": "&lt;",
    }


def html_escape(text):
    return "".join(html_escape_table.get(c, c) for c in text)


print "Removing previous json files..."
for infile in glob.glob(os.path.join(path, "*.json")):
    print "> Current file is: " + infile
    os.remove(infile)

print "Building html file"
html_dict = []
for infile in glob.glob(os.path.join(path, "*.html")):
    print "> Current file is: " + infile
    current_dict = {}
    current_dict["name"] = infile[infile.rfind("/") + 1:infile.rfind(".")]
    current = open(infile, "r+")
    current_dict["markup"] = html_escape(current.read().replace("\n", "").replace("\t", ""))
    if re.search("\&lt\;\@\=?(.+?)\@\&gt\;", current_dict["markup"]):
        current_dict["double_pass"] = True
    current.close()
    html_dict.append(current_dict)
html = open(os.path.join(path, "html.json"), "w+")
html.write(json.dumps(html_dict, separators=(",", ":")))
html.close()

print "Building language files"
for lang in langs:
    print "Building " + lang + " file"
    lang_dict = []
    for infile in glob.glob(os.path.join(path, "*." + lang + ".strings")):
        print "> Current file is: " + infile
        current_dict = {}
        current_dict["name"] = infile[infile.rfind("/") + 1:-11]
        current = open(infile, "r+")
        current_dict["localization"] = json.loads(current.read())
        current.close()
        lang_dict.append(current_dict)
    html = open(os.path.join(path, lang + ".json"), "w+")
    html.write(json.dumps(lang_dict, separators=(",", ":")))
    html.close()
