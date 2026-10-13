# Performance Regional SP — histórico mensal

1. Extraia a pasta inteira e abra `index.html` no Chrome ou Edge, com internet para carregar as bibliotecas.
2. No Painel Regional, informe a **Data do relatório diário** antes de clicar em **Importar Excel**. A data é informada por você: não é inferida dos horários das encomendas.
3. Importe o relatório completo daquele dia. A primeira aba do Excel precisa conter as colunas `Última estação de leitura` e `Último status`.
4. Cada importação é salva automaticamente em IndexedDB no navegador. Importar uma data existente pede confirmação e substitui o dia inteiro; não acrescente partes do mesmo dia como arquivos separados.
5. Escolha o mês para acompanhar os dias disponíveis, o consolidado regional e o comparativo dos supervisores. As tabelas mensais seguem os filtros Supervisor, Bases, DSP, Motorista e Status. Trocar o mês preserva valores de filtros ainda disponíveis e reinicializa a seleção de bases para as bases do supervisor.
6. Use **Exportar histórico** regularmente. **Restaurar histórico** aceita esse JSON e mescla os dias, substituindo datas coincidentes após confirmação. Para outro computador ou navegador, transfira e restaure o JSON.

## Regra de cálculo

O histórico contém fotografias diárias da operação. Total mensal = soma dos registros dos dias importados. Uma AWB que aparece em dois dias conta em ambos; não é um contador de AWBs únicas do mês. Performance mensal = soma dos entregues / soma dos totais, sem média simples dos percentuais diários. Em rota faz parte dos não entregues, conforme o painel original. Dias sem relatório não são inventados nem tratados como zero.

## Armazenamento

O banco é local, sem servidor e sem sincronização automática. Use a mesma pasta e navegador para acessar o histórico. Limpar os dados do navegador pode apagar o banco; mantenha o JSON de backup. O ZIP não inclui dados importados durante os testes.

As três abas operacionais mantêm seus recursos e usam os registros do mês selecionado. Para uma fotografia operacional de apenas um dia, acompanhe a tabela diária no Painel Regional. O visual do painel foi atualizado seguindo a referência azul e clara enviada.

## Validação realizada

- Edge com bibliotecas CDN reais e Excel gerado para teste: 10 registros, 7 entregues, 70,00%; dados dos gráficos conferidos.
- Cenário de volumes diários distintos: 1/1 e 1/3 resultam em 2/4 = 50,00%, sem média simples de 66,67%.
- Isolamento por mês; filtros Supervisor, Status e Bases; seleção vazia; supervisores sem cadastro agrupados como Não definido.
- Substituição de data sem duplicação; validação de backup inválido; restauração no banco; exportação JSON; recarga com dados persistidos.
- Navegação e seleção de bases nas três abas existentes, revisão visual desktop e celular; ausência de erros JavaScript.

Não foi fornecido Excel operacional real nesta conversa; a importação foi validada com arquivo sintético usando os nomes de colunas esperados.

