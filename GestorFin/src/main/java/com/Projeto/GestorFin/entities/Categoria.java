// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/entities/Categoria.java
// PASTA:   entities
// ===================================================

package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "categorias")
public class Categoria {

    // ID do tipo Long (número inteiro longo), gerado automaticamente pelo banco.
    // GenerationType.IDENTITY → o banco MySQL faz o AUTO_INCREMENT.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @ManyToOne → "Muitas categorias pertencem a UM usuário"
    // Pense: um usuário pode ter várias categorias, mas cada categoria tem 1 usuário.
    // @JoinColumn → diz qual coluna no banco é a chave estrangeira (FK)
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String nome;

    // O campo "tipo" só aceita 'receita' ou 'despesa'.
    // No banco está como ENUM, mas no Java usamos String simples.
    @Column(nullable = false)
    private String tipo;

    // "cor" armazena uma cor em hexadecimal, ex: "#FF5733"
    private String cor;

    // "padrao" indica se é uma categoria padrão do sistema.
    // @Column(name = "padrao") → mapeia para a coluna "padrao" do banco.
    @Column(name = "padrao")
    private Boolean padrao;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Preenche a data de criação automaticamente antes de salvar
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Construtor vazio — obrigatório!
    public Categoria() {
    }

    // Getters e Setters
    public Long getId()             { return id; }
    public void setId(Long id)      { this.id = id; }

    public Usuario getUsuario()             { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getNome()             { return nome; }
    public void setNome(String nome)    { this.nome = nome; }

    public String getTipo()             { return tipo; }
    public void setTipo(String tipo)    { this.tipo = tipo; }

    public String getCor()              { return cor; }
    public void setCor(String cor)      { this.cor = cor; }

    public Boolean getPadrao()              { return padrao; }
    public void setPadrao(Boolean padrao)   { this.padrao = padrao; }

    public LocalDateTime getCreatedAt()                 { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)   { this.createdAt = createdAt; }
}
