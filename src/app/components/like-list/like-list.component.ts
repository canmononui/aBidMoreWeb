import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-like-list',
  templateUrl: './like-list.component.html',
  styleUrls: ['./like-list.component.css']
})
export class LikeListComponent implements OnInit {
  public id;
  public showNoLikeText = false;
  public showContent = false;
  public productLikeList:any = [];

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
      this.getLike();
    }
    else{
      this.productLikeList = [];
      this.showNoLikeText = true;
      this.showContent = true;
    }
  }

  getLike(){
    this.firestore.collection('user-buyer').doc(this.id)
    .collection('like', ref => ref
    .orderBy('createAt', 'desc'))
    // .get().toPromise()
    // .then((productLike) => {
    .valueChanges()
    .subscribe((productLike) => {
      // this.productLikeList = [];
      if(productLike.length != 0){
        // HAVE PRODUCT LIKE
        // CLEAR PRODUCT LIST
        this.productLikeList = [];
        // LOOP GET PRODUCT DES
        productLike.forEach((doc) => {
          // console.log(doc.productKey)
          var productKey:any = doc.productKey;
          // GET PRODUCT DES
          this.firestore.collection('product').doc(productKey).get().toPromise()
          .then((productDes) => {
            if(productDes.data() != undefined){
              var product:any = productDes.data()
              // product.likeStatus = true;
              this.productLikeList.push({
                key: productKey,
                value: product
              })
            }
          })   
        })
        // HIDE TEXT NO LIKE
        this.showNoLikeText = false;
        // SHOW CONTENT
        this.showContent = true;
      }
      else {
        // CLEAR PRODUCT LIST
        this.productLikeList = [];
        // SHOW TEXT NO LIKE
        this.showNoLikeText = true; 
        // SHOW CONTENT
        this.showContent = true;
      }
    })
  }

  gotoProductDes(productKey){
    // this.router.navigate([`/product-description/${productKey}`]);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${productKey}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

  likeThisProduct(productKey, productDes){
    // console.log(this.id)
    // console.log(productKey, productDes)
    // console.log(this.auth.authState)
    if(this.auth.authState.isAnonymous){
      this.router.navigate(['/signin'])
    }
    else{
      this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like').doc(productKey).delete();
    }
  }

}
