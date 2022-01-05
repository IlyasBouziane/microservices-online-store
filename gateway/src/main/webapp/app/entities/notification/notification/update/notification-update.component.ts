import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INotification, Notification } from '../notification.model';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from 'app/entities/enumerations/notification-type.model';

@Component({
  selector: 'jhi-notification-update',
  templateUrl: './notification-update.component.html',
})
export class NotificationUpdateComponent implements OnInit {
  isSaving = false;
  notificationTypeValues = Object.keys(NotificationType);

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    details: [],
    sentDate: [null, [Validators.required]],
    format: [null, [Validators.required]],
    userId: [null, [Validators.required]],
    productId: [null, [Validators.required]],
  });

  constructor(protected notificationService: NotificationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notification }) => {
      if (notification.id === undefined) {
        const today = dayjs().startOf('day');
        notification.date = today;
        notification.sentDate = today;
      }

      this.updateForm(notification);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notification = this.createFromForm();
    if (notification.id !== undefined) {
      this.subscribeToSaveResponse(this.notificationService.update(notification));
    } else {
      this.subscribeToSaveResponse(this.notificationService.create(notification));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotification>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(notification: INotification): void {
    this.editForm.patchValue({
      id: notification.id,
      date: notification.date ? notification.date.format(DATE_TIME_FORMAT) : null,
      details: notification.details,
      sentDate: notification.sentDate ? notification.sentDate.format(DATE_TIME_FORMAT) : null,
      format: notification.format,
      userId: notification.userId,
      productId: notification.productId,
    });
  }

  protected createFromForm(): INotification {
    return {
      ...new Notification(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      details: this.editForm.get(['details'])!.value,
      sentDate: this.editForm.get(['sentDate'])!.value ? dayjs(this.editForm.get(['sentDate'])!.value, DATE_TIME_FORMAT) : undefined,
      format: this.editForm.get(['format'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      productId: this.editForm.get(['productId'])!.value,
    };
  }
}
