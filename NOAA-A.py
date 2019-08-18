import requests
import json
import time
import os
#apiKey K5AYJP-4HLLAN-DKE6WR-45RP
apiKey="add-api-key-here"

#NOAA-15
#id=25338
noaaId15=25338

#NOAA-18
#id=28654
noaaId18=28654

#NOAA-19
#id=33591
noaaId19=33591

#Meteor M2
#id=40069
m2Id=40069

#Meteor M2-2
#id= 44387
m22Id=44387
#Api format for overhead pass
#/visualpasses/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{days}/{min_visibility}


homeLat=#Add location Latitude Here in decimal form


homeLng=#Add location Latitude Here in decimal form

#LocalTimeZones

SatList=[25338,28654,33591]
def ApiString(id,lat,lng,alt,days,minElevation,key):
    return("http://www.n2yo.com/rest/v1/satellite/radiopasses/"+str(id)+"/"+str(lat)+"/"+str(lng)+"/"+str(alt)+"/"+str(days)+"/"+str(minElevation)+"/&apiKey="+key)

def ApiCall(ApiStr): #returns the json
    response=requests.get(ApiStr)
    data=response.json()
    return(data)

def PassesTimesUnix(jsonS,id): #Takes the satellite Api json then returns the radio passes in the form (NoaaId,Duration(s),Start,End)
    passnum=jsonS["info"]["passescount"]
    passTimesUnix=[]
    for i in range(0,passnum):
        start=int(jsonS["passes"][i]["startUTC"])
        end=int(jsonS["passes"][i]["endUTC"])
        passTimesUnix.append((id,end-start,start,end))
    return(passTimesUnix)

def PassesTimesUnixHome(id):
    ApiString1= ApiString(id,homeLat, homeLng,0,1,10,apiKey)
    json1=ApiCall(ApiString1)
    return(PassesTimesUnix(json1,id))

def StartSort(val):
    return(val[2])

def SatListHome(SatList): #returns a list of all the passes a day in advance in the form of [(NoaaId,Duration(s),Start,End),(NoaaId,Duration(s),Start,End)] from closest start to farthest
    PassList=[]
    for id in SatList:
        PassList=PassList+PassesTimesUnixHome(id)
    PassList.sort(key= StartSort)
    return(PassList)

def IdtoF(id):
    if(id==25338):
        return(137620000)
    if(id==28654):
        return(137912500)
    if(id==33591):
        return(137100000)

def IdtoN(id):
    if(id==25338):
        return("NOAA15")
    if(id==28654):
        return("NOAA18")
    if(id==33591):
        return("NOAA19")

def Automation():
    PassList=[time.time()]+[SatListHome(SatList)[0]]
    while(True):
        if(time.time() >= PassList[1][2]):
            idS=PassList[1][0]
            FileName= IdtoN(idS)+"_"+str(int(time.time()))
            os.system("timeout "+str(PassList[1][1])+ " rtl_fm -f " + str(IdtoF(idS))+" -g 49.6 -s 48k -E deemp -F 9 - | sox -t raw -e signed -c 1 -b 16 -r 48000 - "+FileName+".wav rate 11025")
            print("PASS:"+FileName)
            os.system("noaa-apt --no-sync -p fast -o "+FileName+".png "+FileName+".wav" )
            PassList=[time.time()]+[SatListHome(SatList)[0]]
        if(time.time()-PassList[0]>3600):
            print("Timed Out")
            PassList=[time.time()]+[SatListHome(SatList)[0]]
while(True):
    try:
        Automation()
    except:
        print("Encountered an Error Trying Again")
