import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewCropParams} from '../../app.api';

@Component({
  selector: 'app-create-crop-dialog',
  templateUrl: 'create-crop-dialog.component.html',
  styleUrls: ['./create-crop-dialog.component.scss']
})
export class CreateCropDialogComponent implements OnInit {
  cropForm: FormGroup;
  crop: NewCropParams;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.cropForm = this.formBuilder.group({
      name: ['', Validators.required],
      varieties: this.formBuilder.array([this.createVariety()]),
      pricePerPound: [0, Validators.required]
    });

    this.crop = new NewCropParams({
      name: this.cropForm.value.name,
      variety: this.cropForm.value.varieties,
      pricePerPound: this.cropForm.value.pricePerPound
    });
  }

  getVarieties(cropForm) {
    return cropForm.get('varieties').controls;
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
