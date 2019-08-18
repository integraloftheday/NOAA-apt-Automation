# NOAA-apt-Automation
A simple python script that atomaticaly records and decodes NOAA Weather Satelite images based on Rtl_fm for recording and NOAA-apt for decoding. 

## Requirements
### Hardware
1. SDR dongle based on RTL2832
2. An Antenna for 137 MHz Satellite Transmitions. A simple design can be found [here.](https://lna4all.blogspot.com/2017/02/diy-137-mhz-wx-sat-v-dipole-antenna.html)
### Dependiences 
1. A [N2YO](n2yo.com) api key
#### System Level
1. [rtl_fm](https://manpages.ubuntu.com/manpages/trusty/man1/rtl_fm.1.html)
2. [sox](https://manpages.ubuntu.com/manpages/bionic/man1/sox.1.html) 
3. [noaa-apt](https://noaa-apt.mbernardi.com.ar/)
#### Python Packages
1. requests 
2. json (included in python3)
3. time (included in python3)
4. os (included in python3)

## Installation 
On any linux based system used the package manager to download and install the system level dependiences. **Note** [noaa-apt](https://noaa-apt.mbernardi.com.ar/) has to be downloaded from the website for use on Raspberry Pi's. I would recomend adding the no GUI version to PATH to ease the use.
For example on Ubuntu, Debian, Mint, and PopOS based systems:
```
  sudo apt-get install rtl_fm
  sudo apt-get install sox
  sudo apt-get install noaa-apt
  ```
Next step is to install the needed python packages that can be done by using `pip3` or just `pip` depending on if you have python2 installed. 
```
  pip3 install requests
```
A [N2YO](n2yo.com) api-key needs to be generated before running the code. This can be accomplished by going to [N2YO.com](n2yo.com) creating an acount and then generating an key. This will be used for tracking infromation. 

## Modifications
Before running `NOAA-A.py` a few lines need to be modified. Open the file in a text editor and modify the following lines
```
  apiKey="add-api-key-here"
```
  and 
```
  homeLat=#Add location Latitude Here in decimal form

  homeLng=#Add location Latitude Here in decimal form
```
Making sure to add the api-key generated in the previous steps and the Lat/Long of the antenna. 

## Running
Run the program by 
``` 
python3 NOAA-A.py
```
The script then will fill its directory with both the .wav recording and the .png files for every pass of NOAA15, NOAA18 and NOAA19. The outputed files would be created in the following format `NOAA#_UNIXTIMESTAMP.png or .wav`. Due to error catching the entire terminal needs to be halted. 


