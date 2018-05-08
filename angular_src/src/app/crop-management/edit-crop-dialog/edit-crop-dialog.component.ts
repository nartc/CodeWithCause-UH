import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CropVm} from '../../app.api';

@Component({
  selector: 'app-edit-crop-dialog',
  templateUrl: './edit-crop-dialog.component.html',
  styleUrls: ['./edit-crop-dialog.component.scss']
})
export class EditCropDialogComponent implements OnInit {
  cropForm: FormGroup;

  // crop: INewCropParams;

  constructor(@Inject(MAT_DIALOG_DATA) private crop: CropVm,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.cropForm = this.formBuilder.group({
      name: [this.crop.name, Validators.required],
      varieties: this.formBuilder.array(this.initVariety()),
      pricePerPound: [this.crop.pricePerPound, Validators.required]
    });
  }

  getVarieties(cropForm) {
    return cropForm.get('varieties').controls;
  }

  initVariety() {
    const arr: any[] = [];
    this.crop.variety.forEach((variety: string) => {
      arr.push(this.formBuilder.group({
        variety: [variety, Validators.required]
      }));
    });
    return arr;
  }

  createVariety(): FormGroup {
    return this.formBuilder.group({
      variety: ['', Validators.required]
    });
  }

  addVariety(): void {
    const control = <FormArray>this.cropForm.controls['varieties'];
    control.push(this.createVariety());
  }

  removeVariety(varietyIndex: number): void {
    const control = <FormArray>this.cropForm.controls['varieties'];
    control.removeAt(varietyIndex);
  }
}
