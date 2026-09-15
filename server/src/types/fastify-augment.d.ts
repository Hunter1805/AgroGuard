// Augmentations globais do Fastify carregadas sempre que o projeto for analisado.
//
// 1. `@fastify/swagger` declara `FastifySchema` com `description`/`tags`/`summary`
//    (usado nos objetos `schema` das rotas). O import abaixo garante que essa
//    augmentação esteja no escopo mesmo ao analisar um único arquivo de rota.
import '@fastify/swagger';

// 2. `FastifyRequest.actor` é declarado em `../shared/http/RequestActor`.
//    A referência de tipo abaixo garante a augmentação sem gerar código em runtime.
import type {} from '../shared/http/RequestActor';
