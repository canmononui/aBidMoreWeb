import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-popup-instruction',
  templateUrl: './modal-popup-instruction.component.html',
  styleUrls: ['./modal-popup-instruction.component.css']
})
export class ModalPopupInstructionComponent implements OnInit {

  public imgSrc = '../assets/img/instruction/instruction-auction.png'
  public textDesAuction_1 = true 
  public textDesAutoWin_2 = false 
  public textDesAutoBid_3 = false 
  public textDesSeller_4 = false 
  // MODAL POPUP INSTRUCTION
  public showPopupInstruction = false;

  constructor() { }

  ngOnInit(): void {
    // GET STATE SHOW POPUP INSTRUCTION
    var localIns = localStorage.getItem('showPopupInstruction');
    // console.log(localIns)
    if(localIns == 'true' || localIns == null){
      this.showPopupInstruction = true;
    }
    else{
      this.showPopupInstruction = false;
    }
  }

  modalPrevious(){
    if(this.textDesSeller_4){
      this.imgSrc = '../assets/img/instruction/instruction-auto-bid.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = true 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoBid_3){
      this.imgSrc = '../assets/img/instruction/instruction-auto-win.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = true
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoWin_2){
      this.imgSrc = '../assets/img/instruction/instruction-auction.png'
      this.textDesAuction_1 = true 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = false
    }
  }

  modalNext(){
    if(this.textDesAuction_1){
      this.imgSrc = '../assets/img/instruction/instruction-auto-win.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = true
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoWin_2){
      this.imgSrc = '../assets/img/instruction/instruction-auto-bid.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = true 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoBid_3){
      this.imgSrc = '../assets/img/instruction/instruction-seller.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = true
    }
  }

  closeModalInstruction(){
    this.showPopupInstruction = false
    // SAVE LOCAL
    localStorage.setItem('showPopupInstruction', 'false');
  }

}
