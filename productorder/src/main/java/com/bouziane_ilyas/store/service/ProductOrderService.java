package com.bouziane_ilyas.store.service;

import com.bouziane_ilyas.store.service.dto.ProductOrderDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.bouziane_ilyas.store.domain.ProductOrder}.
 */
public interface ProductOrderService {
    /**
     * Save a productOrder.
     *
     * @param productOrderDTO the entity to save.
     * @return the persisted entity.
     */
    ProductOrderDTO save(ProductOrderDTO productOrderDTO);

    /**
     * Partially updates a productOrder.
     *
     * @param productOrderDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProductOrderDTO> partialUpdate(ProductOrderDTO productOrderDTO);

    /**
     * Get all the productOrders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProductOrderDTO> findAll(Pageable pageable);

    /**
     * Get the "id" productOrder.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProductOrderDTO> findOne(Long id);

    /**
     * Delete the "id" productOrder.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
