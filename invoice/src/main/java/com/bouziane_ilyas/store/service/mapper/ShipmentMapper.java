package com.bouziane_ilyas.store.service.mapper;

import com.bouziane_ilyas.store.domain.Shipment;
import com.bouziane_ilyas.store.service.dto.ShipmentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Shipment} and its DTO {@link ShipmentDTO}.
 */
@Mapper(componentModel = "spring", uses = { InvoiceMapper.class })
public interface ShipmentMapper extends EntityMapper<ShipmentDTO, Shipment> {
    @Mapping(target = "invoice", source = "invoice", qualifiedByName = "id")
    ShipmentDTO toDto(Shipment s);
}
