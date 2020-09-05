import os
import sys
import time 
import Adafruit_DHT

hud, temp = Adafruit_DHT.read_retry(11, 4)
os.system("echo "+str(int(time.time()))+","+str(temp)+","+str(hud)+" >> ../../tempData.csv")