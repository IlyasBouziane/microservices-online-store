package com.bouziane_ilyas.store.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.bouziane_ilyas.store.domain.Shipment} entity.
 */
public class ShipmentDTO implements Serializable {

    private Long id;

    private String trackingCode;

    @NotNull
    private Instant date;

    private String details;

    private InvoiceDTO invoice;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrackingCode() {
        return trackingCode;
    }

    public void setTrackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public InvoiceDTO getInvoice() {
        return invoice;
    }

    public void setInvoice(InvoiceDTO invoice) {
        this.invoice = invoice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ShipmentDTO)) {
            return false;
        }

        ShipmentDTO shipmentDTO = (ShipmentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, shipmentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ShipmentDTO{" +
            "id=" + getId() +
            ", trackingCode='" + getTrackingCode() + "'" +
            ", date='" + getDate() + "'" +
            ", details='" + getDetails() + "'" +
            ", invoice=" + getInvoice() +
            "}";
    }
}
