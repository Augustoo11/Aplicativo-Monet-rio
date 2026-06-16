package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "metas")
public class Meta implements Serializable {
    private static final long serialVersionUID = 1L;

    
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private String id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String nome;

    @Column(name = "valor_alvo", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorAlvo;

    
    @Column(name = "valor_atual", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorAtual = BigDecimal.ZERO;

    @Column(name = "data_limite")
    private LocalDate dataLimite;

    
    @Column(nullable = false)
    private String status = "em_andamento";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.id         = UUID.randomUUID().toString();
        this.createdAt  = LocalDateTime.now();
        this.updatedAt  = LocalDateTime.now();
        if (this.valorAtual == null) {
            this.valorAtual = BigDecimal.ZERO;
        }
        if (this.status == null) {
            this.status = "em_andamento";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Meta() {}

    public String getId()                       { return id; }
    public void setId(String id)                { this.id = id; }

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
