import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-following-list',
  templateUrl: './following-list.component.html',
  styleUrls: ['./following-list.component.css']
})
export class FollowingListComponent implements OnInit {
  public id;
  public followingList:any = [];
  public showNoFollowingText = false;
  public showContent = false;
  public followingListForSearch:any = [];
  
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if(this.id){
      this.getShop();
    }
    else{
      this.showNoFollowingText = true;
      this.followingList = [];
      this.followingListForSearch = [];
      this.showContent = true;
    }
  }

  getShop(){
    this.firestore.collection('user-buyer').doc(this.id)
    .collection('following-seller', ref => ref
    .orderBy('createAt', 'desc'))
    .get().toPromise()
    .then((shopLike) => {
      if(shopLike.empty){
        this.showNoFollowingText = true;
        this.followingList = [];
        this.followingListForSearch = [];
        this.showContent = true;
      }
      else{
        shopLike.forEach((doc) => {
          var _docId:any = doc.id;
          // console.log(_docId)
            this.firestore.collection('shop').doc(_docId).get().toPromise()
            .then((shopDes) => {
              var product:any = shopDes.data()
              if(product.profileImg.imgUrl == null){  
                product.profileImg.imgUrl = './assets/img/seller-profile/store-icon.png'
              }
              this.followingList.push(product)
              this.followingListForSearch.push(product)
            })
        });
        this.showNoFollowingText = false;
        this.showContent = true;
      }
    })
  }

  searchShopName($event): void {
    var shopNameInput = $event.target.value
    if(shopNameInput != ''){
      var add = this.filterDataShop(shopNameInput);
      if(add.length != 0){
        this.followingList = add;
        this.showNoFollowingText = false;
      }
      else{
        this.followingList = []
        this.showNoFollowingText = true;
      }
    }
    else{
      this.showNoFollowingText = false;
      this.followingList = this.followingListForSearch;
    }
  }

  filterDataShop(shopNameInput) {
    return this.followingListForSearch.filter(object => {
      return object['shopName'].includes(shopNameInput)
    });
  }

  gotoShopDes(uid){
    this.router.navigate([`/shop-description/${uid}`]);
  }

}
