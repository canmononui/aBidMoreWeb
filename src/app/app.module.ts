import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { firebaseConfig } from './../environments/firebase.config';
// FIRE BASE AUTH
import { AngularFireAuthModule } from '@angular/fire/auth';
// FIREBASE 
import { AngularFireModule } from '@angular/fire';
// FIREBASE FIRESTORE
import { AngularFirestoreModule } from '@angular/fire/firestore';
// FIREBASE STORAGE
import { AngularFireStorageModule } from '@angular/fire/storage';
// IMAGE CROPPER
import { ImageCropperModule } from 'ngx-image-cropper';
// TEXT EDITOR
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
// CLIPBOARD
import { ClipboardModule } from 'ngx-clipboard';
// SERVICE
import { AuthService } from './services/auth.service';
// CAPTCHA
import { RecaptchaModule } from 'ng-recaptcha';
// GUARD
import { AuthGuard } from './guards/auth.guard';
// CIRCLE GRAPH PROGRESS
import { NgCircleProgressModule } from 'ng-circle-progress';
// COMPONENT
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { TestComponent } from './components/test/test.component';
import { ProductDescriptionComponent } from './components/product-description/product-description.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/search/search.component';
import { AuctionListComponent } from './components/auction-list/auction-list.component';
import { LikeListComponent } from './components/like-list/like-list.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { FollowingListComponent } from './components/following-list/following-list.component';
import { ShopDescriptionComponent } from './components/shop-description/shop-description.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProfileSettingsListComponent } from './components/profile-settings-list/profile-settings-list.component';
import { SettingsNameComponent } from './components/settings-name/settings-name.component';
import { SettingsLastnameComponent } from './components/settings-lastname/settings-lastname.component';
import { SettingsUsernameComponent } from './components/settings-username/settings-username.component';
import { SettingsPhonenumberComponent } from './components/settings-phonenumber/settings-phonenumber.component';
import { SettingsEmailComponent } from './components/settings-email/settings-email.component';
import { AddressSettingsListComponent } from './components/address-settings-list/address-settings-list.component';
import { CardSettingsListComponent } from './components/card-settings-list/card-settings-list.component';
import { WalletCreditComponent } from './components/wallet-credit/wallet-credit.component';
import { BuyMenuListComponent } from './components/buy-menu-list/buy-menu-list.component';
import { PaymentItemsComponent } from './components/payment-items/payment-items.component';
import { PaymentTotalComponent } from './components/payment-total/payment-total.component';
import { PaymentConfirmListComponent } from './components/payment-confirm-list/payment-confirm-list.component';
import { PaymentConfirmDescriptionComponent } from './components/payment-confirm-description/payment-confirm-description.component';
import { TransportPrepareListComponent } from './components/transport-prepare-list/transport-prepare-list.component';
import { TransportListComponent } from './components/transport-list/transport-list.component';
import { TransportDescriptionComponent } from './components/transport-description/transport-description.component';
import { TransportSuccessListComponent } from './components/transport-success-list/transport-success-list.component';
import { TransportSuccessDescriptionComponent } from './components/transport-success-description/transport-success-description.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { OrderReturnComponent } from './components/order-return/order-return.component';
import { OrderCancelComponent } from './components/order-cancel/order-cancel.component';
import { OrderCancelDescriptionComponent } from './components/order-cancel-description/order-cancel-description.component';
import { ModalInviteFriendComponent } from './components/modal-invite-friend/modal-invite-friend.component';
import { ModalLanguageSettingsComponent } from './components/modal-language-settings/modal-language-settings.component';
import { ModalPopupAdsComponent } from './components/modal-popup-ads/modal-popup-ads.component';
import { HomeComponent } from './components/home/home.component';
import { HelpCenterListComponent } from './components/help-center-list/help-center-list.component';
import { HelpCenterDetailComponent } from './components/help-center-detail/help-center-detail.component';
import { ModalPopupInstructionComponent } from './components/modal-popup-instruction/modal-popup-instruction.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileimgSettingsComponent } from './components/profileimg-settings/profileimg-settings.component';
import { ProfileSettingsProfileimgComponent } from './components/profile-settings-profileimg/profile-settings-profileimg.component';
import { ProductReviewComponent } from './components/product-review/product-review.component';
import { CheckEmailVerifyComponent } from './components/check-email-verify/check-email-verify.component';
import { UpdateUserBuyerComponent } from './components/update-user-buyer/update-user-buyer.component';
import { MerchantComingSoonComponent } from './components/merchant-coming-soon/merchant-coming-soon.component';
import { OrderWaitingConfirmComponent } from './components/order-waiting-confirm/order-waiting-confirm.component';
import { OrderWaitingConfirmListComponent } from './components/order-waiting-confirm-list/order-waiting-confirm-list.component';
import { OrderWaitingConfirmDescriptionComponent } from './components/order-waiting-confirm-description/order-waiting-confirm-description.component';
import { SettingsRefcodeComponent } from './components/settings-refcode/settings-refcode.component';
import { ModalPrivacyPolicyComponent } from './components/modal-privacy-policy/modal-privacy-policy.component';
import { PrivacyPolicyDescriptionComponent } from './components/privacy-policy-description/privacy-policy-description.component';

// ROUTES
export const router: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'auction-list', component: AuctionListComponent, canActivate: [AuthGuard] },
  { path: 'auction-list', component: AuctionListComponent, canActivate: [AuthGuard] },
  { path: 'chat-list', component: ChatListComponent, canActivate: [AuthGuard] },
  { path: 'chat-message', component: ChatMessageComponent, canActivate: [AuthGuard] },
  { path: 'chat-message/:id', component: ChatMessageComponent, canActivate: [AuthGuard] },
  { path: 'notification-list', component: NotificationListComponent, canActivate: [AuthGuard] },
  { path: 'promotion-list', component: PromotionListComponent, canActivate: [AuthGuard] },
  { path: 'payment-items', component: PaymentItemsComponent, canActivate: [AuthGuard] },
  { path: 'payment-total', component: PaymentTotalComponent },
  { path: 'payment-confirm-list', component: PaymentConfirmListComponent },
  { path: 'payment-confirm-description/:id', component: PaymentConfirmDescriptionComponent },
  { path: 'wallet-credit', component: WalletCreditComponent },
  { path: 'buyMenu-list', component: BuyMenuListComponent },
  { path: 'following-list', component: FollowingListComponent, canActivate: [AuthGuard] },
  { path: 'like-list', component: LikeListComponent },
  { path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [AuthGuard]},
  { path: 'profile-settings-list', component: ProfileSettingsListComponent, canActivate: [AuthGuard] },
  { path: 'profile-settings-username', component: SettingsUsernameComponent, canActivate: [AuthGuard] },
  { path: 'profile-settings-name', component: SettingsNameComponent, canActivate: [AuthGuard] },
  { path: 'profile-settings-lastname', component: SettingsLastnameComponent, canActivate: [AuthGuard] },
  { path: 'profile-settings-phonenumber/:id', component: SettingsPhonenumberComponent, canActivate: [AuthGuard] },
  { path: 'profile-settings-refcode', component: SettingsRefcodeComponent, canActivate: [AuthGuard] },
  { path: 'settings-address-list', component: AddressSettingsListComponent, canActivate: [AuthGuard] },
  { path: 'settings-card-list', component: CardSettingsListComponent, canActivate: [AuthGuard] },
  { path: 'transport-prepare-list', component: TransportPrepareListComponent },
  { path: 'transport-list', component: TransportListComponent },
  { path: 'transport-description/:id', component: TransportDescriptionComponent },
  { path: 'transport-success-list', component: TransportSuccessListComponent },
  { path: 'transport-success-description/:id', component: TransportSuccessDescriptionComponent },
  { path: 'order-confirm/:id', component: OrderConfirmComponent },
  { path: 'order-return/:id', component: OrderReturnComponent },
  { path: 'order-cancel', component: OrderCancelComponent },
  { path: 'order-cancel-description/:id', component: OrderCancelDescriptionComponent },
  { path: 'shop-description/:id', component: ShopDescriptionComponent },
  { path: 'help-center-list', component: HelpCenterListComponent },
  { path: 'help-center-detail/:id', component: HelpCenterDetailComponent },
  { path: 'search/:id', component: SearchComponent },
  { path: 'product-description/:id', component: ProductDescriptionComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signin/:id', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:id', component: SignupComponent },
  { path: 'profile-settings-profileimg', component: ProfileSettingsProfileimgComponent, canActivate: [AuthGuard] },
  { path: 'product-review/:id', component: ProductReviewComponent, canActivate: [AuthGuard] },
  { path: 'check-email-verify', component: CheckEmailVerifyComponent },
  { path: 'update-user-buyer', component: UpdateUserBuyerComponent },
  { path: 'merchant-coming-soon', component: MerchantComingSoonComponent },
  { path: 'order-waiting-confirm-list', component: OrderWaitingConfirmListComponent },
  { path: 'order-waiting-confirm-description/:id', component: OrderWaitingConfirmDescriptionComponent },
  { path: 'privacy-policy-description', component: PrivacyPolicyDescriptionComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CarouselComponent,
    TestComponent,
    ProductDescriptionComponent,
    FooterComponent,
    SearchComponent,
    AuctionListComponent,
    LikeListComponent,
    ChatListComponent,
    ChatMessageComponent,
    NotificationListComponent,
    PromotionListComponent,
    FollowingListComponent,
    ShopDescriptionComponent,
    ProfileSettingsComponent,
    ProfileSettingsListComponent,
    SettingsNameComponent,
    SettingsLastnameComponent,
    SettingsUsernameComponent,
    SettingsPhonenumberComponent,
    SettingsEmailComponent,
    AddressSettingsListComponent,
    CardSettingsListComponent,
    WalletCreditComponent,
    BuyMenuListComponent,
    PaymentItemsComponent,
    PaymentTotalComponent,
    PaymentConfirmListComponent,
    PaymentConfirmDescriptionComponent,
    TransportPrepareListComponent,
    TransportListComponent,
    TransportDescriptionComponent,
    TransportSuccessListComponent,
    TransportSuccessDescriptionComponent,
    OrderConfirmComponent,
    OrderReturnComponent,
    OrderCancelComponent,
    OrderCancelDescriptionComponent,
    ModalInviteFriendComponent,
    ModalLanguageSettingsComponent,
    ModalPopupAdsComponent,
    HomeComponent,
    HelpCenterListComponent,
    HelpCenterDetailComponent,
    ModalPopupInstructionComponent,
    SigninComponent,
    SignupComponent,
    ProfileimgSettingsComponent,
    ProfileSettingsProfileimgComponent,
    ProductReviewComponent,
    CheckEmailVerifyComponent,
    UpdateUserBuyerComponent,
    MerchantComingSoonComponent,
    OrderWaitingConfirmComponent,
    OrderWaitingConfirmListComponent,
    OrderWaitingConfirmDescriptionComponent,
    SettingsRefcodeComponent,
    ModalPrivacyPolicyComponent,
    PrivacyPolicyDescriptionComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ImageCropperModule,
    RouterModule.forRoot(router),
    AppRoutingModule,
    RichTextEditorAllModule,
    ClipboardModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    RecaptchaModule,
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
