package com.bouziane_ilyas.store.service.mapper;

import com.bouziane_ilyas.store.domain.Product;
import com.bouziane_ilyas.store.service.dto.ProductDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Product} and its DTO {@link ProductDTO}.
 */
@Mapper(componentModel = "spring", uses = { ProductCategoryMapper.class })
public interface ProductMapper extends EntityMapper<ProductDTO, Product> {
    @Mapping(target = "productCategory", source = "productCategory", qualifiedByName = "id")
    ProductDTO toDto(Product s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProductDTO toDtoId(Product product);
}
