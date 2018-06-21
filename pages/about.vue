<template>
  <section>
    <h1>About</h1>
		<h2>The Site</h2>
		<p style="font-style: italic;">Ngā Ingoa o Aotearoa (The Names of New Zealand) is probably the first "pronouncing dictionary" that is literally "pronouncing". The 10,200 <a href="/name">names</a> are spoken by 132 native <a href="/speaker">speakers</a> of Māori, chosen by each other as the best speakers for their areas.</p>
		<img src="/media/images/speaker/collage.jpg" class="pull-right img-thumbnail img-responsive" style="margin-left: 20px;" itemprop="image">
		<p>They include such famous names as <a href="/speaker/johnr">John Rangihau</a>, <a href="/speaker/wiremu">Wiremu Parker</a>, <a href="/speaker/billk">Bill Kere Kere</a>, <a href="/speaker/ruka">Ruka Broughton</a>, <a href="/speaker/eruera">Eruera Manuera</a>, <a href="/speaker/tupi">Tupi Puriri</a>, <a href="/speaker/magda">Magda Wallscott</a>, <a href="/speaker/island">Island Love</a>, and <a href="/speaker/matenga">Matenga Baker</a>. Mainly elders, most of the speakers have since died. Because they say only names in their own <a href="/region">areas</a>, local accents are automatically accommodated.</p>
		<p>The list includes geographic features down to the larger <a href="/feature/hill">hills</a> and <a href="/feature/stream">streams</a>, all <a href="/feature/settlement">human settlements</a>, <a href="/feature/suburb">suburbs</a> and <a href="/feature/school">schools</a>, <a href="/feature/marae">marae</a>, <a href="/feature/meetinghouse">meeting houses</a> and <a href="/feature/dininghall">dining halls</a> and many other <a href="/feature">features</a>. The <a href="/island/south">South Island</a> volume includes the original Māori names of many features now known by English ones.</p>
		<p>The names are sorted into 177 clearly defined "<a href="/zone">Zones</a>", and are in alphabetical order within each Zone, so that any name can be found quickly. Originally booklets for each region indexed the names alphabetically and by Zone, and a map of the Zones was enclosed with each cassette. The dictionary is intended especially for broadcasters and those who have to speak in public, but everyone who wants to pronounce placenames as Māori words will find it valuable.</p>
		<p><a href="/author">Hugh Young</a> took ten years of his spare time recording and editing the dictionary, after securing the approval of trust boards and tribal authorities throughout the country. He made two tours of the lower <a href="/island/north">North Island</a> in 1984 to record <a href="/part/1">Part 1</a>, untold forays into the north in 1986-90 to record <a href="/part/2">Part 2</a>, and two journeys the length of the <a href="/island/south">South Island</a> in 1992 and 1993 to record <a href="/part/3">Part 3</a>.</p>
		<p>The dictionary does not give the names' meanings. That would take more than a lifetime, and would be done better by Māori in each area, since meanings involve mana and tapu to a much greater extent.</p>
		<p>Placename pronunciation is the one aspect of Māoritanga that every Pākehā has to deal with. If a Māori pronunciation of the names became standard, that would help support the language, this country's oldest human artifact and one of its endangered species.</p>
		<p>Ngā Ingoa o Aotearoa is <a href="https://archive.org/details/Nga_Ingoa_o_Aotearoa" target="_blank">on file at the Internet Archive</a>.</p>
		<h2>History</h2>
		<p>The information on this website was originally made available on three audio tapes, with accompanying booklets which detailed all the names that are spoken for each area. Audio was then made available on CDs, and later all the audio and the information from the first booklet was published on a website. This website has been created after much hard work from Hugh Young to digitise all his work contained in the original three booklets, and efforts have been made to preserve all the information that was encoded in the booklets.</p>
		<h2>The Author</h2>
		<p>Hugh Young was born in Christchurch and hated history at high school. He graduated in zoology and worked as a journalist and broadcaster in Christchurch, Auckland, Whangarei, Honiara (Solomon Islands), Gisborne, Napier and Wellington. As well as creating this oral dictionary, he has written a <a href="http://www.sil.org/resources/archives/2525" target="_blank">dictionary of Solomon Islands Pijin</a>. He lives on a cliff with a spectacular view of Kapiti and sometimes Ruapehu and/or Taranaki. He has no time for cats.</p>
		<div itemscope itemtype="http://schema.org/Person"><!--<img src="/images/hugh.jpg" class="pull-right img-thumbnail img-responsive" style="margin-left: 20px;" itemprop="image">--><p itemprop="description">{{bio}}</p><p>For further information contact <span itemprop="name">Hugh</span> via phone/fax <a href="tel:+64 4 239 9341" itemprop="faxNumber">+64 4 239 9341</a>, phone <a href="tel:+64 21 896 737" itemprop="telephone">+64 21 896 737</a> or email <a href="mailto:hugh@ingoa.nz" itemprop="email">hugh@ingoa.nz</a>.</p></div>
		<h2>The Data</h2>
		<p>The data on this website is available in the most popular formats for consumption by other software - XML and JSON. Any page on this site can be requested with a .xml or .json extension to receive the required version. Alternatively, a request to any page with an HTML Accept header of "application/xml" or "application/json" will cause the appropriate version of the data to be offered. For JSON requests, JSONP callbacks are allowed. As an example, you can check out the following pages: <ul><li><a href="/island/north.xml">http://ingoa.nz/island/north.xml</a></li><li><a href="/island/south.json">http://ingoa.nz/island/south.json</a></li><li><a href="/island/south.json?callback=test">http://ingoa.nz/island/south.json?callback=test</a></li></ul> For any questions or issues regarding the API, please email <a href="mailto:admin@ingoa.nz">admin@ingoa.nz</a>.</p>
  </section>
</template>
<script>
import axios from '~/plugins/axios'

export default {
	/*nuxtI18n: {
    paths: {
      en: '/about',
      mi: '/mo'
    }
  },*/
  head () {
    return {
      title: 'About'
    }
  }
}
</script>

<style scoped>
</style>
