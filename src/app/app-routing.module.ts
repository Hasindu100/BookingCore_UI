import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CompanyDashboardComponent } from './pages/company/company-dashboard/company-dashboard.component';
import { AddCompanyComponent } from './pages/company/add-company/add-company.component';
import { AddCompany2Component } from './pages/company/add-company2/add-company2.component';
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
import { PackageSummaryComponent } from './pages/package/package-summary/package-summary.component';
import { OutletDashboardComponent } from './pages/outlet/outlet-dashboard/outlet-dashboard.component';
import { AddOutletComponent } from './pages/outlet/add-outlet/add-outlet.component';
import { OutletSummaryComponent } from './pages/outlet/outlet-summary/outlet-summary.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { AddEmployeeComponent } from './pages/employee/add-employee/add-employee.component';
import { ServiceRequestListComponent } from './pages/service-request/service-request-list/service-request-list.component';
import { ServiceRequestSummaryComponent } from './pages/service-request/service-request-summary/service-request-summary.component';
import { OrderListComponent } from './pages/order/order-list/order-list.component';
import { AddOrderComponent } from './pages/order/add-order/add-order.component';
import { LoginComponent } from './pages/login-details/login/login.component';
import { SignupComponent } from './pages/login-details/signup/signup.component';
import { VerifyAccountComponent } from './pages/login-details/verify-account/verify-account.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { ServicePricingDetailsComponent } from './pages/service/service-pricing-details/service-pricing-details.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ShopAssignedEmployeeListComponent } from './pages/employee/shop-assigned-employee-list/shop-assigned-employee-list.component';

const routes: Routes = [
  { path: '', 
    component: BodyComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'company', component: CompanyDashboardComponent, canActivate: [AuthGuard] },
      { path: 'company/add2', component: AddCompanyComponent, canActivate: [AuthGuard] },
      { path: 'company/add', component: AddCompany2Component, canActivate: [AuthGuard] },
      { path: 'product', component: ProductListComponent, canActivate: [AuthGuard] },
      { path: 'product/add', component: AddProductComponent, canActivate: [AuthGuard] },
      { path: 'product/details', component: ProductDetailsComponent, canActivate: [AuthGuard] },
      { path: 'product/price', component: EditProductPricingDetailsComponent, canActivate: [AuthGuard] },
      { path: 'service', component: ServiceListComponent, canActivate: [AuthGuard] },
      { path: 'service/add', component: AddServiceComponent, canActivate: [AuthGuard] },
      { path: 'service/discountDetails', component: ServiceDiscountDetailsComponent, canActivate: [AuthGuard] },
      { path: 'service/summary', component: ServiceSummaryComponent, canActivate: [AuthGuard] },
      { path: 'service/price', component: ServicePricingDetailsComponent, canActivate: [AuthGuard] },
      { path: 'package', component: PackageListComponent, canActivate: [AuthGuard] },
      { path: 'package/add', component: AddPackageComponent, canActivate: [AuthGuard] },
      { path: 'package/summary', component: PackageSummaryComponent, canActivate: [AuthGuard] },
      { path: 'outlet', component: OutletDashboardComponent, canActivate: [AuthGuard] },
      { path: 'outlet/add', component: AddOutletComponent, canActivate: [AuthGuard] },
      { path: 'outlet/summary', component: OutletSummaryComponent, canActivate: [AuthGuard] },
      { path: 'outlet/employee', component: ShopAssignedEmployeeListComponent, canActivate: [AuthGuard] },
      { path: 'employee', component: EmployeeListComponent, canActivate: [AuthGuard] },
      { path: 'employee/add', component: AddEmployeeComponent, canActivate: [AuthGuard] },
      { path: 'serviceRequest', component: ServiceRequestListComponent, canActivate: [AuthGuard] },
      { path: 'serviceRequest/summary', component: ServiceRequestSummaryComponent, canActivate: [AuthGuard] },
      { path: 'order', component: OrderListComponent, canActivate: [AuthGuard] },
      { path: 'order/add', component: AddOrderComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verifyAccount', component: VerifyAccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
