#!/usr/bin/env python

import time
import shutil
import os
import csv
import datetime
import sys
import random
#import psutil
#import numpy as np
import selenium.webdriver.support.ui as ui
import selenium.webdriver.chrome.service as service

import monroe_exporter
import json

from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from subprocess import call


def run_yomo(ytid, duration, prefix, bitrates,interf,resultDir,quant1,quant2,quant3,quant4,browser,quic):

	try:

		# write output without buffering
		sys.stdout.flush()
		sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', 0)

		# start tshark
		callTshark = "tshark -n -i " + interf + " -E separator=, -T fields -e frame.time_epoch -e tcp.len -e frame.len -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e tcp.analysis.ack_rtt -e tcp.analysis.lost_segment -e tcp.analysis.out_of_order -e tcp.analysis.fast_retransmission -e tcp.analysis.duplicate_ack -e dns -e quic.cid -e quic.packet_number -e dns.cname -e dns.qry.name -e dns.resp.name -e dns.resp.type -e dns.a -e dns.aaaa -Y 'tcp or dns or quic'  >>" + resultDir + prefix + "_tshark.txt  2>" + resultDir + prefix + "_tshark_error.txt &"

		print time.time(), ' start tshark'
		call(callTshark, shell=True)

		# start display
		display = Display(visible=0, size=(4000,2400)) # 8000,7000 / 4000,2400
		print time.time(), ' start display'
		display.start()
		time.sleep(5)

		# get url
		url = 'https://www.youtube.com/watch?v=' + ytid

		# select browser
		if (browser == "chrome"):

			# chrome
			print time.time(), ' selected browser: chrome'

			# define chrome settings
			chrome_options = webdriver.ChromeOptions()
			chrome_options.add_argument('--no-sandbox')
			chrome_options.add_argument('--disable-dev-shm-usage')
			chrome_options.add_argument('-log-net-log=' + resultDir + prefix + '_httpLog_C.json')
			if (quic == False):
				print time.time(), " -- quic disabled"
				chrome_options.add_argument('--disable-quic')
			else:
				print time.time(), " -- quic enabled"
				chrome_options.add_argument('--enable-quic')

			# start chrome
			print time.time(), ' start chrome'
			browser = webdriver.Chrome('/usr/bin/chromedriver', chrome_options=chrome_options)

		else:

			# firefox
			print time.time(), ' selected browser: firefox'

			# define firefox settings
			caps = DesiredCapabilities().FIREFOX
			caps["pageLoadStrategy"] = "normal"  #  complete
			#caps["pageLoadStrategy"] = "none"

			# enable HTTP logging
			#enaHttpLog = "export MOZ_LOG=timestamp,nsHttp:3"
			#enaHttpLog2 = "export MOZ_LOG_FILE=" + resultDir + prefix + "_httpLog.txt"
			print time.time(), ' - enable HTTP logging'
			os.environ["MOZ_LOG"] = "timestamp,nsHttp:3"
			os.environ["MOZ_LOG_FILE"] = resultDir + prefix + "_httpLog_FF.txt"
			#call(enaHttpLog, shell=True)
			#call(enaHttpLog2, shell=True)

			# start firefox
			print time.time(), ' start firefox'
			browser = webdriver.Firefox(capabilities=caps)

		# set window size
		browser.set_window_position(0,0)
		browser.set_window_size(3840, 2260) #7000,4000 / 5920,2880 / 3840, 2260 / 2960,1440
		time.sleep(5)

		# read in js
		jsFile = open('/opt/monroe/getVideoInfos.js', 'r')
		js = jsFile.read()
		jsFile.close

		# open webpage
		print time.time(), ' start video ', ytid
		timeStartVideo = int(round(time.time() * 1000))
		browser.get(url)
		# time.sleep(1)

		# inject js
		browser.execute_script(js)

		#calculate duration
		if (duration <= 0):
			duration = browser.execute_script('return document.getElementsByTagName("video")[0].duration;');
		time.sleep(duration)
		filename_screenshot = resultDir + prefix + '_screenshot.png'
		browser.get_screenshot_as_file(filename_screenshot)
		print time.time(), " video playback ended"

		# get infos from js and write to file
		print time.time(), " write output to file"

		# print time.time(), " -- errorLog"
		# errorLog = browser.execute_script('return document.getElementById("divLog").innerHTML;')
		# with open(resultDir + prefix + '_errorLog.txt', 'w') as f:
		# 	f.write(errorLog.encode("UTF-8"))
		print time.time(), " -- debug"
		debugLog = browser.execute_script('return document.getElementById("divLog").innerHTML;')
		with open(resultDir + prefix + '_debug.txt', 'w') as f:
			f.write(debugLog.encode("UTF-8"))

		print time.time(), " -- measurementData"
		out = browser.execute_script('return document.getElementById("outC").innerHTML;')
		outE = browser.execute_script('return document.getElementById("outE").innerHTML;')
		with open(resultDir + prefix + '_buffer.txt', 'w') as f:
			f.write(str(timeStartVideo)+ '#0#0#0\n' )
			f.write(out.encode("UTF-8"))
		with open(resultDir + prefix + '_events.txt', 'w') as f:
			f.write(outE.encode("UTF-8"))

		# close browser and stop display
		browser.close()
		print time.time(), ' finished firefox'
		display.stop()
		print time.time(), 'display stopped'

	except Exception as e:
		# handle exception
		print time.time(), ' exception thrown'
		print e
		ts = time.time()
		st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H-%M-%S')
		print st
		display.stop()


	return ""

