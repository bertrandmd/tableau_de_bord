#!/usr/bin/env python
# -*-coding:UTF-8 -*

import numpy as np
import sys

#TODO : rajouter le nb de classe
#rajout de l'url
#le second argument est le polluant
#le 3e argument est la methode (cadastre ou commune)
arg = sys.argv
url = arg[1]
polluant = arg[2]
ratio = arg[3]
cible = arg[4]
annee = arg[5]

#from pysal.esda.mapclassify import Fisher_Jenks as fj
from pysal.esda.mapclassify import Jenks_Caspall as jc


from urllib2 import urlopen
import json


#url = 'http://0.0.0.0:3000/api/getCadastrePolluant?pol='
if cible == 'cadastre' :
    url += '/cgi/getCadastrePolluant?pol='
    #url = 'http://172.16.18.146:3001/cgi/getCadastrePolluant?pol='
elif cible == 'commune' :
    url += '/cgi/getCommunesPolluantparCommune?ratio='
    #url = 'http://172.16.18.146:3001/cgi/getCommunesPolluantparCommune?ratio='
    url += ratio
    url += '&pol='

url += polluant
url += '&annee=' + annee
#print url
response = urlopen(url)


data = json.load(response)

val = []
for value in data['data']:
    val.append(value['emi']*1000)

val2 = np.array(val)

result =jc(val2,7)

bounds = range(0, 7)

for i in range(0, 7):
    bounds[i] = int(result.bins[i])

print bounds
