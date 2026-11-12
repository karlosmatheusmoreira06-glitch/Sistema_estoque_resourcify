-- Execute este arquivo apenas se o banco já existir (o controle_estoque.sql é o script de criação).
-- Adiciona o preço unitário nas movimentações: a última ENTRADA passa a definir o preço do item.

use controle_estoque_resourcify;

ALTER TABLE movimentacoes
    ADD COLUMN preco_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER tipo;
