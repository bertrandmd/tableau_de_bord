```bash
sudo su - postgres
createuser -P icare
createdb -O icare -E UTF-8 webmapping
psql -c "CREATE EXTENSION postgis" webmapping
psql -c "CREATE EXTENSION tablefunc" webmapping
exit
```
mysql -u sqlyog -psqlyog -h 172.16.18.5 webmapping_2010 --local

create table emission_2012v2016 as select * from emission_2010v2015 limit 1 ;
truncate emission_2012v2016;

load data local infile '/home/inventaire/emi_com_dataviz_2012.csv' into table emission_2012v2016 fields terminated by ',' lines terminated by '\n' IGNORE 1 LINES ;



sudo su postgres
exit

ssh bertrand_mathieudaude@62.102.230.3
tmux new 'psql ...'  tmux new 'psql icare_airlr_3.1'
\copy (SELECT emi.numcom,   emi.snap,   emi.napfue,   emi.polluant,   sum(emi.emi) AS emi,   emi.unites,   emi.annee_ref  FROM emissions_synthese.emissions_totales_commune emi GROUP BY emi.numcom, emi.snap, emi.napfue, emi.polluant, emi.unites, emi.annee_ref) to 'emi_com_dataviz.csv' with CSV HEADER;

\copy (SELECT emi.numcom,   emi.snap,   emi.napfue,   emi.polluant,   sum(emi.emi) AS emi,   emi.unites FROM emissions_synthese.emissions_totales_commune emi where emi.annee_ref = '2012' GROUP BY emi.numcom, emi.snap, emi.napfue, emi.polluant, emi.unites) to 'emi_com_dataviz_2012.csv' with CSV HEADER;

scp bertrand_mathieudaude@62.102.230.3:/home/bertrand_mathieudaude/emi_com_dataviz.csv /home/inventaire
SO2,CO,TSP,PM2_5,PM10,NH3,CO2,CH4,N2O,As,Cd,Ni,Pb,BaP,HAP,C6H6,COVNM



\copy (select * from public.emi_com_secten2) to 'emi_com_snap2.csv' with CSV HEADER;
\copy (select * from public.emi_com_secten1) to 'emi_com.csv' with CSV HEADER;
*va creer les fichiers dans le répertoire courant /home/bertrand_mathieudaude sur icare Limair
scp bertrand_mathieudaude@62.102.230.3:/home/bertrand_mathieudaude/cadastre_nox_2012.csv /home/inventaire
*copie le fichier sur le poste local
truncate table emissions_synthese.cadastre;

 create table emissions_synthese.cadastre2 (secten_n1 varchar(15), gid int, polluant varchar(10), emi real, unites varchar(8), annee_ref varchar(4));
\copy emissions_synthese.cadastre from 'emi_cadastre.csv' DELIMITER ',' CSV HEADER;
\copy emissions_synthese.cadastre2 from 'emi_cadastre.csv' DELIMITER ',' CSV HEADER;
\copy emissions_synthese.validation_commune_snap2 from 'emi_com_snap2.csv' DELIMITER ',' CSV HEADER;
\copy emissions_synthese.validation_commune2 from 'emi_com.csv' DELIMITER ',' CSV HEADER;



create table emissions_syntheses.info_com (numcom char(5), surf_km numeric, pop2010 integer, pop2012 integer, pop2013 integer);

\copy emissions_syntheses.info_com from 'communes.csv' CSV HEADER;



```bash
createuser -h 172.16.18.9 api -P -U postgres
createdb apiinventaire -h 172.16.18.9 -U postgres -O api -E UTF-8
psql -h 172.16.18.9 -U postgres apiinventaire -c "CREATE SCHEMA emissions_synthese"
psql -h 172.16.18.9 -U postgres apiinventaire -c "CREATE EXTENSION postgis"
psql -h 172.16.18.9 -U postgres -d apiinventaire < saveDB.sql
psql -h 172.16.18.9 -U postgres apiinventaire -c "GRANT SELECT,INSERT,UPDATE on table public.adherents to api"
psql -h 172.16.18.9 -U postgres apiinventaire -c 'GRANT USAGE ON SCHEMA emissions_synthese TO api;'
psql -h 172.16.18.9 -U postgres apiinventaire -c 'GRANT select ON ALL TABLES IN SCHEMA public TO api;'
psql -h 172.16.18.9 -U postgres apiinventaire -c 'GRANT select ON ALL TABLES IN SCHEMA emissions_synthese TO api;'
psql -h 172.16.18.9 -U postgres apiinventaire -c 'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api;'
psql -h 172.16.18.9 -U postgres apiinventaire -c 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO api;'
```


GRANT ... ON ALL TABLES IN SCHEMA ..
remplace :
psql -h 172.16.18.9 -U postgres apiinventaire -c "SELECT 'GRANT SELECT ON '||table_schema||'.'||table_name||' TO api;' \
FROM   information_schema.TABLES \
WHERE  table_type='BASE TABLE' \
AND    table_schema='emissions_synthese';" --tuples-only | psql -h 172.16.18.9 -U postgres -d apiinventaire

pg_dump --host 172.16.18.9 --port 5432 --username "postgres" --no-password --no-owner --format plain --verbose --file "saveDB.sql" --table "emissions_synthese.cadastre" --table "emissions_synthese.cadastre2" --table "emissions_synthese.commune" --table "emissions_synthese.grille" --table "emissions_synthese.info_com" --table "emissions_synthese.validation_commune2" --table "emissions_synthese.validation_commune_snap2" --table "emissions_synthese.validations_commune" --table "public.adherents" --table "public.communes2016" --table "public.cor_com_comcom2017" "MaBase"

//create copy
```bash
pg_dump --host 172.16.18.9 --port 5432 --username "postgres" --no-password --no-owner --format plain --verbose --file "saveDBapi.sql"  apiinventaire
createdb apiinventaireSvg -h 172.16.18.9 -U postgres -O api -E UTF-8
psql -h 172.16.18.9 -U postgres -d apiinventaireSvg < saveDBapi.sql
```
