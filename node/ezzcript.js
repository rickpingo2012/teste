const fs = require('fs')
const readline = require('readline/promises')
const { stdin: input, stdout: output } = require('process')

// Erro simples da linguagem EzzCript.
function EzzcriptError(mensagem, linha) {
  console.error(`EzzcriptError[linha ${linha}]: ${mensagem}`)
  process.exit(1)
}

// Pede um valor ao usuário e retorna a resposta.
async function askInput(prompt, rl) {
  return await rl.question(prompt + ' ')
}

async function runEzzcript(filePath) {
  if (!fs.existsSync(filePath)) {
    EzzcriptError(`Arquivo não encontrado: ${filePath}`, 0)
  }

  const fileStream = fs.createReadStream(filePath)
  const rlInterativo = readline.createInterface({ input, output })
  const rlArquivo = readline.createInterface({ input: fileStream, crlfDelay: Infinity })

  const variaveis = {}
  let linhaAtual = 0

  for await (const linha of rlArquivo) {
    linhaAtual++
    const trimmed = linha.trim()
    if (!trimmed || trimmed.startsWith('//')) continue

    const [comand, ...resto] = trimmed.split(' ')
    const args = resto.join(' ')

    if (comand === '$') {
      // Imprime variável ou texto literal.
      if (args in variaveis) {
        console.log(variaveis[args])
      } else {
        console.log(args)
      }

    } else if (comand === 'int') {
      // int nome = valor
      const [varName, varValue] = args.split('=')
      if (!varValue) {
        EzzcriptError(`Falta '=' na declaração: ${args}`, linhaAtual)
      }

      const nome = varName.trim()
      let valor = varValue.trim()

      if (valor.startsWith('#')) {
        const prompt = valor.substring(1).trim()
        const inputValue = await askInput(prompt, rlInterativo)
        if (!isNaN(inputValue)) {
          variaveis[nome] = Number(inputValue)
          continue
        }
        EzzcriptError(`Valor de entrada inválido para tipo int: ${inputValue}`, linhaAtual)
      }

      if (!isNaN(valor)) {
        if (nome in variaveis) {
          if (typeof variaveis[nome] === 'number') {
            variaveis[nome] = Number(valor)
          } else {
            EzzcriptError(`Não é possível atribuir tipo diferente: ${nome}`, linhaAtual)
          }
        } else {
          variaveis[nome] = Number(valor)
        }
      } else {
        EzzcriptError(`Valor inválido para tipo int: ${valor}`, linhaAtual)
      }

    } else if (comand === 'bool') {
      // bool nome = true|false
      const [varName, varValue] = args.split('=')
      if (!varValue) {
        EzzcriptError(`Falta '=' na declaração: ${args}`, linhaAtual)
      }

      const nome = varName.trim()
      const valor = varValue.trim().toLowerCase()
      const isTrue = valor === 'true'
      const isFalse = valor === 'false'

      if (nome in variaveis) {
        if (typeof variaveis[nome] !== 'boolean') {
          EzzcriptError(`Não é possível atribuir tipo diferente: ${nome}`, linhaAtual)
        }
      }

      if (isTrue) {
        variaveis[nome] = true
      } else if (isFalse) {
        variaveis[nome] = false
      } else {
        EzzcriptError(`Valor inválido para tipo bool: ${valor}`, linhaAtual)
      }

    } else if (comand === 'str') {
      // str nome = texto ou #prompt
      const [varName, varValue] = args.split('=')
      if (!varValue) {
        EzzcriptError(`Falta '=' na declaração: ${args}`, linhaAtual)
      }

      const nome = varName.trim()
      let valor = varValue.trim()

      if (valor.startsWith('#')) {
        const prompt = valor.substring(1).trim()
        const inputValue = await askInput(prompt, rlInterativo)
        variaveis[nome] = inputValue
        continue
      }

      if (nome in variaveis) {
        if (typeof variaveis[nome] !== 'string') {
          EzzcriptError(`Não é possível atribuir tipo diferente: ${nome}`, linhaAtual)
        }
      }
      variaveis[nome] = valor

    } else {
      EzzcriptError(`Comando desconhecido: ${comand}`, linhaAtual)
    }
  }

  rlArquivo.close()
  rlInterativo.close()
}

const sourceFile = process.argv[2] || 'bash.ez'
if (!sourceFile.endsWith('.ez')) {
  EzzcriptError('Use um arquivo com extensão .ez como argumento.', 0)
}

runEzzcript(sourceFile)
