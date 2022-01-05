package com.bouziane_ilyas.store.service.mapper;

import com.bouziane_ilyas.store.domain.Notification;
import com.bouziane_ilyas.store.service.dto.NotificationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Notification} and its DTO {@link NotificationDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {}
