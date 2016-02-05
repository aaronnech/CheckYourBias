from flask import Flask
import subprocess

app = Flask(__name__)

@app.route('/', methods=['POST'])
def continousTest():
	# Pull the repo
	output = subprocess.check_output(["git", "pull"])

	# Build the project
	build_output = subprocess.check_output(["npm", "run-script", "make"])

	# Run tests
	test_output = subprocess.check_output(["npm", "run-script", "test"])

	msg = MIMEText("Hello! I am CYB build/test bot. A push happened and I tried to build and test. Here are the results: \n\n %r" % (build_output + test_output))
	msg["From"] = "build.test@cyb.org"
	msg["To"] = "aaronnech@gmail.com"
	msg["Subject"] = "CYB - Build / Test Results"
	p = Popen(["/usr/sbin/sendmail", "-t", "-oi"], stdin=PIPE)
	p.communicate(msg.as_string())

if __name__ == '__main__':
    app.run(host='0.0.0.0')