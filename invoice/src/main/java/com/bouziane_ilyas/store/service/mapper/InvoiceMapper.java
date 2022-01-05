package com.bouziane_ilyas.store.service.mapper;

import com.bouziane_ilyas.store.domain.Invoice;
import com.bouziane_ilyas.store.service.dto.InvoiceDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Invoice} and its DTO {@link InvoiceDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface InvoiceMapper extends EntityMapper<InvoiceDTO, Invoice> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InvoiceDTO toDtoId(Invoice invoice);
}
