# Performance Regional SP — V9 Design Operacional iMile

Esta versão mantém o painel no GitHub Pages e grava o histórico diário no Supabase. Assim, ao importar um novo Excel pelo painel, a data fica disponível nas próximas consultas e em outros computadores, sem republicar o site.

A identidade visual V9 padroniza cabeçalho, navegação, filtros, indicadores, gráficos e tabelas com as cores institucionais da iMile. A atualização é somente visual: cálculos, filtros, importação Excel, histórico local, backup, restauração e sincronização com o Supabase foram preservados.

## 1. Criar o banco
1. Crie um projeto no Supabase.
2. Abra **SQL Editor** e execute todo o arquivo `setup_supabase.sql`.
3. Em **Authentication > Users**, crie pelo menos um usuário com e-mail e senha para quem vai alimentar/consultar o painel.

## 2. Configurar o painel
1. No Supabase, abra **Project Settings > API**.
2. Copie a **Project URL** e a chave pública **anon/publishable**.
3. Abra `config.js` e substitua os dois valores de exemplo.
4. Nunca coloque a chave `service_role` no GitHub ou no navegador.

## 3. Publicar no GitHub Pages
Envie `index.html`, `design-v9.css`, `jszip.min.js` e `config.js` para a raiz do repositório usado pelo GitHub Pages. Os arquivos `setup_supabase.sql`, `config.example.js` e este README podem ficar no repositório também.

## 4. Uso diário
1. Abra o painel publicado.
2. Vá em **Base Histórica** e faça login com o usuário criado no Supabase.
3. Importe o Excel do novo dia.
4. Data nova: adiciona ao histórico. Data já existente: segue a política selecionada no painel (substituir ou ignorar).
5. As telas diária, mensal, ranking e semana passam a consultar o banco online.

## 5. Migrar o histórico que já está no navegador
Se o navegador antigo ainda mostra os dias carregados, abra esta nova versão no mesmo navegador/origem em que o IndexedDB existe, faça login no banco online e clique **Enviar histórico local para nuvem**. O botão envia todos os dias locais e atualiza datas coincidentes.

### Observação importante
Se o histórico antigo foi criado em `file:///` e a nova versão está em `github.io`, os navegadores tratam isso como origens diferentes. Nesse caso, use primeiro **Exportar backup JSON** na versão antiga e depois **Restaurar backup** na versão nova enquanto ela estiver em modo local; em seguida faça login e use **Enviar histórico local para nuvem**.
