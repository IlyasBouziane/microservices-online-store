import * as dayjs from 'dayjs';
import { NotificationType } from 'app/entities/enumerations/notification-type.model';

export interface INotification {
  id?: number;
  date?: dayjs.Dayjs;
  details?: string | null;
  sentDate?: dayjs.Dayjs;
  format?: NotificationType;
  userId?: number;
  productId?: number;
}

export class Notification implements INotification {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public details?: string | null,
    public sentDate?: dayjs.Dayjs,
    public format?: NotificationType,
    public userId?: number,
    public productId?: number
  ) {}
}

export function getNotificationIdentifier(notification: INotification): number | undefined {
  return notification.id;
}
