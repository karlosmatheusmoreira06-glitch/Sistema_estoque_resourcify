-- Execute este arquivo apenas se o banco já existir (o controle_estoque.sql é o script de criação).
-- Adiciona o campo de foto de capa dos itens, usada nos cards da página Itens.

use controle_estoque_resourcify;

ALTER TABLE itens
    ADD COLUMN imagem VARCHAR(255) NULL AFTER link_referencia;

-- Adiciona o estoque mínimo de referência (definido no cadastro do item).
ALTER TABLE itens
    ADD COLUMN estoque_minimo DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER imagem;
