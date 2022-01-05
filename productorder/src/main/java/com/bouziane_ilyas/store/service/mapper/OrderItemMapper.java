package com.bouziane_ilyas.store.service.mapper;

import com.bouziane_ilyas.store.domain.OrderItem;
import com.bouziane_ilyas.store.service.dto.OrderItemDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OrderItem} and its DTO {@link OrderItemDTO}.
 */
@Mapper(componentModel = "spring", uses = { ProductMapper.class, ProductOrderMapper.class })
public interface OrderItemMapper extends EntityMapper<OrderItemDTO, OrderItem> {
    @Mapping(target = "product", source = "product", qualifiedByName = "id")
    @Mapping(target = "order", source = "order", qualifiedByName = "id")
    OrderItemDTO toDto(OrderItem s);
}
