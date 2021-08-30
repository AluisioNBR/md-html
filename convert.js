const Convert = {
	// Método para conversão de títulos
	headerLine(line, newText){
		const conditions = [
			line[0] == '#' && line[1] == '#' && line[2] == '#' && line[3] == '#' && line[4] == '#' && line[5] == '#',
			line[0] == '#' && line[1] == '#' && line[2] == '#' && line[3] == '#' && line[4] == '#',
			line[0] == '#' && line[1] == '#' && line[2] == '#' && line[3] == '#',
			line[0] == '#' && line[1] == '#' && line[2] == '#',
			line[0] == '#' && line[1] == '#',
		]

		if(conditions[0]) newText = newText + `		<h6>${line.slice(7)}</h6>\n`
		
		else if(conditions[1]) newText = newText + `		<h5>${line.slice(6)}</h5>\n`
		
		else if(conditions[2]) newText = newText + `		<h4>${line.slice(5)}</h4>\n`
		
		else if(conditions[3]) newText = newText + `		<h3>${line.slice(4)}</h3>\n`
		
		else if(conditions[4]) newText = newText + `		<h2>${line.slice(3)}</h2>\n`
		
		else newText = newText + `		<h1>${line.slice(2)}</h1>\n`

        return newText
	},

	// Método para conversão de blocos de citação
	blockquotes(line, newText){
		newText = newText + `		<blockquote>
			<p>${line.slice(2)}</p>
		</blockquote>`

		return newText
	},

	// Método para conversão de parágrafos
	paragraphLine(line, newText){
		newText = newText + `		<p>${line}</p>\n`

        return newText
	},

	// Método para conversão de listas não ordenadas
	newUl(newUl, newText){
		newText = newText + `		<ul>\n`
		for(let li of newUl){
			newText = newText + `			<li>${li}</li>\n`
		}
		newText = newText + `		</ul>\n`

        return newText
	},

	// Método para conversão de listas ordenadas
	newOl(newOl, newText){
		newText = newText + `		<ol>\n`
		for(let li of newOl){
			newText = newText + `			<li>${li}</li>\n`
		}
		newText = newText + `		</ol>\n`

        return newText
	},

	newCheckList(newCheckList, newText){
		newText = newText + `		<form>\n`
		for (let input of newCheckList) {
			newText = newText + `			${input}`
		}
		newText = newText + `		</form>\n`

		return newText
	}
}

module.exports = Convert