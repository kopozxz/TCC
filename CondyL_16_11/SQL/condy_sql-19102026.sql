drop database if exists tcc2026_condy;

create database tcc2026_condy;
use tcc2026_condy;

create table tabelaUsuario (
	idUsuario int unique not null auto_increment,
    nome varchar(100) not null,
    apelido varchar(12) unique not null default (FLOOR(RAND() * 1000 + UNIX_TIMESTAMP())),
    dataNascimento date not null,
    email varchar(150) unique not null,
    senha varchar(255) not null,
    fotoPerfil varchar(37) unique,
    fotoBanner varchar(37) unique,
    biografia text,
    isAdmin enum('true', 'false') not null default 'false',
    isActive enum('true', 'false') not null default 'true',
	primary key (idUsuario)
);

create table tabelaPostagem (
	idPostagem int unique not null default (FLOOR(RAND() * 1000 + UNIX_TIMESTAMP())),
    tipoPostagem enum('postagem', 'comentario', 'replica') not null,
    idUsuarioFK int not null,
    texto text not null,
    isReported enum('true', 'false') not null default 'false',
    isDeleted enum('true', 'false') not null default 'false',
    primary key (idPostagem),
    foreign key (idUsuarioFK) references tabelaUsuario(idUsuario) on delete cascade
);

select * from tabelaPostagem;

create table tabelaAnexo (
	idPostagemFK int not null,
	nomeAnexo varchar(37) unique not null,
    foreign key (idPostagemFK) references tabelaPostagem(idPostagem) on delete cascade
);

create table tabelaInteracao (
	idUsuarioFK int not null,
    idPostagemFK int not null,
    tipoInteracao enum('curtiu', 'comentou', 'compartilhou', 'salvou') not null,
    foreign key (idUsuarioFK) references tabelaUsuario(idUsuario) on delete cascade,
	foreign key (idPostagemFK) references tabelaPostagem(idPostagem) on delete cascade
);

create table tabelaAuditoria (
	idUsuarioFK int not null,
	registro text not null,
	data timestamp not null default current_timestamp,
    foreign key (idUsuarioFK) references tabelaUsuario(idUsuario)
);

/*INSERT INTO tabelaUsuario (nome, email, senha) VALUES ('teste', 'teste', 'teste');

INSERT INTO tabelaUsuario (nome, email, senha) VALUES ('teste2', 'teste2', 'teste2');

SELECT * FROM tabelaUsuario;

INSERT INTO tabelaPostagem (tipoPostagem, idUsuarioFK, texto) VALUES ('postagem', 1, 'teste de postagem');

SELECT * FROM tabelaPostagem;

INSERT INTO tabelaInteracao (idUsuarioFK, idPostagemFK, tipoInteracao) VALUES (2, 1792448494, 'curtiu');

INSERT INTO tabelaInteracao (idUsuarioFK, idPostagemFK, tipoInteracao) VALUES (2, 1792448494, 'salvou');

SELECT * FROM tabelainteracao;

# QUERY NOTIFICAÇÕES
SELECT T2.apelido, T1.tipoInteracao, T0.tipoPostagem, T0.idPostagem,
        (COUNT((SELECT tipoInteracao FROM tabelaInteracao WHERE tipoInteracao = 'curtiu' AND idPostagemFK = T0.idPostagem))) AS qtdCurtida,
        (SUM(T1.tipoInteracao = 'comentou')) AS qtdComentario,
        (SUM(T1.tipoInteracao = 'compartilhou')) AS qtdCompartilhamento,
        (SUM(T1.tipoInteracao = 'salvou')) AS qtdSalvamento
    FROM tabelaPostagem T0
    LEFT JOIN tabelaInteracao T1
    ON T1.idPostagemFK = T0.idPostagem
    LEFT JOIN tabelaUsuario T2
    ON T2.idUsuario = T0.idUsuarioFK
GROUP BY T2.apelido, T1.tipoInteracao, T0.tipoPostagem, T0.idPostagem
ORDER BY T0.idPostagem DESC
LIMIT 0, 1000;

# QUERY ITENS SALVOS
SELECT T2.nome, T2.apelido, T0.idPostagem, T0.texto, T3.nomeAnexo,
        (COUNT(CASE WHEN T1.tipoInteracao = 'curtiu' THEN 1 END)) AS qtdCurtida,
        (COUNT(CASE WHEN T1.tipoInteracao = 'comentou' THEN 1 END)) AS qtdComentario,
        (COUNT(CASE WHEN T1.tipoInteracao = 'compartilhou' THEN 1 END)) AS qtdCompartilhamento,
        (COUNT(CASE WHEN T1.tipoInteracao = 'salvou' THEN 1 END)) AS qtdSalvamento
    FROM tabelaPostagem T0
    INNER JOIN tabelaInteracao T1
        ON T1.idPostagemFK = T0.idPostagem AND T1.tipoInteracao = 'salvou'
    LEFT JOIN tabelaUsuario T2
        ON T2.idUsuario = T0.idUsuarioFK
    LEFT JOIN tabelaAnexo T3
        on T3.idPostagemFK = T0.idPostagem
ORDER BY T0.idPostagem DESC;

# QUERY NOVAS POSTAGENS
SELECT *
    FROM tabelaPostagem T0
    LEFT JOIN tabelaInteracao T1
        ON T1.idPostagemFK = T0.idPostagem AND T1.tipoInteracao = 'salvou'
    LEFT JOIN tabelaUsuario T2
        ON T2.idUsuario = T0.idUsuarioFK
ORDER BY T0.idPostagem DESC;*/

