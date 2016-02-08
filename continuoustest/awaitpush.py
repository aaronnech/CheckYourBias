from flask import Flask
import subprocess
import os
import sys

app = Flask(__name__)

def send(subject, to, message):
	print 'Sending in progress...'
	print 'With content:'
	print 'Subject: %s\n' % subject
	print 'Body:'
	print message
	SENDMAIL = "/usr/sbin/sendmail"
	try:
		p = os.popen("%s -t" % SENDMAIL, "w")
		p.write("To: %s\n" % to)
		p.write("Subject: %s\n" % subject)
		p.write("\n")
		p.write(message)
		sts = p.close()
		if sts != 0:
		    print "Sendmail exit status", sts

		print 'Sent mail to %r' % to
		print 'With content:'
		print 'Subject: %s\n' % subject
		print 'Body:'
		print message
	except:
		e = sys.exc_info()[0]
		print 'Failed to send email!'
		print e

@app.route('/', methods=['POST'])
def continousTest():
	# Fail message based on success of subprocess
	worked = '[PASSED]'
	build_output = ''

	try:
		print "Pulling repo..."
		output = subprocess.check_output(["git", "pull"], stderr=subprocess.STDOUT)
	except:
		worker = '[FAILED]'

	try:
		print "Building project and running tests..."
		build_output = subprocess.check_output(["npm", "run-script", "test"], stderr=subprocess.STDOUT)
	except:
		worked = '[FAILED]'

	print "Emailing results..."
	message = 'Hello! I am CYB Build Test Bot. Here are the results of build / test from the latest push: \n\n %s' % build_output
	send(worked + ' Build / Test Results - CYB', 'checkyourbias@u.washington.edu', message)
	print 'Email sent!'

if __name__ == '__main__':
    app.run(host='0.0.0.0')