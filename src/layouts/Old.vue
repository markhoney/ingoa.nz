<template>
	<section>
		<p align="center">
			<font size="6">
				<i>
					Ngā Ingoa o Aotearoa
				</i>
			</font>
		</p>
		<p align="center">
			<font size="5">
				An oral dictionary of Māori placenames
			</font>
		</p>

		<slot />

		<p>
			Copyright &copy; Hugh Young 1985, 1991 and 1994. The booklets and recordings may not be resold for profit. They may be copied for educational purposes. Copies should be clearly identified as such.
		</p>
		<p>
			<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/nz/">
				<img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-nd/3.0/nz/88x31.png" />
			</a>
			<br />
			<span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/Sound" property="dc:title" rel="dc:type">Ngā Ingoa o Aotearoa, an oral dictionary of Māori placenames</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="/old" property="cc:attributionName" rel="cc:attributionURL">Hugh Young</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/nz/">Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 New Zealand License</a>.
			<br />
			Based on a work at <a xmlns:dc="http://purl.org/dc/elements/1.1/" href="/old/contents" rel="dc:source">www.top.net.nz</a>.
		</p>
		<p>
			Ngā Ingoa o Aotearoa is on file at <a href= "http://www.archive.org">the Internet Archive</a> as Nga_Ingoa_o_Aotearoa.
		</p>
		<p>
			If you want to link to this page, feel free to copy this logo:
			<br />
			<br />
		</p>
		<p>
			<img src="/img/old/ingoaanim.gif" width="72" height="88" alt="Nga Ingoa animation" border="0" style="display: block; margin: auto;" />
		</p>
		<p>
			For further information contact Hugh Young, ph/fax +64 4 239-9341 or +64 21 896 737 or <a href="mailto:hugh [AT] buzz.net.nz">email</a>.
		</p>
	</section>
</template>

<style scoped>
	section {
		background-color: #ffffee;
		font-family: Ariel, Helvetica, sans-serif;
		font-size: 10pt;
		background-image: url('/img/old/whario3.gif');
		background-repeat: repeat;
	}
	p {
		margin-left: 5px;
		font-size: 12
	}
	a:link {color: #000099;}
	a:visited {color: #660099;}
	a:hover {color: #FF0000;}
	a:active {color: #FF9900;}

	li {font-size: 12}

	table.stat th, table.stat td {
		font-size : 10pt;
		font-family : "Myriad Web",Verdana,Helvetica,Arial,sans-serif;
	}

	/*ul {type=disc}*/
	h1 {font-size: 18pt; text-align:center;}
	h2 {font-size: 16pt; text-align:center;}
	h3 {font-size: 12pt; text-align:center;}
	h4 {font-size: 10pt; text-align:center;}
</style>
