<table class="table">
<thead>
<tr>
<th><i class="fa fa-map-marker fa-fw"></i> </th>
<th><i class="fa fa-group fa-fw"></i>Habitants</th>
<th><i class="fa fa-empire fa-fw"></i>Surface Km<sup>2</sup></th>
<th><i class="fa  fa-institution fa-fw"></i>Communes</th>
<th><i class="fa  fa-table fa-fw"></i>Emissions</th>
<th><i class="fa  fa-male fa-fw"></i></th>
</tr>

</thead>
<tbody>
{{#entites}}
<tr> <!-- Region -->
<td>{{name}}</td>
<td nowrap>{{habitants}}</td><td nowrap>{{surface}}</td><td nowrap>{{nbcom}}</td><td nowrap>{{emi}}/an<br>
<div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:80%">80 % du département</div></div>
<div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:25%">25 % de la région</div></div></td>
<td nowrap>Soit 5/an/Habitant</td>
</tr>
 {{/entites}}
</tbody>
</table>
