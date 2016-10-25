var db = require('./db');
/*var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//var cn = {
//host: 'localhost', // server name or IP address;
//port: 5432,
//database: 'my_db_name',
//user: 'user_name',
//password: 'user_password'
//};
var connectionString = 'postgres://bertrand:beber@172.16.18.9:5432/MaBase';
//var connectionString = 'postgres://bertrand_mathieudaude:MgebAS9U@62.102.230.3:5432/icare_airlr_3.1';
var db = pgp(connectionString);//cn

*/

// add query functions
function convert(input){
  var output = ""
  for (i=0;i<input.length;i++){
    output += "'"+ input[i] + "'";
    i!==input.length-1?output += ",":0;
    //console.log(output);
  }
  return output
}
function convert2(input){
  var output = ""
  for (i=0;i<input.length;i++){
    output += 'sum("'+ input[i] + '") as "' + input[i] + '"';
    i!==input.length-1?output += ",":0;
    //console.log(output);
  }
  return output
}
function createCase(input,colonne){
  var output = ""
  for (var i=0; i < input.length; i++){
    output += "SUM(CASE WHEN " + colonne + " = '" + input[i] + "' THEN emi END) AS " + '"' + input[i] + '"'
    i!==input.length-1?output += ',':0;
    output += '\n'
  }
  return output
}

function getAllCommunes(req, res, next) {
  db.any(`SELECT * FROM crosstab(
    $$ SELECT numcom, polluant, annee_ref, sum(emi) FROM emissions_synthese.validation_commune2 where polluant = '${req.query.pol}' group by 1,2,3 ORDER BY 1,2 $$,
    $$ select distinct annee_ref from emissions_synthese.validation_commune2 m where annee_ref in ('2010','2012') order by annee_ref $$
  ) AS (
    numcom varchar(20),polluant varchar(4), "2010" real, "2012" real
  )`)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Ok'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}
function getAllCommunesAnnee(req, res, next) {
  //console.log(req.params.id);
  var comArray = req.params.id.split(",");
  var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []
  if (comArray.length >1){
    var entete = `'${req.query.nom}' as "numcom"`
  } else { var entete = `'${req.params.id}' as "numcom"`}

  //liste des polluants
  listepol = req.query.pol; //.split(","); => mod car on recupe desormais un array
  var listeIn = convert(listepol)

  //SUM(CASE WHEN ***)
  var listeCase = createCase(listepol,'polluant');

  //mod 8/06/2016 enlever NON_FR, UTCF
  var query = `
  SELECT numcom, annee_ref,
  ${listeCase}
  FROM emissions_synthese.validation_commune2
  WHERE numcom in (${listeInCom}) AND annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')
  GROUP BY 1,2
  ORDER BY numcom
  `

  db.any(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}
function getCommuneAnneePol(req, res, next) {
  var comArray = req.params.id.split(",");
  var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []
  if (comArray.length >1){
    var entete = `'${req.query.nom}' as "numcom"`
  } else { var entete = `'${req.params.id}' as "numcom"`}

  //liste des polluants
  listepol = req.query.pol; //.split(","); => mod car on recupe desormais un array
  var listeIn = convert(listepol)

  //SUM(CASE WHEN ***)
  var listeCase = createCase(listepol,'polluant');

  //mod 8/06/2016 enlever NON_FR, UTCF
  var query = `
  SELECT ${entete}, annee_ref,
  ${listeCase}
  FROM emissions_synthese.validation_commune2
  WHERE numcom in (${listeInCom}) AND annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')
  GROUP BY 1,2
  ORDER BY numcom
  `
  //console.log(query);
  db.one(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getCommunePolluant(req, res, next) {
  var comArray = req.params.id.split(",");
  var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []
  if (comArray.length >1){
    var entete = `'${req.query.nom}' as "numcom"`
  } else { var entete = `'${req.params.id}' as "numcom"`}

  //SUM(CASE WHEN ***)
  liste_annees = ["2010","2012"]
  var listeCase = createCase(liste_annees,'annee_ref');
  var query = `
  SELECT ${entete}, polluant,
  ${listeCase}
  FROM emissions_synthese.validation_commune2
  WHERE numcom in (${listeInCom}) AND polluant = '${req.query.pol}
  GROUP BY 1,2
  ORDER BY numcom
  `
  //console.log(query);
  db.one(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getCommunePolluantSecteur(req, res, next) {
  var comArray = req.params.id.split(",");
  var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []
  if (comArray.length >1){
    var entete = `'${req.query.nom}' as "numcom"`
  } else { var entete = `'${req.params.id}' as "numcom"`}

  //SUM(CASE WHEN ***)
  liste_secteurs = ["AGRISY","EXTREN","RETECI","TROUTE","NON_FR","INDUST","UTCF","TR_AUT"]
  var listeCase = createCase(liste_secteurs,'secten_n1');

  var query = `
  SELECT ${entete}, polluant, annee_ref,
  ${listeCase}
  FROM emissions_synthese.validation_commune2
  WHERE numcom in (${listeInCom}) AND polluant = '${req.query.pol}' AND annee_ref = '${req.query.annee}'
  GROUP BY 1,2,3
  ORDER BY numcom
  `
  //console.log(query);
  db.one(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getCommunePolluantSecteurPct(req, res, next) {
  var comArray = req.params.id.split(",");
  var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []
  if (comArray.length >1){
    var entete = `'${req.query.nom}' as "numcom"`
  } else { var entete = `'${req.params.id}' as "numcom"`}

  //SUM(CASE WHEN ***)
  liste_secteurs = ["AGRISY","EXTREN","RETECI","TROUTE","NON_FR","INDUST","UTCF","TR_AUT"]
  var listeCase = createCase(liste_secteurs,'secten_n1');

  var query = `
  WITH
  pivot AS (
    SELECT ${entete}, polluant, annee_ref,
    ${listeCase}
    FROM emissions_synthese.validation_commune2
    WHERE numcom in (${listeInCom}) AND polluant = '${req.query.pol}' AND annee_ref = '${req.query.annee}'
    GROUP BY 1,2,3
    ORDER BY numcom
  ),
  sum_pivot AS (
    SELECT  ${entete}, polluant, annee_ref, sum(emi) AS emi_tot
    FROM emissions_synthese.validation_commune2
    WHERE numcom in (${listeInCom}) AND polluant = '${req.query.pol}' AND annee_ref = '${req.query.annee}'
    GROUP BY 1,2,3
  )
  SELECT ${entete},
  p.polluant,
  p.annee_ref,
  p."AGRISY"/s.emi_tot*100 as "AGRISY_PCT",
  p."EXTREN"/s.emi_tot*100 as "EXTREN_PCT",
  p."INDUST"/s.emi_tot*100 as "INDUST_PCT",
  p."NON_FR"/s.emi_tot*100 as "NON_FR_PCT",
  p."RETECI"/s.emi_tot*100 as "RETECI_PCT",
  p."TROUTE"/s.emi_tot*100 as "TROUTE_PCT",
  p."UTCF"/s.emi_tot*100 as "UTCF_PCT",
  p."TR_AUT"/s.emi_tot*100 as "TR_AUT_PCT"
  FROM pivot p , sum_pivot s`

  //console.log(query);
  db.one(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getCommunePolsSecteurs(req, res, next) {
  //pour colomn stack bar
  var comArray = req.params.id.split(",");
  var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []
  if (comArray.length >1){
    var entete = `'${req.query.nom}' as "numcom"`
  } else { var entete = `'${req.params.id}' as "numcom"`}

  //liste des polluants
  listepol = req.query.pol; //.split(","); => mod car on recupe desormais un array
  var listeIn = convert(listepol)

  //SUM(CASE WHEN ***)
  var listeCase = createCase(listepol,'polluant');

  //mod 8/06/2016 enlever NON_FR, UTCF
  //interet d'annee_ref ?
  var query = `
  SELECT ${entete}, annee_ref,secten_n1,
  ${listeCase}
  FROM emissions_synthese.validation_commune2
  WHERE numcom in (${listeInCom}) AND annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')
  GROUP BY 1,2,3
  ORDER BY numcom
  `
  //console.log(query);
  db.any(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}


function getCommunePolluantSousSecteur(req, res, next) {
  //query en 2 étapes
  //query sous la forme :
  /*select numcom,
  sum(case when secten_n2 = 'VP_E_C' then emi end) as "VP_E_C",
  sum(case when secten_n2 = 'VU_D_N' then emi end) as "VU_D_N",
  sum(case when secten_n2 = 'VP_ELE' then emi end) as "VP_ELE"
  FROM emissions_synthese.validation_commune_snap2
  where numcom in ('34172') and polluant = 'NOX' and annee_ref = '2012' and secten_n1 = 'TROUTE'
  group by numcom
  order by numcom;*/

  //recupere en-tête sous secteurs
  db.any(`select distinct secten_n2 from emissions_synthese.validation_commune_snap2 m where secten_n1 = '${req.query.secteur}' order by secten_n2;`)
  .then(function (data) {
    var liste_sousSecteurs = [];
    for (a in data){
      liste_sousSecteurs.push(data[a].secten_n2);
    }
    var comArray = req.params.id.split(",");
    var listeInCom = convert(comArray)
    //En-tête de colonne si id est un []
    if (comArray.length >1){
      var entete = `'${req.query.nom}' as "numcom"`
    } else {
      var entete = `'${req.params.id}' as "numcom"`
    }
    //IN (***)
    var listeInSousSecteurs = convert(liste_sousSecteurs);
    //SUM(CASE WHEN ***)
    var listeCase = createCase(liste_sousSecteurs,'secten_n2');

    var query =
    `SELECT ${entete}, polluant, annee_ref,
    ${listeCase}
    FROM emissions_synthese.validation_commune_snap2
    WHERE numcom in (${listeInCom}) AND polluant = '${req.query.pol}' AND annee_ref = '${req.query.annee}' AND secten_n1 = '${req.query.secteur}'
    GROUP BY 1,2,3
    ORDER BY numcom`

    //console.log(query);
    db.one(query)
    .then(function (data) {
      data.polluant = req.query.pol
      data.secten_n1 = req.query.secteur
      data.liste_sousSecteurs = liste_sousSecteurs
      res.status(200)
      .json({
        status: 'success',
        data: data,
        message: ''
      });
    })
    .catch(function (err) {
      //debug :
      //return next(err);
      return next(err);
    });
  });
}


function getOrderPolluant(req, res, next) {
  listepol = req.query.pol.split(",");
  var listeIn = ""
  //var listeCol =
  for (i=0;i<listepol.length;i++){
    listeIn += "'"+ listepol[i] + "'";
    i!==listepol.length-1?listeIn += ",":0;
  }
  db.any(`select distinct polluant from emissions_synthese.validation_commune2 m where polluant in (${listeIn}) order by polluant;`)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}


function getSousSecteur(req, res, next) {
  //console.log(req.query.secteur);
  db.one(`select distinct secten_n2 from emissions_synthese.validation_commune_snap2 m where secten_n1 = '${req.query.secteur}' order by secten_n2;`)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}


function getGrille(req, res, next) {
  var comArray = req.params.id.split(",");
  var polluant = req.query.pol;
  var listeInCom = convert(comArray)
  var query = `
  SELECT row_to_json(featcoll)
  FROM
  (SELECT 'FeatureCollection' As type, array_to_json(array_agg(feat)) As features
  FROM (SELECT 'Feature' As type,
  ST_AsGeoJSON(ST_Transform(c.the_geom,4326))::json As geometry,
  row_to_json((SELECT l FROM (SELECT gid) As l)
) As properties
FROM emissions_synthese.grille c
where ST_Intersects(c.the_geom,(
  select ST_Union(the_geom) from emissions_synthese.commune where	numcom in (${listeInCom}) and annee_ref = '2012'))
)  As feat
)  As featcoll;
`
var query2 = `
SELECT row_to_json(featcoll)
FROM
(SELECT 'FeatureCollection' As type, array_to_json(array_agg(feat)) As features
FROM (SELECT 'Feature' As type,
ST_AsGeoJSON(ST_Transform(c.the_geom,4326))::json As geometry,
row_to_json((SELECT l FROM (SELECT gid, sum(emi)*1000 as "${polluant}") As l)
) As properties
FROM emissions_synthese.grille c
join emissions_synthese.cadastre cad using(gid)
where ST_Intersects(c.the_geom,(
  select st_Union(the_geom) from emissions_synthese.commune
  where	numcom in (${listeInCom}) and annee_ref = '2012'
)) and polluant = '${polluant}'
group by gid, the_geom
)  As feat
)  As featcoll;
`
db.one(query2)
.then(function (data) {
  res.status(200)
  .json({
    status: 'success',
    data: data,
    message: ''
  });
})
.catch(function (err) {
  return next(err);
});
}

function getBigPie(req, res, next) {
  var comArray = req.params.id.split(",");
  var polluant = req.query.pol;
  var listeInCom = convert(comArray)
  var query = `
  with color as (
    select * from (values ('AGRISY','Agriculture & sylviculture' , '#90ee7e' ),
    ('INDUST' ,'Industrie & traitement des déchets' , '#DF5353' ),
    ('RETECI' ,'Résidentiel & tertiaire' , '#f28537' ),
    ('TROUTE' ,'Transport routier' , '#7798BF' ),
    ('TR_AUT' ,'Transports autres que routier' , '#aaeeee' ),
    ('EXTREN' ,'Production & distribution d''énergie' , '#F4FA58' )
  )as t(secteur,nom,color)
),
subrequest as (
  select row_to_json(d) as drilldown, d.name as secten_n1
  from (
    select
    aa.secten_n1 as name,
    array_to_json(array_agg(aa.secten_n2)) as categories,
    array_to_json(array_agg(round(aa.emi::numeric,5))) as data
    from (
      select a.secten_n1, a.secten_n2, sum(a.emi) as emi
      FROM emissions_synthese.validation_commune_snap2 a
      where  numcom in (${listeInCom}) AND polluant = '${polluant}' AND annee_ref = '${req.query.annee}'
      group by a.secten_n1, a.secten_n2
    ) aa
    group by aa.secten_n1
  ) d
),
emi as (
  select a.secten_n1, sum(a.emi) as y
  from emissions_synthese.validation_commune_snap2 a
  where numcom in (${listeInCom}) AND polluant = '${polluant}' AND annee_ref = '${req.query.annee}' and a.secten_n1 not in ('NON_FR', 'UTCF')
  group by a.secten_n1
)
select array_to_json(array_agg(row_to_json(t))) as data
from (
  select e.y,
  b.color as color,
  c.drilldown
  FROM emi e
  join color b on e.secten_n1 = b.secteur
  join subrequest c using(secten_n1)
) t;`
db.one(query)
.then(function (data) {
  res.status(200)
  .json({
    status: 'success',
    data: data,
    message: ''
  });
})
.catch(function (err) {
  return next(err);
});
}

function getCadastrePolluant(req, res, next) {
  //var comArray = req.params.id.split(",");
  //var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []

  //18/08/16 : ajout de "and annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')"
  var query = `
  SELECT sum(emi) as emi
  FROM emissions_synthese.cadastre
  WHERE polluant = '${req.query.pol}' AND emi IS NOT NULL and annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')
  group by gid
  `
  //console.log(query);
  db.any(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: ''
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getCommunesPolluantparCommune(req, res, next) {
  //var comArray = req.params.id.split(",");
  //var listeInCom = convert(comArray)
  //En-tête de colonne si id est un []

  //on recup l'arg de rationalisation de la valeur (surf_km ou popXXXX)
  var ratio = req.query.ratio || 'pop2013'


  //18/08/16 : ajout de "and annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')"
  var query = `
  SELECT sum(d.emi)/c.${req.query.ratio} as emi
  FROM emissions_synthese.validation_commune2 d
  JOIN emissions_synthese.info_com c
  using(numcom)
  WHERE polluant = '${req.query.pol}' AND emi IS NOT NULL and annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')
  group by numcom, ${req.query.ratio}
  `
  //console.log(query);
  db.any(query)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: query
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

//ajout pour chiffres et détails
function getTableau(req, res, next) {
  var comArray = req.params.id.split(",");
  var listeInCom = convert(comArray)
  console.log(listeInCom);
  //En-tête de colonne si id est un []
  if (comArray.length >1){
    var entete = `'${req.query.nom}' as "entite"`
  } else {
    var entete = `'${req.query.nom}' as "entite"`
  }
  var filter = comArray[0].substring(0, 2);
  var filterNom = filter == '11' ? 'Aude' : filter == '30' ? 'Gard' : filter == '34' ? 'Hérault' : filter == '48' ? 'Lozère' : filter == '66' ? 'Pyrénées-Orientales' : 0 ;

  var layer = req.query.layer;

  var query = `
  with emissions as (
    SELECT
    numcom ,
    sum(emi) as emi
    FROM
    emissions_synthese.validation_commune2
    WHERE polluant = '${req.query.pol}' and annee_ref = '${req.query.annee}' AND secten_n1 not in ('NON_FR','UTCF')
    GROUP BY numcom)
    Select
    1 as id,
    'Languedoc-Roussillon' as  entite,
    sum(pop2013) as pop,
    round(sum(surf_km),0) as surf,
    count(distinct code_insee) as nbcom,
    sum(d.emi) as emi
    from public.communes2016 c
    join emissions d on c.code_insee = d.numcom
    group by entite
    `
    layer !== 'reg' ? query += `
    UNION
    select
    2 as id,
    '${filterNom}' as entite,
    sum(pop2013) as pop,
    round(sum(surf_km),0) as surf,
    count(distinct code_insee) as nbcom,
    sum(d.emi) as emi
    from public.communes2016 c
    join emissions d on c.code_insee = d.numcom
    where code_insee like '${filter}%'
    group by entite` : 0 ;

    layer !== 'reg' && layer !== 'dept' && layer !== 'comcom' ? query += `
    UNION
    select
    3 as id,
    (select nom_comcom from cor_com_comcom2017 z where z.code_insee = ${listeInCom}) as "entite",
    sum(pop2013) as pop,
    round(sum(surf_km),0) as surf,
    count(distinct c.code_insee) as nbcom,
    sum(d.emi) as emi
    from public.communes2016 c
    join emissions d on c.code_insee = d.numcom
    join cor_com_comcom2017 e on c.code_insee =e.code_insee
    where e.nom_comcom= (select nom_comcom from cor_com_comcom2017 z where z.code_insee = ${listeInCom})
    group by entite
    UNION
    select
    4 as id,
    ${entete},
    sum(pop2013) as pop,
    round(sum(surf_km),0) as surf,
    count(distinct code_insee) as nbcom,
    sum(d.emi) as emi
    from public.communes2016 c
    join emissions d on c.code_insee = d.numcom
    where code_insee in (${listeInCom})
    group by entite
    `: 0 ;

    layer !== 'reg' && layer !== 'dept' && layer !== 'commune' ? query += `
    UNION
    select
    3 as id,
    ${entete},
    sum(pop2013) as pop,
    round(sum(surf_km),0) as surf,
    count(distinct code_insee) as nbcom,
    sum(d.emi) as emi
    from public.communes2016 c
    join emissions d on c.code_insee = d.numcom
    where code_insee in (${listeInCom})
    group by entite` : 0 ;

    query += `;`


    db.any(query)
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        data: data,
        message: ''
      });
    })
    .catch(function (err) {
      return next(err);
    });
  }

  function getMaillePolluantSecteur(req, res, next) {
    var comArray = req.params.id.split(",");
    var listeInCom = convert(comArray)
    //En-tête de colonne si id est un []
    if (comArray.length >1){
      var entete = `'${req.query.nom}' as "numcom"`
    } else { var entete = `'${req.params.id}' as "gid"`}

    //SUM(CASE WHEN ***)
    liste_secteurs = ["AGRISY","EXTREN","RETECI","TROUTE","NON_FR","INDUST","UTCF","TR_AUT"]
    var listeCase = createCase(liste_secteurs,'secten_n1');

    var query = `
    SELECT ${entete}, polluant, annee_ref,
    ${listeCase}
    FROM emissions_synthese.cadastre2
    WHERE gid in (${listeInCom}) AND polluant = '${req.query.pol}' AND annee_ref = '${req.query.annee}'
    GROUP BY 1,2,3
    ORDER BY gid
    `
    //console.log(query);
    db.one(query)
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        data: data,
        message: ''
      });
    })
    .catch(function (err) {
      return next(err);
    });
  }

  module.exports = {
    getBigPie : getBigPie,
    getTableau : getTableau,
    getMaillePolluantSecteur : getMaillePolluantSecteur,
    getCommunesPolluantparCommune : getCommunesPolluantparCommune,
    getCadastrePolluant : getCadastrePolluant,
    getGrille : getGrille,
    getCommunePolsSecteurs : getCommunePolsSecteurs,
    getCommunePolluantSousSecteur :getCommunePolluantSousSecteur,
    getSousSecteur: getSousSecteur,
    getOrderPolluant: getOrderPolluant,
    getCommunePolluantSecteur: getCommunePolluantSecteur,
    getCommunePolluantSecteurPct: getCommunePolluantSecteurPct,
    getAllCommunes: getAllCommunes,
    getCommunePolluant: getCommunePolluant,
    getAllCommunesAnnee: getAllCommunesAnnee,
    getCommuneAnneePol: getCommuneAnneePol
  };
