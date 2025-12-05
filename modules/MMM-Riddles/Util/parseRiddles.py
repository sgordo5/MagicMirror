import re

input_file = "./MMM-Riddles.txt"
output_file = "./output.txt"

# Pattern: leading spaces + digits + '.' + spaces
pattern = re.compile(r'^\s*\d+\.\s*')

quote = "\""

with open(input_file, "r") as infile, open(output_file, "w") as outfile:
    for line in infile:
        # If line starts with something like "3."
        if re.match(r'^\s*\d+\.', line):
            cleaned = pattern.sub("{\n\"question\": \"", line)
            outfile.write(cleaned[:-1] + quote + "," + cleaned[-1:])
        elif len(line) > 1:
            outfile.write(line[:-1] + quote + line[-1:] + "},\n")
        else:
            outfile.write(line)
            
