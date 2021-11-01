import { Component, OnInit } from '@angular/core';
// FIREBASE
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  public id;
  public chatListNonRead: any = []
  public chatListReaded: any = []
  // public showContent = false;
  public showChatList = true;
  public chatSearchNonRead:any = [];
  public chatSearchReaded:any = [];
  public showNoChatList = false;
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if (this.id) {
      // console.log(this.id)
      // // GET CHAT NON READ
      this.firestore.collection('chat', ref => ref   
      .where(`members.${this.id}.type`, '==', 'buyer')   
      .where(`readed.${this.id}`, '==', false)
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(chat => {
          // console.log('CHAT NON READ -> ', chat)
          this.chatListNonRead = chat;
          // SET STATUS
          for (var i = 0; i < this.chatListNonRead.length; i++) {
            var _members:any = Object.keys(this.chatListNonRead[i].value.members);
            if (_members[0] != this.id) {
              if (this.chatListNonRead[i].value.members[_members[0]].displayName == null) {
                this.chatListNonRead[i].value.members[_members[0]].displayName = 'ห้องสนทนา'
              }
              if (this.chatListNonRead[i].value.members[_members[0]].profileImg.imgUrl == null) {
                this.chatListNonRead[i].value.members[_members[0]].profileImg.imgUrl = './assets/img/seller-profile/store-icon.png'
              }
              this.chatListNonRead[i].value.chatTo = {
                displayName: this.chatListNonRead[i].value.members[_members[0]].displayName,
                imgUrl: this.chatListNonRead[i].value.members[_members[0]].profileImg.imgUrl
              }
              this.chatListNonRead[i].uid = this.chatListNonRead[i].value.members[_members[0]].uid,
              this.chatListNonRead[i].displayName = this.chatListNonRead[i].value.members[_members[0]].displayName;
            }
            else {
              if (this.chatListNonRead[i].value.members[_members[1]].displayName == null) {
                this.chatListNonRead[i].value.members[_members[1]].displayName = 'ห้องสนทนา'
              }
              if (this.chatListNonRead[i].value.members[_members[1]].profileImg.imgUrl == null) {
                this.chatListNonRead[i].value.members[_members[1]].profileImg.imgUrl = './assets/img/seller-profile/store-icon.png'
              }
              this.chatListNonRead[i].value.chatTo = {
                displayName: this.chatListNonRead[i].value.members[_members[1]].displayName,
                imgUrl: this.chatListNonRead[i].value.members[_members[1]].profileImg.imgUrl
              }
              this.chatListNonRead[i].uid = this.chatListNonRead[i].value.members[_members[1]].uid,
              this.chatListNonRead[i].displayName = this.chatListNonRead[i].value.members[_members[1]].displayName;
            }
          }
          // console.log('CHAT NON READ -> ', this.chatListNonRead)

          // GET CHAT READDED
          this.firestore.collection('chat', ref => ref
          .where(`members.${this.id}.type`, '==', 'buyer')  
          .where(`readed.${this.id}`, '==', true)
          ).snapshotChanges()
            .map(actions => {
              return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
            }).subscribe(chat => {
              // console.log('CHAT READED -> ', chat)
              this.chatListReaded = chat;
              // SET STATUS
              for (var i = 0; i < this.chatListReaded.length; i++) {
                var _members:any = Object.keys(this.chatListReaded[i].value.members);
                if (_members[0] != this.id) {
                  if (this.chatListReaded[i].value.members[_members[0]].displayName == null) {
                    this.chatListReaded[i].value.members[_members[0]].displayName = 'ห้องสนทนา'
                  }
                  if (this.chatListReaded[i].value.members[_members[0]].profileImg.imgUrl == null) {
                    this.chatListReaded[i].value.members[_members[0]].profileImg.imgUrl = './assets/img/seller-profile/store-icon.png'
                  }
                  this.chatListReaded[i].value.chatTo = {
                    displayName: this.chatListReaded[i].value.members[_members[0]].displayName,
                    imgUrl: this.chatListReaded[i].value.members[_members[0]].profileImg.imgUrl
                  }
                  this.chatListReaded[i].uid = this.chatListReaded[i].value.members[_members[0]].uid,
                  this.chatListReaded[i].displayName = this.chatListReaded[i].value.members[_members[0]].displayName;
                }
                else {
                  if (this.chatListReaded[i].value.members[_members[1]].displayName == null) {
                    this.chatListReaded[i].value.members[_members[1]].displayName = 'ห้องสนทนา'
                  }
                  if (this.chatListReaded[i].value.members[_members[1]].profileImg.imgUrl == null) {
                    this.chatListReaded[i].value.members[_members[1]].profileImg.imgUrl = './assets/img/seller-profile/store-icon.png'
                  }
                  this.chatListReaded[i].value.chatTo = {
                    displayName: this.chatListReaded[i].value.members[_members[1]].displayName,
                    imgUrl: this.chatListReaded[i].value.members[_members[1]].profileImg.imgUrl
                  }
                  this.chatListReaded[i].uid = this.chatListReaded[i].value.members[_members[1]].uid,
                  this.chatListReaded[i].displayName = this.chatListReaded[i].value.members[_members[1]].displayName;
                }
              }
            })
        })
    }
    else {
      this.router.navigate(['/'])
    }
  }

  sortFunc (a, b) {
    return b.value.updateAt.seconds - a.value.updateAt.seconds
  }

  searchChat($event){
    var shopNameInput = $event.target.value
    // console.log('shopNameInput -> ', shopNameInput)
    // INPUT SEARCH SHOP NAME
    if(shopNameInput != ''){
      // FILTER SHOP NAME IN NON READ LIST
      var nonRead = this.filterNonRead(shopNameInput);
      if(nonRead.length != 0){
        this.chatSearchNonRead = nonRead;
        this.showChatList = false;
        this.showNoChatList = false;
      }
      else{
        this.chatSearchNonRead = [];
      }
      // FILTER SHOP NAME IN READES LIST
      var readed = this.filterReaded(shopNameInput);
      if(readed.length != 0){
        this.chatSearchReaded = readed;
        this.showChatList = false;
        this.showNoChatList = false;
      }
      else{
        this.chatSearchReaded = [];
      }
      // CHAT SEARCH LIST == NULL (2 TYPE)
      if(this.chatSearchNonRead.length == 0 && this.chatSearchReaded.length == 0){
        this.showChatList = false;
        this.showNoChatList = true;
      }
    }
    else{
      // SHOW CHAT LIST
      this.showChatList = true;
      this.showNoChatList = false;
      this.chatSearchNonRead = [];
      this.chatSearchReaded = [];
    }
  }

  filterNonRead(shopNameInput) {
    // console.log(shopNameInput)
    // console.log(this.chatListNonRead)
    return this.chatListNonRead.filter(object => {
      return object['displayName'].includes(shopNameInput)
    });
  }

  filterReaded(shopNameInput) {
    // console.log(shopNameInput)
    // console.log(this.chatListNonRead)
    return this.chatListReaded.filter(object => {
      return object['displayName'].includes(shopNameInput)
    });
  }

  gotoChatRoom(chatKey, chatToUID, displayName){
    this.router.navigate([`/chat-message/${chatKey}&${chatToUID}&${displayName}`]);
  }

}
