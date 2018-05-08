import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { ListboxModule } from 'primeng/components/listbox/listbox';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { SpinnerModule } from 'primeng/components/spinner/spinner';
import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { MultiSelectModule } from 'primeng/components/multiselect/multiselect';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { PickListModule } from 'primeng/components/picklist/picklist';
import { AccordionModule } from 'primeng/components/accordion/accordion';
import { StepsModule } from 'primeng/components/steps/steps';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
import {BlockUIModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {MessageModule} from 'primeng/primeng';
import { SharedModule } from 'primeng/components/common/shared';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    InputTextModule,
    ButtonModule,
    DataTableModule,
    ListboxModule,
    SharedModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    SpinnerModule,
    InputTextareaModule,
    MultiSelectModule,
    InputSwitchModule,
    PickListModule,
    AccordionModule,
    StepsModule,
    CheckboxModule,
    OverlayPanelModule,
    InputMaskModule,
    MessageModule,
    GrowlModule
  ],
  exports: [
    InputTextModule,
    ButtonModule,
    DataTableModule,
    ListboxModule,
    SharedModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    SpinnerModule,
    InputTextareaModule,
    MultiSelectModule,
    InputSwitchModule,
    PickListModule,
    AccordionModule,
    StepsModule,
    CheckboxModule,
    OverlayPanelModule,
    InputMaskModule,
    BlockUIModule,
    PanelModule,
    GrowlModule,
    MessageModule
  ],
})
export class PrimengImportModule {}