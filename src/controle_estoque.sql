use controle_estoque_resourcify

create table usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome varchar(255) not null,
email varchar(255) not null,
senha_hash varchar(255) not null,
data_criacao timestamp not null default current_timestamp
)
engine = InnoDB

CREATE TABLE itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    quantidade DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    unidade_medida VARCHAR(50) NOT NULL,
    descricao TEXT,
    link_referencia VARCHAR(500),
    imagem VARCHAR(255) NULL,
    estoque_minimo DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    preco_unitario DECIMAL(10, 2) DEFAULT 0.00,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    usuario_id INT NOT NULL,
    quantidade DECIMAL(10, 2) NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL DEFAULT 'SAIDA',
    preco_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    observacao TEXT,
    data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimentacoes_itens FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE CASCADE,
    CONSTRAINT fk_movimentacoes_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE = InnoDB;