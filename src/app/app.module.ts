import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { BodyComponent } from './body/body.component';
import { SideNavComponent } from './layouts/side-nav/side-nav.component';
import {MatTreeModule} from '@angular/material/tree';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CompanyDashboardComponent } from './pages/company/company-dashboard/company-dashboard.component';
import { AddCompanyComponent } from './pages/company/add-company/add-company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCompany2Component } from './pages/company/add-company2/add-company2.component';
import { DragndropDirective } from './directives/dragndrop.directive';
import { ProductListComponent } from './pages/product/product-list/product-list.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { ProductDetailsComponent } from './pages/product/product-details/product-details.component';
import { EditProductPricingDetailsComponent } from './pages/product/edit-product-pricing-details/edit-product-pricing-details.component';
import { ServiceListComponent } from './pages/service/service-list/service-list.component';
import { AddServiceComponent } from './pages/service/add-service/add-service.component';
import { ServiceDiscountDetailsComponent } from './pages/service/service-discount-details/service-discount-details.component';
import { ServiceSummaryComponent } from './pages/service/service-summary/service-summary.component';
import { PackageListComponent } from './pages/package/package-list/package-list.component';
import { AddPackageComponent } from './pages/package/add-package/add-package.component';
import { AssignServicePopupComponent } from './pages/package/assign-service-popup/assign-service-popup.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PackageSummaryComponent } from './pages/package/package-summary/package-summary.component';
import { OutletDashboardComponent } from './pages/outlet/outlet-dashboard/outlet-dashboard.component';
import { AddOutletComponent } from './pages/outlet/add-outlet/add-outlet.component';
import { OutletSummaryComponent } from './pages/outlet/outlet-summary/outlet-summary.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { AddEmployeeComponent } from './pages/employee/add-employee/add-employee.component';
import { ServiceRequestListComponent } from './pages/service-request/service-request-list/service-request-list.component';
import { ServiceRequestSummaryComponent } from './pages/service-request/service-request-summary/service-request-summary.component';
import { ServiceRequestMessagePopupComponent } from './pages/service-request/service-request-message-popup/service-request-message-popup.component';
import { OrderListComponent } from './pages/order/order-list/order-list.component';
import { AddOrderComponent } from './pages/order/add-order/add-order.component';
import { OrderTypePopupComponent } from './pages/order/order-type-popup/order-type-popup.component';
import { CardDetailsPopupComponent } from './pages/order/card-details-popup/card-details-popup.component';
import { LoginComponent } from './pages/login-details/login/login.component';
import { SignupComponent } from './pages/login-details/signup/signup.component';
import { VerifyAccountComponent } from './pages/login-details/verify-account/verify-account.component';
import { BreadcrumbComponent } from './layouts/breadcrumb/breadcrumb.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { CdkMenuModule } from '@angular/cdk/menu'
import { NgSelectModule } from '@ng-select/ng-select';
import { provideToastr, ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    SideNavComponent,
    DashboardComponent,
    CompanyDashboardComponent,
    AddCompanyComponent,
    AddCompany2Component,
    DragndropDirective,
    ProductListComponent,
    AddProductComponent,
    ProductDetailsComponent,
    EditProductPricingDetailsComponent,
    ServiceListComponent,
    AddServiceComponent,
    ServiceDiscountDetailsComponent,
    ServiceSummaryComponent,
    PackageListComponent,
    AddPackageComponent,
    AssignServicePopupComponent,
    PackageSummaryComponent,
    OutletDashboardComponent,
    AddOutletComponent,
    OutletSummaryComponent,
    EmployeeListComponent,
    AddEmployeeComponent,
    ServiceRequestListComponent,
    ServiceRequestSummaryComponent,
    ServiceRequestMessagePopupComponent,
    OrderListComponent,
    AddOrderComponent,
    OrderTypePopupComponent,
    CardDetailsPopupComponent,
    LoginComponent,
    SignupComponent,
    VerifyAccountComponent,
    BreadcrumbComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTreeModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    HttpClientModule,
    CommonModule,
    CdkMenuModule,
    NgSelectModule,
    ToastrModule.forRoot()
  ],
  providers: [provideToastr()],
  bootstrap: [AppComponent]
})
export class AppModule { }
