package com.bouziane_ilyas.store.service.impl;

import com.bouziane_ilyas.store.domain.OrderItem;
import com.bouziane_ilyas.store.repository.OrderItemRepository;
import com.bouziane_ilyas.store.service.OrderItemService;
import com.bouziane_ilyas.store.service.dto.OrderItemDTO;
import com.bouziane_ilyas.store.service.mapper.OrderItemMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrderItem}.
 */
@Service
@Transactional
public class OrderItemServiceImpl implements OrderItemService {

    private final Logger log = LoggerFactory.getLogger(OrderItemServiceImpl.class);

    private final OrderItemRepository orderItemRepository;

    private final OrderItemMapper orderItemMapper;

    public OrderItemServiceImpl(OrderItemRepository orderItemRepository, OrderItemMapper orderItemMapper) {
        this.orderItemRepository = orderItemRepository;
        this.orderItemMapper = orderItemMapper;
    }

    @Override
    public OrderItemDTO save(OrderItemDTO orderItemDTO) {
        log.debug("Request to save OrderItem : {}", orderItemDTO);
        OrderItem orderItem = orderItemMapper.toEntity(orderItemDTO);
        orderItem = orderItemRepository.save(orderItem);
        return orderItemMapper.toDto(orderItem);
    }

    @Override
    public Optional<OrderItemDTO> partialUpdate(OrderItemDTO orderItemDTO) {
        log.debug("Request to partially update OrderItem : {}", orderItemDTO);

        return orderItemRepository
            .findById(orderItemDTO.getId())
            .map(existingOrderItem -> {
                orderItemMapper.partialUpdate(existingOrderItem, orderItemDTO);

                return existingOrderItem;
            })
            .map(orderItemRepository::save)
            .map(orderItemMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all OrderItems");
        return orderItemRepository.findAll(pageable).map(orderItemMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderItemDTO> findOne(Long id) {
        log.debug("Request to get OrderItem : {}", id);
        return orderItemRepository.findById(id).map(orderItemMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete OrderItem : {}", id);
        orderItemRepository.deleteById(id);
    }
}
