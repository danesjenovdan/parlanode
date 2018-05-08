<template>
  <style-scores
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.party"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead">
        Pogostost uporabe stilno zaznamovanih besed v govorih poslancev poslanske skupine.
      </p>
      <p class="info-text heading">
        METODOLOGIJA
      </p>
      <p class="info-text">
        Z združevanjem kvalifikatorjev <a class="funblue-light-hover" target="_blank" href="http://www.fran.si/130/sskj-slovar-slovenskega-knjiznega-jezika">SSKJ</a> in <a class="funblue-light-hover" target="_blank" href="http://www.fran.si/131/snb-slovar-novejsega-besedja">SNB</a> smo definirali ekscesno, privzdignjeno in preprosto besedje v poslanskih govorih.
      </p>
      <p class="info-text">
        Upoštevani so le kvalifikatorji, ki so v obeh slovarjih tik za zaglavjem in imajo doseg do konca geselskega sestavka (ne pa tudi kvalifikatorji za posamezne pomene oziroma rabe).
      </p>
      <p class="info-text">
        Podjetje <a class="funblue-light-hover" target="_blank" href="http://www.amebis.si/">Amebis</a> je iz transkriptov poslanskih govorov pripravilo sezname besed, ki imajo katerega od izbranih kvalifikatorjev.
      </p>
      <div class="info-text">
        Ekscesno besedje:
        <ul>
          <li>
            Kvalifikatorji iz SSKJ
            <ul>
              <li>vulgarno (vulg.), slabšalno (slabš.), ekspresivno (ekspr.), ironično (iron.), otroško (otr.)</li>
            </ul>
          </li>
          <li>
            Kvalifikatorji iz SNB
            <ul>
              <li>slabšalno (slabš.), vulgarno (vulg.)</li>
            </ul>
          </li>
        </ul>

        Privzdignjeno besedje
        <ul>
          <li>
            Kvalifikatorji iz SSKJ
            <ul>
              <li>evfemistično (evfem.), mitološko (mitol.), pesniško (pesn.), knjižno (knjiž.), zastarelo (zastar.), starinsko (star.)</li>
            </ul>
          </li>
        </ul>

        Preprosto besedje
        <ul>
          <li>
            Kvalifikatorji iz SSKJ
            <ul>
              <li>narečno (nar.), pogovorno (pog.), nižje pogovorno (nižje pog.)</li>
            </ul>
          </li>
          <li>
            Kvalifikatorji iz SNB
            <ul>
              <li>pogovorno (pog.)</li>
            </ul>
          </li>
        </ul>
      </div>
      <p class="info-text">
        Črtni graf prikazuje delež posameznega tipa besedja v govorih poslanske skupine glede na povprečje, izračunano za celoten sklic. Delež se izračuna po naslednjem algoritmu: vzamejo se vsi govori poslanske skupine, prešteje se število besed (in njihovih ponovitev) v vsaki kategoriji besedja. To se izvede za vse poslance, nato se deli vrednost kategorije za poslansko skupino z vrednostjo povprečja (seštevek vrednosti vseh poslancev, deljen s številom poslancev). Vrednost vsake kategorije za poslansko skupino se normalizira (min. 1 – max. 100).
      </p>
    </div>
  </style-scores>
</template>

<script>
import common from 'mixins/common';
import StyleScores from 'components/StyleScores.vue';

export default {
  name: 'StilneAnalize',
  components: {
    StyleScores,
  },
  mixins: [common],
};
</script>
