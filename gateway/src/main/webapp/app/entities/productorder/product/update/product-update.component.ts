import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IProductCategory } from 'app/entities/productorder/product-category/product-category.model';
import { ProductCategoryService } from 'app/entities/productorder/product-category/service/product-category.service';
import { ProductSize } from 'app/entities/enumerations/product-size.model';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  productSizeValues = Object.keys(ProductSize);

  productCategoriesSharedCollection: IProductCategory[] = [];

  editForm = this.fb.group({
    id: [],
    sku: [null, [Validators.required]],
    upc: [null, [Validators.required]],
    name: [null, [Validators.required]],
    description: [],
    price: [null, [Validators.required, Validators.min(0)]],
    productSize: [null, [Validators.required]],
    colors: [null, [Validators.pattern('^([a-z]+,)*[a-z]+$')]],
    image: [null, []],
    imageContentType: [],
    imageSha1: [null, [Validators.minLength(40), Validators.maxLength(40), Validators.pattern('[a-f0-9]{40}')]],
    imageCdnUrl: [],
    thumbnailSha1: [null, [Validators.minLength(40), Validators.maxLength(40), Validators.pattern('[a-f0-9]{40}')]],
    thumbnailCdnUrl: [],
    productCategory: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected productService: ProductService,
    protected productCategoryService: ProductCategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gatewayApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackProductCategoryById(index: number, item: IProductCategory): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      sku: product.sku,
      upc: product.upc,
      name: product.name,
      description: product.description,
      price: product.price,
      productSize: product.productSize,
      colors: product.colors,
      image: product.image,
      imageContentType: product.imageContentType,
      imageSha1: product.imageSha1,
      imageCdnUrl: product.imageCdnUrl,
      thumbnailSha1: product.thumbnailSha1,
      thumbnailCdnUrl: product.thumbnailCdnUrl,
      productCategory: product.productCategory,
    });

    this.productCategoriesSharedCollection = this.productCategoryService.addProductCategoryToCollectionIfMissing(
      this.productCategoriesSharedCollection,
      product.productCategory
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productCategoryService
      .query()
      .pipe(map((res: HttpResponse<IProductCategory[]>) => res.body ?? []))
      .pipe(
        map((productCategories: IProductCategory[]) =>
          this.productCategoryService.addProductCategoryToCollectionIfMissing(
            productCategories,
            this.editForm.get('productCategory')!.value
          )
        )
      )
      .subscribe((productCategories: IProductCategory[]) => (this.productCategoriesSharedCollection = productCategories));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      sku: this.editForm.get(['sku'])!.value,
      upc: this.editForm.get(['upc'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      price: this.editForm.get(['price'])!.value,
      productSize: this.editForm.get(['productSize'])!.value,
      colors: this.editForm.get(['colors'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      imageSha1: this.editForm.get(['imageSha1'])!.value,
      imageCdnUrl: this.editForm.get(['imageCdnUrl'])!.value,
      thumbnailSha1: this.editForm.get(['thumbnailSha1'])!.value,
      thumbnailCdnUrl: this.editForm.get(['thumbnailCdnUrl'])!.value,
      productCategory: this.editForm.get(['productCategory'])!.value,
    };
  }
}
