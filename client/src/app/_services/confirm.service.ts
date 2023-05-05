import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { map, Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  BsModalRef?: BsModalRef<ConfirmDialogComponent>;

  constructor(private ModalService: BsModalService) { }

  confirm(
    title = 'Confirmation',
    message = 'Are you sure you want to do this',
    btnOkText = 'Ok',
    btnCancelText = 'Cancel'
  ): Observable<boolean> {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    };
    this.BsModalRef = this.ModalService.show(ConfirmDialogComponent, config);
    return this.BsModalRef.onHidden.pipe(
      map(() => {
        return this.BsModalRef!.content!.result;
      })
    )
  }
}
