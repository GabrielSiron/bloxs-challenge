# bloxs-challenge

Olá! Esse é o resultado do meu processo seletivo para entrar na Bloxs.

O sistema desenvolvido aqui tem o intuito de simular um site para um banco, realizando operações comuns
dentro desse contexto, como depósito, saques e listagens de transferências.

## Como Rodar

A aplicação está completamente dockerizada. Portanto, uma vez que o repositório esteja na sua máquina (e que você possua o docker-compose instalado), rode os seguintes comandos:

```
$ docker network create backend
$ docker volume create db-volume
$ docker-compose build
$ docker-compose up
```

## Como Usar

Desenvolvi um seed para a aplicação que alimenta o banco de dados com dois usuários:

- Gabriel Siron:
  - email: gabriel@bloxs.com
  - senha: password
  - tipo de conta: Gold (Limite diário de 500 reais)
  - cpf: 999.999.999-99 

- Lucas Ayres:
  - email: lucas@bloxs.com
  - senha: password
  - tipo de conta: Diamond (Limite diário de 1500 reais)
  - cpf: 888.888.888-88

Ambas as contas iniciam com um montante de R$10.000,00.

Os tipos de transações possíveis são:
- Saque
- Depósito
- Transferência (Pix)

O Pix exige que se use o cpf de outro usuário como chave (assim como funciona na vida real). Saque e Depósito só dependem do valor sacado/depositado.

Existe uma modalidade de bloqueio automático. Para testar essa feature, tente realizar uma transação com 70% do limite diário. 

Exemplo: limite diário de R$500,00, o valor da transação deve ser de, pelo menos, R$350,01.