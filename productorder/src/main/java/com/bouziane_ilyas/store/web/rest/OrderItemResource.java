package com.bouziane_ilyas.store.web.rest;

import com.bouziane_ilyas.store.repository.OrderItemRepository;
import com.bouziane_ilyas.store.service.OrderItemService;
import com.bouziane_ilyas.store.service.dto.OrderItemDTO;
import com.bouziane_ilyas.store.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bouziane_ilyas.store.domain.OrderItem}.
 */
@RestController
@RequestMapping("/api")
public class OrderItemResource {

    private final Logger log = LoggerFactory.getLogger(OrderItemResource.class);

    private static final String ENTITY_NAME = "productorderOrderItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderItemService orderItemService;

    private final OrderItemRepository orderItemRepository;

    public OrderItemResource(OrderItemService orderItemService, OrderItemRepository orderItemRepository) {
        this.orderItemService = orderItemService;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * {@code POST  /order-items} : Create a new orderItem.
     *
     * @param orderItemDTO the orderItemDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderItemDTO, or with status {@code 400 (Bad Request)} if the orderItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-items")
    public ResponseEntity<OrderItemDTO> createOrderItem(@Valid @RequestBody OrderItemDTO orderItemDTO) throws URISyntaxException {
        log.debug("REST request to save OrderItem : {}", orderItemDTO);
        if (orderItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new orderItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderItemDTO result = orderItemService.save(orderItemDTO);
        return ResponseEntity
            .created(new URI("/api/order-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-items/:id} : Updates an existing orderItem.
     *
     * @param id the id of the orderItemDTO to save.
     * @param orderItemDTO the orderItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderItemDTO,
     * or with status {@code 400 (Bad Request)} if the orderItemDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-items/{id}")
    public ResponseEntity<OrderItemDTO> updateOrderItem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OrderItemDTO orderItemDTO
    ) throws URISyntaxException {
        log.debug("REST request to update OrderItem : {}, {}", id, orderItemDTO);
        if (orderItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderItemDTO result = orderItemService.save(orderItemDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderItemDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /order-items/:id} : Partial updates given fields of an existing orderItem, field will ignore if it is null
     *
     * @param id the id of the orderItemDTO to save.
     * @param orderItemDTO the orderItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderItemDTO,
     * or with status {@code 400 (Bad Request)} if the orderItemDTO is not valid,
     * or with status {@code 404 (Not Found)} if the orderItemDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/order-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderItemDTO> partialUpdateOrderItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OrderItemDTO orderItemDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderItem partially : {}, {}", id, orderItemDTO);
        if (orderItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderItemDTO> result = orderItemService.partialUpdate(orderItemDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderItemDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /order-items} : get all the orderItems.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderItems in body.
     */
    @GetMapping("/order-items")
    public ResponseEntity<List<OrderItemDTO>> getAllOrderItems(Pageable pageable) {
        log.debug("REST request to get a page of OrderItems");
        Page<OrderItemDTO> page = orderItemService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /order-items/:id} : get the "id" orderItem.
     *
     * @param id the id of the orderItemDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderItemDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-items/{id}")
    public ResponseEntity<OrderItemDTO> getOrderItem(@PathVariable Long id) {
        log.debug("REST request to get OrderItem : {}", id);
        Optional<OrderItemDTO> orderItemDTO = orderItemService.findOne(id);
        return ResponseUtil.wrapOrNotFound(orderItemDTO);
    }

    /**
     * {@code DELETE  /order-items/:id} : delete the "id" orderItem.
     *
     * @param id the id of the orderItemDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-items/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        log.debug("REST request to delete OrderItem : {}", id);
        orderItemService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
