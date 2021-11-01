import { Component, OnInit } from '@angular/core';
// FIREBASE
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import addressTHJSON from '../../services/data/addressTH.json';

@Component({
  selector: 'app-address-settings-list',
  templateUrl: './address-settings-list.component.html',
  styleUrls: ['./address-settings-list.component.css']
})
export class AddressSettingsListComponent implements OnInit {

  public id;
  public userBuyer:any;
  public addressDataList:any = [];
  public showContent = false;
  public showContentM = false;
  public showContentO = false;
  public showNoAddressText = false;
  public dataAddressEditType = false;
  public dataAddressAddType = true;
  public textErrorAdd = ''
  // public statusAdd = false
  public textErrorEdit = ''
  // public statusEdit = false
  public mainAddress:any;
  public otherAddress:any = [];
  public docIDAddressEdit:any;
  public dataAddressEdit!: {
    country: 'TH',
    name: any, 
    lastName: any, 
    number: any, 
    moo: any,
    village: any, 
    lane: any, 
    road: any, 
    subDistrict: any, 
    district: any, 
    province: any, 
    postalCode: any,
    phone: any, 
    note: any,
    namePlace: any
  }

  // ADDRESS
  public addressTH = addressTHJSON;
  public addDisJSON:any = [];
  public addAmphoeJSON:any = [];
  public addProvinceJSON:any = [];
  public addZipcodeJSON:any = [];
  public dataAddress!: {
    country: 'TH',
    name: any, 
    lastName: any, 
    number: any, 
    moo: any,
    village: any, 
    lane: any, 
    road: any, 
    subDistrict: any, 
    district: any, 
    province: any, 
    postalCode: any,
    phone: any, 
    note: any,
    namePlace: any
  }

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // SET DATA 
    this.dataAddress = {
      country: 'TH',
      name: null,
      lastName: null,
      number: null,
      moo: null,
      village: null,
      lane: null,
      road: null,
      subDistrict: null,
      district: null,
      province: null,
      postalCode: null,
      phone: null,
      note: null,
      namePlace: null
    }

    this.dataAddressEdit = {
      country: 'TH',
      name: null,
      lastName: null,
      number: null,
      moo: null,
      village: null,
      lane: null,
      road: null,
      subDistrict: null,
      district: null,
      province: null,
      postalCode: null,
      phone: null,
      note: null,
      namePlace: null
    }
    
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if(this.id){
      this.getMainAddress();
      this.getOtherAddress();
    }
    else{
      this.router.navigate(['/'])
    }
  }

  getMainAddress(){
    this.firestore.collection('user-buyer').doc(this.id).get().toPromise()
    .then((userBuyer) => {
      // this.addressDataList = [];
      this.userBuyer = userBuyer.data();
      // SET DATA 
      this.dataAddress.name = this.userBuyer.name;
      this.dataAddress.lastName = this.userBuyer.lastName;
      this.dataAddress.phone = this.userBuyer.phoneNumber;

      // console.log(userData)
      if(this.userBuyer.mainAddress != undefined){
        this.mainAddress = this.userBuyer.mainAddress;
        this.showNoAddressText = false;
        this.showContentM = true;
      }
      else{
        this.showNoAddressText = true;
        this.showContentM = false;
      }
    })
  }

  getOtherAddress(){
    this.otherAddress = []
    this.firestore.collection('user-buyer').doc(this.id).collection('address').get().toPromise()
    .then((addressOther) => {
      addressOther.forEach((doc) => {
        if(this.mainAddress.docID != doc.id){
          this.otherAddress.push({
            dataAddress: doc.data(),
            docID: doc.id
          })
        }
      });
    })
    // console.log(this.otherAddress)
    this.showNoAddressText = false;
    this.showContentO = true;
  }

  districtInput(districtInput) {
    districtInput = districtInput.target.value;
    // console.log(districtInput)
    // this.addDisJSON = [];
    this.addAmphoeJSON = [];
    this.addProvinceJSON = [];
    this.addZipcodeJSON = [];

    if(districtInput.length != ''){
      var add = this.filterDataDistrict(districtInput);
      // console.log(add)
      this.addDisJSON = add;
    }
    else {
      this.addDisJSON = []
    }
  }

  filterDataDistrict(districtName) {
    return this.addressTH.filter(object => {
      // return object['district'] == districtName;
      return object['district'].includes(districtName)
    });
  }

  amphoeInput(amphoeInput) {
    amphoeInput = amphoeInput.target.value;
    // console.log(amphoeInput)
    this.addDisJSON = [];
    // this.addAmphoeJSON = [];
    this.addProvinceJSON = [];
    this.addZipcodeJSON = [];

    if(amphoeInput.length != ''){
      var add = this.filterDataAmphoe(amphoeInput);
      // console.log(add)
      this.addAmphoeJSON = add;
    }
    else {
      this.addAmphoeJSON = []
    }
  }

  filterDataAmphoe(amphoeName) {
    return this.addressTH.filter(object => {
      return object['amphoe'].includes(amphoeName)
    });
  }

  provinceInput(provinceInput) {
    provinceInput = provinceInput.target.value;
    // console.log(provinceInput)
    this.addDisJSON = [];
    this.addAmphoeJSON = [];
    // this.addProvinceJSON = [];
    this.addZipcodeJSON = [];

    if(provinceInput.length != ''){
      var add = this.filterDataProvince(provinceInput);
      // console.log(add)
      this.addProvinceJSON = add;
    }
    else {
      this.addProvinceJSON = []
    }
  }

  filterDataProvince(provinceName) {
    return this.addressTH.filter(object => {
      return object['province'].includes(provinceName)
    });
  }

  zipcodeInput(zipcodeInput) {
    zipcodeInput = zipcodeInput.target.value;
    // console.log(zipcodeInput)
    this.addDisJSON = [];
    this.addAmphoeJSON = [];
    this.addProvinceJSON = [];
    // this.addZipcodeJSON = [];

    if(zipcodeInput.length != ''){
      var add = this.filterDataZipcode(zipcodeInput);
      // console.log(add)
      this.addZipcodeJSON = add;
    }
    else {
      this.addZipcodeJSON = []
    }
  }

  filterDataZipcode(zipcodeName) {
    return this.addressTH.filter(object => {
      return object['zipcode'] == Number(zipcodeName);
    });
  } 

  selectAddress(addressDataSelect){
    this.addDisJSON = [];
    this.addAmphoeJSON = [];
    this.addProvinceJSON = [];
    this.addZipcodeJSON = [];
    this.dataAddress.subDistrict = addressDataSelect.district;
    this.dataAddress.district = addressDataSelect.amphoe;
    this.dataAddress.province = addressDataSelect.province;
    this.dataAddress.postalCode = addressDataSelect.zipcode;
  }

  selectAddressEdit(addressDataSelect){
    this.addDisJSON = [];
    this.addAmphoeJSON = [];
    this.addProvinceJSON = [];
    this.addZipcodeJSON = [];
    this.dataAddressEdit.subDistrict = addressDataSelect.district;
    this.dataAddressEdit.district = addressDataSelect.amphoe;
    this.dataAddressEdit.province = addressDataSelect.province;
    this.dataAddressEdit.postalCode = addressDataSelect.zipcode;
  }

  selectEditAddress(docID, dataAddress){
    // console.log(i)
    // console.log(docID)
    // console.log(dataAddress)
    // console.log(this.mainAddress.docID)
    this.docIDAddressEdit = docID
    // CHECK EDIT MAIN ADDRESS ?
    if(this.docIDAddressEdit == this.mainAddress.docID){
      this.dataAddressEditType = true;
    }
    else{
      this.dataAddressEditType = false;
    }
    // SET DATA FOR SHOW
    this.dataAddressEdit = {
      country: 'TH',
      name: dataAddress.name,
      lastName: dataAddress.lastName,
      number: dataAddress.number,
      moo: dataAddress.moo,
      village: dataAddress.village,
      lane: dataAddress.lane,
      road: dataAddress.road,
      subDistrict: dataAddress.subDistrict,
      district: dataAddress.district,
      province: dataAddress.province,
      postalCode: dataAddress.postalCode,
      phone: dataAddress.phone,
      note: dataAddress.note,
      namePlace: dataAddress.namePlace
    }
  }

  checkMainEdit(){
    // MAIN
    if(this.dataAddressEditType){
      this.dataAddressEditType = false;
    }
    // NOT MAIN
    else{
      this.dataAddressEditType = true;
    }
  }

  deleteAddress(){
    if(this.docIDAddressEdit == this.mainAddress.docID){
      // DELETE MAIN ADDRESS
      this.firestore.collection('user-buyer').doc(this.id).update({
        mainAddress: firebase.firestore.FieldValue.delete()
      })
      .then(() => {
        // DELETE DOC IN SUBCOLLECTION
        this.firestore.collection('user-buyer').doc(this.id).collection('address').doc(this.docIDAddressEdit).delete()
        .then(() => {
          this.textErrorEdit = 'ลบชื่อที่อยู่เรียบร้อย'
          // SET NEW MAIN ADDRESS
          if(this.otherAddress.length != 0){
            this.firestore.collection('user-buyer').doc(this.id).update({
              mainAddress: {
                dataAddress: this.otherAddress[0].dataAddress,
                docID: this.otherAddress[0].docID
              }
            })
            .then((docID) => {
              this.getMainAddress();
              this.getOtherAddress();
            })
          }
          else{
            this.getMainAddress();
            this.getOtherAddress();
          }
        })
      })
    }
    else{
      // DELETE DOC IN SUBCOLLECTION
      this.firestore.collection('user-buyer').doc(this.id).collection('address').doc(this.docIDAddressEdit).delete()
      .then(() => {
        this.textErrorEdit = 'ลบชื่อที่อยู่เรียบร้อย'
        this.getMainAddress();
        this.getOtherAddress();
      })
    }
  }

  updateEditAddress(editName, editLastName, editPhone, editNumber, editMoo, editVillage, editLane, editRoad, editSubDistrict, editDistrict, editProvince, editPostalCode, editNamePlace, editNote){
    // SET DATA
    this.dataAddressEdit = {
      country: 'TH',
      name: editName,
      lastName: editLastName,
      number: editNumber,
      moo: editMoo,
      village: editVillage,
      lane: editLane,
      road: editRoad,
      subDistrict: editSubDistrict,
      district: editDistrict,
      province: editProvince,
      postalCode: editPostalCode,
      phone: editPhone,
      note: editNote,
      namePlace: editNamePlace
    }
    if(editName == ''){
      this.textErrorEdit = 'กรุณาเพิ่มชื่อ';
    }
    else if(editLastName == ''){
      this.textErrorEdit = 'กรุณาเพิ่มนามสกุล';
    }
    else if(editPhone.length < 10 || editPhone.split(" ").length > 1){
      this.textErrorEdit = 'หมายเลขโทรศัพท์ไม่ถูกต้อง (กรอกข้อมูลโดยไม่เว้นวรรค)';
    }
    else if(editNamePlace == ''){
      this.textErrorEdit = 'กรุณาเพิ่มชื่อสถานที่';
    }
    else if(editNumber == ''){
      this.textErrorEdit = 'กรุณาเพิ่มบ้านเลขที่';
    }
    else if(editSubDistrict == ''){
      this.textErrorEdit = 'กรุณาเพิ่มตำบล/แขวง';
    }
    else if(editDistrict == ''){
      this.textErrorEdit = 'กรุณาเพิ่มอำเภอ/เขต';
    }
    else if(editProvince == ''){
      this.textErrorEdit = 'กรุณาเพิ่มจังหวัด';
    }
    else if(editPostalCode == ''){
      this.textErrorEdit = 'กรุณาเพิ่มรหัสไปรษณีย์';
    }
    else {
      this.textErrorEdit = 'แก้ไขชื่อที่อยู่เรียบร้อย';
      // MAIN ADDRESS
      if(this.dataAddressEditType){
        // ADD ADDRESS SUBCOLLECTION
        this.firestore.collection('user-buyer').doc(this.id).collection('address').doc(this.docIDAddressEdit).update(
          this.dataAddressEdit
        )
        .then((docID) => {
          this.firestore.collection('user-buyer').doc(this.id).update({
            mainAddress: {
              dataAddress: this.dataAddressEdit,
              docID: this.docIDAddressEdit
            }
          })
          .then((docID) => {
            this.getMainAddress();
            this.getOtherAddress();
          })
        })
      }
      // NOT MAIN ADDRESS
      else{
          // ADD ADDRESS SUBCOLLECTION
          this.firestore.collection('user-buyer').doc(this.id).collection('address').doc(this.docIDAddressEdit).update(
            this.dataAddressEdit
          )
          .then((docID) => {
            this.getMainAddress();
            this.getOtherAddress();
          })
      } 
    }
  }

  addAddress(addName, addLastName, addPhone, addNumber, addMoo, addVillage, addLane, addRoad, addSubDistrict, addDistrict, addProvince, addPostalCode, addNamePlace, addNote){
    // SET DATA
    this.dataAddress = {
      country: 'TH',
      name: addName,
      lastName: addLastName,
      number: addNumber,
      moo: addMoo,
      village: addVillage,
      lane: addLane,
      road: addRoad,
      subDistrict: addSubDistrict,
      district: addDistrict,
      province: addProvince,
      postalCode: addPostalCode,
      phone: addPhone,
      note: addNote,
      namePlace: addNamePlace
    }
    if(addName == ''){
      this.textErrorAdd = 'กรุณาเพิ่มชื่อ';
    }
    else if(addLastName == ''){
      this.textErrorAdd = 'กรุณาเพิ่มนามสกุล';
    }
    else if(addPhone.length < 10 || addPhone.split(" ").length > 1){
      this.textErrorAdd = 'หมายเลขโทรศัพท์ไม่ถูกต้อง (กรอกข้อมูลโดยไม่เว้นวรรค)';
    }
    else if(addNamePlace == ''){
      this.textErrorAdd = 'กรุณาเพิ่มชื่อสถานที่';
    }
    else if(addNumber == ''){
      this.textErrorAdd = 'กรุณาเพิ่มบ้านเลขที่';
    }
    else if(addSubDistrict == ''){
      this.textErrorAdd = 'กรุณาเพิ่มตำบล/แขวง';
    }
    else if(addDistrict == ''){
      this.textErrorAdd = 'กรุณาเพิ่มอำเภอ/เขต';
    }
    else if(addProvince == ''){
      this.textErrorAdd = 'กรุณาเพิ่มจังหวัด';
    }
    else if(addPostalCode == ''){
      this.textErrorAdd = 'กรุณาเพิ่มรหัสไปรษณีย์';
    }
    else {
      this.textErrorAdd = 'เพิ่มชื่อที่อยู่ใหม่เรียบร้อย'
      // ADD ADDRESS SUBCOLLECTION
      this.firestore.collection('user-buyer').doc(this.id).collection('address').add(
        this.dataAddress
      )
      .then((docID) => {
        // ADD ADDRESS COLLECTION
        if(this.dataAddressAddType){
          this.firestore.collection('user-buyer').doc(this.id).update({
            mainAddress: {
              dataAddress: this.dataAddress,
              docID: docID.id
            }
          })
          .then((doc) => {
            // CALL FUNC
            this.getMainAddress();
            this.getOtherAddress();
            this.dataAddressAddType = false;
            this.dataAddress = {
              country: 'TH',
              name: null,
              lastName: null,
              number: null,
              moo: null,
              village: null,
              lane: null,
              road: null,
              subDistrict: null,
              district: null,
              province: null,
              postalCode: null,
              phone: null,
              note: null,
              namePlace: null
            }
          })
        }
        else{
          this.getOtherAddress();
          this.dataAddressAddType = false;
          this.dataAddress = {
            country: 'TH',
            name: null,
            lastName: null,
            number: null,
            moo: null,
            village: null,
            lane: null,
            road: null,
            subDistrict: null,
            district: null,
            province: null,
            postalCode: null,
            phone: null,
            note: null,
            namePlace: null
          }
        }
      })
    }
  }

  checkMainAdd(){
    if(this.dataAddressAddType){
      this.dataAddressAddType = false;
    }
    else{
      this.dataAddressAddType = true;
    }
  }

}
