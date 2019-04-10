<template>
	<section>
		<p align="center">
			<img src="/img/old/Aotearoa.gif" width="267" height="341" alt="Aotearoa" border="0">
		</p>
		<p>
			<i>Ng&#257; Ingoa o Aotearoa</i> (The Names of New Zealand) is probably the first "pronouncing dictionary" that is literally "pronouncing". The 10,200 names are spoken by 132 native speakers of M&#257;ori, chosen by each other as the best speakers for their areas.
		</p>

		<p>
			They include such famous names as John Rangihau, Wiremu Parker, Bill Kere Kere, Ruka Broughton, Eruera Manuera, Tupi Puriri, Magda Wallscott, Island Love, and Matenga Baker. Mainly elders, most of the speakers have since died. Because they say only names in their own areas, local accents are automatically accommodated.
		</p>

		<p>
			The list includes geographic features down to the larger hills and streams, all human settlements, suburbs and schools, marae, meeting houses and dining halls and many other features. The South Island volume includes the original M&#257;ori names of many features now known by English ones.
		</p>

		<p>
			The names are sorted into 177 clearly defined "Zones", and are in alphabetical order within each Zone, so that any name can be found quickly. Booklets for each region index the names alphabetically and by Zone, and a map of the Zones is enclosed with each cassette. The dictionary is intended especially for broadcasters and those who have to speak in public, but everyone who wants to pronounce placenames as M&#257;ori words will find it valuable.
		</p>

		<p>
			Hugh Young took ten years of his spare time recording and editing the dictionary, after securing the approval of trust boards and tribal authorities throughout the country. He made two tours of the lower North Island in 1984 to record Part 1, untold forays into the north in 1986-90 to record Part 2, and two journeys the length of the South Island in 1992 and 1993 to record Part 3.
		</p>

		<p>
			The dictionary does not give the names' meanings. That would take more than a lifetime, and would be done better by M&#257;ori in each area, since meanings involve mana and tapu to a much greater extent.
		</p>

		<table style="margin: auto;" cellpadding="10" bgcolor="#ccbb99" border="1">
			<tbody>
				<tr>
					<td style="padding: 10px;">
						<nuxt-link :to="localePath({name: 'old-contents'})"><b><font color="#800080">TO THE DICTIONARY</font></b></nuxt-link>
					</td>
				</tr>
			</tbody>
		</table>

		<p><b>In brief</b></p>

		<table style="margin: auto;" width="50%" cellpadding="5" border="0" bgcolor="#ffffee">
			<tbody>
				<tr>
					<td>
						<p>
							Part 1: <b>Te Upoko o te Ika</b> (Wellington, Manawatu, Rangitikei, Taupo, Whanganui, Taranaki, Wairarapa, Hawkes Bay, East Coast, Urewera); 59 Zones, 4500 names, 50 speakers (4 women), two 90 minute cassettes, recorded October - November 1984, funded by a Bill Toft Memorial grant, 4000 km approx. travelled, launched May 1985.
						</p>
						<p>
							Part 2: <b>Te Hiku o te Ika</b> (Bay of Plenty, Coromandel, Hauraki, King Country, Waikato, Auckland, Northland, Overseas); 80 Zones, 3500 names, 59 speakers (12 women), two 70 minute cassettes, recorded 1986-90 14,000 km approx. travelled, launched April 1991.
						</p>
						<p>
							Part 3: <b>Te Wai Pounamu</b> (Nelson, Marlborough, Canterbury, Otago, Southern Lakes, Southland, Southern Islands, Fiordland, West Coast, Chatham Islands); 38 Zones, 2200 names, 23 speakers (5 women), two cassettes (45 minutes and 55 minutes), recorded November 1992 - April 1993, funded by the NZ Lottery Board Heritage Fund and the Pacific Conservation and Development Trust, 5000 km approx. travelled, launched November 1994.
						</p>
						<p>
							Total distance travelled: 23,000 km approx - equivalent to driving to New York via London.
						</p>
						<p>
							Total track duration: 6 hours 30 minutes - longer than <i>G&ouml;tterd&auml;mmerung</i>!
						</p>
						<p>
							Commonest name: Te Aroha [meaning "love, compassion"] (13 separate occurrences).
						</p>
					</td>
				</tr>
			</tbody>
		</table>
		<p>
			Placename pronunciation is the one aspect of M&#257;oritanga that every P&#257;keh&#257; has to deal with. If a M&#257;ori pronunciation of the names became standard, that would help support the language, this country's oldest human artifact and one of its endangered species.
		</p>
	</section>
</template>


<script>
	export default {
		layout: 'old',
	};
</script>
