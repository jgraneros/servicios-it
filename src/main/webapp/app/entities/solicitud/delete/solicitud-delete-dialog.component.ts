import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISolicitud } from '../solicitud.model';
import { SolicitudService } from '../service/solicitud.service';

@Component({
  standalone: true,
  templateUrl: './solicitud-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SolicitudDeleteDialogComponent {
  solicitud?: ISolicitud;

  constructor(
    protected solicitudService: SolicitudService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.solicitudService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
