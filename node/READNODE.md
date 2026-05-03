# EzzCript

## Ambiente
- Node.js
- Executar com `node ezzcript.js <arquivo.ez>`
- Se nenhum arquivo for informado, o interpretador tenta abrir `bash.ez`

## Comandos
- `$ <expressão>`: imprime o valor da expressão ou o conteúdo de uma variável.
- `int nome = <valor ou expressão>`: declara ou atualiza um número inteiro.
- `bool nome = <true|false|expressão>`: declara ou atualiza um booleano.
- `str nome = <texto ou expressão>`: declara ou atualiza uma string.

## Entrada do usuário
- Ao declarar uma variável, use `#` antes da mensagem de prompt.
- Exemplo:
  - `int x = #Digite um número:`
  - `str nome = #Qual é seu nome?`

## Extensão de arquivo
- Agora o interpretador aceita qualquer arquivo `.ez` passado como argumento.
- Exemplo:
  - `node ezzcript.js calculator.ez`
  - `node ezzcript.js outro_programa.ez`

## Exemplo de programa de calculadora
```ez
// Calculadora EzzCript
int a = #Digite o primeiro número:
int b = #Digite o segundo número:
int soma = a + b
int subtracao = a - b
int multiplicacao = a * b
int divisao = a / b
$ Resultado da soma:
$ soma
$ Resultado da subtração:
$ subtracao
$ Resultado da multiplicação:
$ multiplicacao
$ Resultado da divisão:
$ divisao
```

## Observações
- O interpretador agora aceita expressões em atribuições, como `a + b`.
- O comando `$` pode imprimir texto simples ou resultados de expressões.
- `//` serve para comentários no arquivo `.ez`.
