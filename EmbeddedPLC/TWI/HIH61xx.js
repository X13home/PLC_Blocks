class HIH61xx{
  constructor(){
    this.st=new UInt8(0);
    this.tCnt=new UInt8(0);
    this.T=new Int16();	  // temperature in °C - return Math.round(value*16500/16382)/100-40;
    this.H=new UInt16();  // humidity in %RH - return Math.round(value/1.6382)/100;
    this.present=false;
  
    this.to=0;
  }
  Read(){
    let st=this.st, ms=getMilliseconds(), ts;
    if(this.to<ms){
      ts=TwiStatus();
      if(ts==0){
        if(st==0){
           TwiControl(0x00000127);
           this.to = ms+50;
           this.st = 1;
        } else if(st==1){
           TwiControl(0x04000227);
           this.to = ms+500;
           this.st = 2;
        } else {
          this.to=ms+60000;
          this.st=0;
        }
      } else if((ts & 0xE000) != 0){
        this.to=ms+60000;
        this.st=0;
        if((ts & 0xFF)==0x27){
          this.present=false;
        }
      }
    }else if(st==2){
      ts=TwiStatus();
      if(ts==0x04001027){
        let v1=((TwiGetByte()<<8) | TwiGetByte());
        let v2=((TwiGetByte()<<6) | (TwiGetByte()>>2));
        if((v1 & 0xC000)==0){
          this.H=v1 & 0x3FFF;
          this.T=v2;
          this.to=ms+60000;
          this.st=0;
          this.present=true;
        } else{ 
          this.tCnt++;
          if(this.tCnt<5) {
            this.to=ms+15;
            this.st=1;
          } else {
            this.to=ms+15000;
            this.st=0;
            this.tCnt=0;
          }
        }      
      } else if((ts & 0xE000) != 0){
        this.to=ms+60000;
        this.st=0;
        if((ts & 0xFF)==0x28){
          this.present=false;
        }
      }  		
    }
  }
}

var hih=new HIH61xx();
hih.Read();
