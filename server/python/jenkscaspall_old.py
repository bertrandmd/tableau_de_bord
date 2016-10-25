#!/usr/bin/env python
# -*-coding:UTF-8 -*
"""

Discrétisation d'un fichier csv selon Jenks_Caspall (Fisher_Jenks)
==================================================================
Auteur : BMD, Air Languedoc-Roussillon

Dernière MAJ : 06/06/2016

#usage: creationMBtiles_routine.py [-h] [-o OPT] [-n NORM] [-t] [-c fichier] [-d]
#optional arguments:
 # -h, --help            show this help message and exit
 # -o OPT, --opt OPT     choix de la discrétisation, jc ou fj
 # -n NORM, --norm NORM     choix de la normalisation, hab ou km2
 # -t, --tilemill        lance la commande tilemill d'export de MBtiles
 # -d, --dictionnaire    utilisation du dictionnaire des polluants
 # -c fichier, --config fichier
#                        nom du fichier de conf


#Utilisation : python creationMBtiles_routine.py [-c conf.cfg] [-o jc] [-n hab] [-t] [-d]


"""

#import os
#import pysal, scipy
import numpy as np
#import argparse
import sys


#le premier argument est le polluant
#le second argument est la methode (cadastre ou commune)
arg = sys.argv
polluant = arg[1]
ratio = arg[2]
cible = arg[3]
annee = arg[4]
#polluant :

#print arg[1]

#Initialisation du parsage
#parser = argparse.ArgumentParser(description='Initialisation du fichier de conf')

#from pysal.esda.mapclassify import Fisher_Jenks as fj
from pysal.esda.mapclassify import Jenks_Caspall as jc

#ds = np.DataSource()
from urllib2 import urlopen
import json


#response = urlopen('http://0.0.0.0:3000/api/hello')
#url = 'http://0.0.0.0:3000/api/getCadastrePolluant?pol='
if cible == 'cadastre' :
    url = 'http://172.16.18.146:3001/cgi/getCadastrePolluant?pol='
elif cible == 'commune' :
    url = 'http://172.16.18.146:3001/cgi/getCommunesPolluantparCommune?ratio='
    url += ratio
    url += '&pol='

url += polluant
url += '&annee=' + annee
#print url
response = urlopen(url) #'http://0.0.0.0:3000/api/getCadastrePolluant?pol=NOX')
#toto = ds.open('0.0.0.0:3000/api/hello')

data = json.load(response)
#print data['data']

val = []
for value in data['data']:
    val.append(value['emi']*1000)

#print val
val2 = np.array(val)
#print reponse.read()
result =jc(val2,7)

#print result.bins

bounds = range(0, 7)

for i in range(0, 7):
    bounds[i] = int(result.bins[i])


print bounds



#reponse.close()
'''
data = np.genfromtxt('~/valnox.csv',delimiter=',')
result =jc(data,7)

bounds = range(0, 7)

for i in range(0, 7):
    bounds[i] = int(result.bins[i])


print bounds
'''
