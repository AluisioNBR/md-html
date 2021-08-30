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
		let text = data.split('\n'), newUl = [], newOl = [], newCheckList = [], codeBlockCount = 0, beforeLine = ""
		
		for(let line of text){
			let lineNum = Number(line[0]), beforeLNum = Number(beforeLine[0])
			const listUlCA = line[0] == '*' || line[0] == '-' || line[0] == '+'
			const listOlCA = (typeof(lineNum) == "number" && !isNaN(lineNum)) && line[1] == "."
			const listUlC = (line[0] != '*' && line[0] != '-' && line[0] != '+') && (beforeLine[0] == '*' || beforeLine[0] == '-' || beforeLine[0] == '+')
			const listOlC = (isNaN(lineNum) && line[1] != ".") && ((typeof(beforeLNum) == "number" && !isNaN(beforeLNum) && beforeLine[1] == "."))

			// Se a linha estiver vazia, quebre a linha e prossiga
			if (line == "") newText = newText + '\n'
			
			// Se a linha começar com '#', converta para título
			else if(line[0] == '#') newText = Convert.headerLine(line, newText)

			// Se a linha começar com um '>', converta para bloco de citação
			else if(line[0] == '>') newText = Convert.blockquotes(line, newText)

			// Se a linha começar com '```', inicie um novo bloco de código
			else if(line[0] == '`' && line[1] == '`' && line[2] == '`'){
				codeBlockCount++
				if(codeBlockCount == 1) newText = newText + `		<pre><code>\n`
				else if(codeBlockCount == 2) newText = newText + `		</code></pre>\n`; codeBlockCount = 0
			}

			else if(codeBlockCount == 1) newText = newText + `			${line}\n`

			// Se a linha iniciar com '*' ou '-' ou '+' e tiver um "[ ]" ou um "[x]"
			else if((listUlCA || listOlCA) && (line[2] == '[' && line[4] == ']')){
				if(line[3] == 'x') newCheckList.push(`<input type="checkbox" checked value="${line.slice(6)}">${line.slice(6)}<br>\n`)
				
				else newCheckList.push(`<input type="checkbox" value="${line.slice(6)}">${line.slice(6)}<br>\n`)
			}

			// Se a linha iniciar com '*' ou '-' ou '+' armazaene como parte de uma lista ul lista
			else if(listUlCA) newUl.push(line.slice(2))

			// Se a linha iniciar com um número e um ponto armazaene como parte de uma lista ul lista
			else if(listOlCA) newOl.push(line.slice(3))
			
			// Se o contador de bloco de código for 0, converta como um parágrafo
			else if(codeBlockCount == 0) newText = Convert.paragraphLine(line, newText)

			//Conversão de listas ordenadas e não ordenadas
			if((listOlC || listUlC) && (line[2] != '[' && line[4] != ']')){
				newText = newText + Convert.newCheckList(newCheckList, newText)
				newCheckList = []
			}

			else if(listUlC){
				newText = Convert.newUl(newUl, newText)
				newUl = []
			}
			
			else if(listOlC){
				newText = Convert.newOl(newOl, newText)
				newOl = []
			}

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
