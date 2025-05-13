# import sys

# print("Starting run.py")
# # Read code from stdin
# code = sys.stdin.read()

# # Use exec to run the code
# try:
#     print("Running code.py...")
#     exec(code)
#     print("STDOUT:")
#     print(code.stdout)
#     print("STDERR:")
#     print(code.stderr)
# except Exception as e:
#     print(f"Error: {e}")



# import subprocess

# # print("Starting run.py")

# try:
#     # print("Running code.py...")

#     result = subprocess.run(
#         ['python', 'code.py'],
#         capture_output=True,
#         text=True,
#         timeout=5
#     )

#     # print("STDOUT:")
#     print(result.stdout)

#     if result.stderr:
#         print("STDERR:")
#         print(result.stderr)

# except Exception as e:
#     print(f"Exception occurred: {e}")

import sys

code = sys.stdin.read()

try:
    exec(code)
except Exception as e:
    print(f"Error: {e}")
