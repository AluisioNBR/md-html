const fs = require('fs'), Convert = require('./convert') // Importação do FileSystem e do objeto Convert

// Declaração das variáveis file(Que vai receber o caminho/nome do arquivo), newText(Que vai armazenar o texto convertido), e o armazenamento do nome do novo arquivo na variável nameFile
let file = process.argv[2], tempName = file.split('.'), nameFile = tempName[0] + '.html', newText = `<!DOCTYPE html>
<html lang="en">
	<head>
    	<meta charset="UTF-8">
    	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    	<title>Document</title>
	</head>
	<body>
`

// FileSystem começa a ler o arquivo informado caso exista
fs.readFile(file, { encoding: 'utf-8', flag: 'r' }, function (err, data) {
	if(err) throw console.log(err)
	else{
		// Caso não haja erros, será feito uma leitura do arquivo linha por linha
		let text = data.split('\n'), newUl = [], newOl = [], beforeLine = ""
		for(let line of text){
			let lineNum = Number(line[0]), beforeLNum = Number(beforeLine[0])

			// Se a linha estiver vazia, quebre a linha e prossiga
			if (line == "") newText = newText + '\n'
			
			// Se a linha começar com '#', converta para título
			else if(line[0] == '#') newText = Convert.headerLine(line, newText)

			// Se a linha iniciar com '*' ou '-' ou '+' armazaene como parte de uma lista ul lista
			else if(line[0] == '*' || line[0] == '-' || line[0] == '+') newUl.push(line.slice(2))

			// Se a linha iniciar com um número e um ponto armazaene como parte de uma lista ul lista
			else if((typeof(lineNum) == "number" && !isNaN(lineNum)) && line[1] == ".") newOl.push(line.slice(3))
			
			// Senão, converta como um parágrafo
			else newText = Convert.paragraphLine(line, newText)

			//Conversão de listas ordenadas e não ordenadas
			if((line[0] != '*' && line[0] != '-' && line[0] != '+') && (beforeLine[0] == '*' || beforeLine[0] == '-' || beforeLine[0] == '+')) newText = Convert.newUl(newUl, newText)
			
			else if((isNaN(lineNum) && line[1] != ".") && ((typeof(beforeLNum) == "number" && !isNaN(beforeLNum) && beforeLine[1] == "."))) newText = Convert.newOl(newOl, newText)

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
