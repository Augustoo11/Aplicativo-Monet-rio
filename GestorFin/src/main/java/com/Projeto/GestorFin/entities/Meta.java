package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// @Entity → esta classe representa a tabela "metas" no banco
@Entity
@Table(name = "metas")
public class Meta implements Serializable {
    private static final long serialVersionUID = 1L;

    // ID gerado automaticamente pelo banco (AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento: muitas metas pertencem a UM usuário
    // Se o usuário for deletado, a meta é deletada também (CASCADE)
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Nome da meta. Ex: "Reserva de emergência", "Viagem para Europa"
    @Column(nullable = false)
    private String nome;

    // Valor que o usuário quer atingir. Ex: 10000.00
    @Column(name = "valor_alvo", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorAlvo;

    // Valor que o usuário já acumulou. Começa em 0.
    @Column(name = "valor_atual", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorAtual = BigDecimal.ZERO;

    // Data limite para concluir a meta (opcional — pode ser nula)
    @Column(name = "data_limite")
    private LocalDate dataLimite;

    // Status da meta: "em_andamento", "concluida" ou "cancelada"
    @Column(nullable = false)
    private String status = "em_andamento";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Executado automaticamente ANTES de salvar pela 1ª vez
    @PrePersist
    protected void onCreate() {
        this.createdAt  = LocalDateTime.now();
        this.updatedAt  = LocalDateTime.now();
        // Garante que valor_atual nunca seja null ao criar
        if (this.valorAtual == null) {
            this.valorAtual = BigDecimal.ZERO;
        }
        // Garante que status nunca seja null ao criar
        if (this.status == null) {
            this.status = "em_andamento";
        }
    }

    // Executado automaticamente ANTES de qualquer atualização
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Construtor vazio — obrigatório para o Spring funcionar!
    public Meta() {}

    // Getters e Setters
    public Long getId()                         { return id; }
    public void setId(Long id)                  { this.id = id; }

    public Usuario getUsuario()                 { return usuario; }
    public void setUsuario(Usuario usuario)     { this.usuario = usuario; }

    public String getNome()                     { return nome; }
    public void setNome(String nome)            { this.nome = nome; }

    public BigDecimal getValorAlvo()                    { return valorAlvo; }
    public void setValorAlvo(BigDecimal valorAlvo)      { this.valorAlvo = valorAlvo; }

    public BigDecimal getValorAtual()                   { return valorAtual; }
    public void setValorAtual(BigDecimal valorAtual)    { this.valorAtual = valorAtual; }

    public LocalDate getDataLimite()                    { return dataLimite; }
    public void setDataLimite(LocalDate dataLimite)     { this.dataLimite = dataLimite; }

    public String getStatus()                   { return status; }
    public void setStatus(String status)        { this.status = status; }

    public LocalDateTime getCreatedAt()         { return createdAt; }
    public void setCreatedAt(LocalDateTime v)   { this.createdAt = v; }

    public LocalDateTime getUpdatedAt()         { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)   { this.updatedAt = v; }
}