const fs = require('fs'), getFlag = require('./flag') // Importação do FileSystem e do GetFlag

// Declaração do Objeto de conversão
const Convert = {
	// Método para conversão de títulos
	headerLine(line){
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
	},

	// Método para conversão de parágrafos
	paragraphLine(line){
		newText = newText + `		<p>${line}</p>\n`
	},

	// Método para conversão de listas não ordenadas
	newUl(newUl){
		newText = newText + `		<ul>\n`
		for(let li of newUl){
			newText = newText + `			<li>${li}</li>\n`
		}
		newText = newText + `		</ul>\n`

		newUl = []
	},

	// Método para conversão de listas ordenadas
	newOl(newOl){
		newText = newText + `		<ol>\n`
		for(let li of newUl){
			newText = newText + `			<li>${li}</li>\n`
		}
		newText = newText + `		</ol>\n`

		newOl = []
	}
}

// Declaração das variáveis file(Que vai receber o caminho/nome do arquivo) e newText(Que vai armazenar o texto convertido)
let file, newText = `<!DOCTYPE html>
<html lang="en">
	<head>
    	<meta charset="UTF-8">
    	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    	<title>Document</title>
	</head>
	<body>
`

// Caso tenham mais de 3 processos rodando, a flag -p deve ser informada para a captura do caminho e do nome do arquivo
if(process.argv.length > 3) {
	file = getFlag('-p')
	
	let path = file.split('/'), tempName = path.pop(-1)
	var nameFile = tempName[0] + '.html'
} else { // Senão, será pego o nome do arquivo e capturado seu nome
	file = process.argv[2]

	let tempName = file.split('.')
	var nameFile = tempName[0] + '.html'
}

// FileSystem começa a ler o arquivo informado caso exista
fs.readFile(file, { encoding: 'utf-8', flag: 'r' }, function (err, data) {
	if(err) throw console.log(err)
	else{
		// Caso não haja erros, será feito uma leitura do arquivo linha por linha
		let text = data.split('\n'), newUl = [], newOl = [], beforeLine = ""
		for(let line of text){

			// Se a linha estiver vazia, quebre a linha e prossiga
			if (line == "") newText = newText + '\n'
			
			// Se a linha começar com '#', converta para título
			else if(line[0] == '#') Convert.headerLine(line)

			// Se a linha iniciar com '*' ou '-' ou '+' armazaene como parte de uma lista ul lista
			else if(line[0] == '*' || line[0] == '-' || line[0] == '+') newUl.push(line.slice(2))

			// Se a linha iniciar com um número e um ponto armazaene como parte de uma lista ul lista
			else if(typeof(line[0]) == Number && line[1] == ".") newOl.push(line.slice(3))
			
			// Senão, converta como um parágrafo
			else Convert.paragraphLine(line)

			//Conversão de listas ordenadas e não ordenadas
			if((line[0] != '*' && line[0] != '-' && line[0] != '+') && (beforeLine[0] == '*' || beforeLine[0] == '-' || beforeLine[0] == '+')) Convert.newUl(newUl)
			
			else if((line[0] != '*' && line[0] != '-' && line[0] != '+') && (typeof(beforeLine[0]) == number && beforeLine[1] == ".")) Convert.newOl(newOl)

			beforeLine = line
			
		}

		newText = newText + `	</body>\n</html>`

		// FileSystem recebe o nome do arquivo a ser escrito e o escreve
		fs.writeFile(nameFile, newText, { encoding: 'utf-8', flag: 'w' }, function(err){
			if(err) throw console.log(err)

			// Caso não haja erros exiba:
			else console.log("Conversion completed!!")
		})
	}
})
