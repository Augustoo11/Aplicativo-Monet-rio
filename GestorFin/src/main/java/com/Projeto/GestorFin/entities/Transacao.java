// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/entities/Transacao.java
// PASTA:   entities
// ===================================================

package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.math.BigDecimal; // Usado para valores monetários (mais preciso que double)
import java.time.LocalDate;  // Data sem hora (ex: 2025-05-10)
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com Usuario: muitas transações para 1 usuário
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Relacionamento com Categoria: muitas transações para 1 categoria
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    // "tipo" aceita 'receita' ou 'despesa' — igual ao banco
    @Column(nullable = false)
    private String tipo;

    // BigDecimal é o tipo certo para dinheiro.
    // Double pode ter erros de arredondamento (ex: 0.1 + 0.2 = 0.30000000004)
    // BigDecimal garante: 0.1 + 0.2 = 0.3 exato.
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    // Descrição pode ser nula (campo opcional)
    private String descricao;

    // LocalDate armazena só a data: 2025-05-10
    // Sem horário, porque geralmente transações têm só a data
    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Construtor vazio — obrigatório!
    public Transacao() {
    }

    // Getters e Setters
    public Long getId()             { return id; }
    public void setId(Long id)      { this.id = id; }

    public Usuario getUsuario()             { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Categoria getCategoria()               { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getTipo()             { return tipo; }
    public void setTipo(String tipo)    { this.tipo = tipo; }

    public BigDecimal getValor()                { return valor; }
    public void setValor(BigDecimal valor)      { this.valor = valor; }

    public String getDescricao()                { return descricao; }
    public void setDescricao(String descricao)  { this.descricao = descricao; }

    public LocalDate getData()              { return data; }
    public void setData(LocalDate data)     { this.data = data; }

    public LocalDateTime getCreatedAt()                 { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)   { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                 { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)   { this.updatedAt = updatedAt; }
}
