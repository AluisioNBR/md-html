/*
* Exportar uma função chamada getFlag(), que receberá um argumento do tipo String.
* Essa função deverá buscar dentro do array process.argv a flag desejada, que é a String, e retornar o valor da flag.
*/

function getFlag(flag){
	const p = process.argv
	let i = p.findIndex((flagT) => flagT == flag)
	return p[i + 1]
}

module.exports = getFlag