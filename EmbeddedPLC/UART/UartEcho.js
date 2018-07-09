//Used ROM: 69 bytes, RAM 8 bytes

var init = true, cnt;
if(init){
  UartInit(0, 2);
  init = false;
}

cnt = UartBytesToRead(0);
while(cnt>0){
  UartPutByte(0, UartGetByte(0));
  cnt--;
}
