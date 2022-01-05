package com.bouziane_ilyas.store.service.dto;

import com.bouziane_ilyas.store.domain.enumeration.OrderStatus;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.bouziane_ilyas.store.domain.ProductOrder} entity.
 */
public class ProductOrderDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant placedDate;

    @NotNull
    private OrderStatus status;

    private Long invoiceId;

    @NotNull
    private String code;

    private CustomerDTO customer;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getPlacedDate() {
        return placedDate;
    }

    public void setPlacedDate(Instant placedDate) {
        this.placedDate = placedDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTO customer) {
        this.customer = customer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductOrderDTO)) {
            return false;
        }

        ProductOrderDTO productOrderDTO = (ProductOrderDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, productOrderDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductOrderDTO{" +
            "id=" + getId() +
            ", placedDate='" + getPlacedDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", invoiceId=" + getInvoiceId() +
            ", code='" + getCode() + "'" +
            ", customer=" + getCustomer() +
            "}";
    }
}
