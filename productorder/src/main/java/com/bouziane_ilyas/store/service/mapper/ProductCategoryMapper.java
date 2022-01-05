package com.bouziane_ilyas.store.service.mapper;

import com.bouziane_ilyas.store.domain.ProductCategory;
import com.bouziane_ilyas.store.service.dto.ProductCategoryDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductCategory} and its DTO {@link ProductCategoryDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ProductCategoryMapper extends EntityMapper<ProductCategoryDTO, ProductCategory> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProductCategoryDTO toDtoId(ProductCategory productCategory);
}
