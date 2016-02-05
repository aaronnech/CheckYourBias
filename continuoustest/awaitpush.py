from flask import Flask
import subprocess
from email.mime.text import MIMEText

app = Flask(__name__)

@app.route('/', methods=['POST'])
def continousTest():
	print "Pulling repo..."
	# Pull the repo
	output = subprocess.check_output(["git", "pull"])

	print "Building project and running tests..."
	# Build the project and test
	build_output = subprocess.check_output(["npm", "run-script", "test"])

	print "Emailing results..."
	msg = MIMEText("Hello! I am CYB build/test bot. A push happened and I tried to build and test. Here are the results: \n\n %r" % (build_output))
	msg["From"] = "build.test@cyb.org"
	msg["To"] = "aaronnech@gmail.com"
	msg["Subject"] = "CYB - Build / Test Results"
	p = subprocess.Popen(["/usr/sbin/sendmail", "-t", "-oi"], stdin=subprocess.PIPE)
	p.communicate(msg.as_string())
	status = p.close()
	print "Sendmail exit status: %r" % str(status)

if __name__ == '__main__':
    app.run(host='0.0.0.0')