import autobind from "autobind-decorator"; 
import _ from "lodash"; 
import { GameItem, GameItemStatus } from "../models/GameItem";

// Khởi tạo GameController và gọi phương thức initGame() để khởi tạo trò chơi với dữ liệu ban đầu.
export class GameController{  
    private items:GameItem[] = [];
    constructor(items:GameItem[], public element:HTMLElement) { 
        this.initGame(items); // Hàm tạo khởi tạo trò chơi với các mục được cung cấp bằng cách gọi phương thức initGame.
    }



// thêm item vào mảng
    initGame(initData:GameItem[]):void { //gấp đôi số lượng phần tử trong initdata và đẩy vào this.item 
        for (const item of initData){   
            this.items.push(item);      
            this.items.push(new GameItem(item.id, item.divId, item.image)); // thêm 10 item vào mảng
        }
        // tự động gán div Id bằng cách là thêm tiền tố D trước giá trị của id
            let id:number=1; 
            this.items.forEach(it =>{
                it.status = GameItemStatus.Close;
                it.divId = 'd' + id;
                id++;
            });
    }


    // luôn đảm bảo là phần game sẽ được xáo trộn khi chơi và các thành phần của game luôn ở trạng thái close
    reinitGame():void{  // khởi tạo lại trò chơi khi người dùng nhấn vào nút reset game.
        this.items.forEach(item=>{
            item.imageElement = null; 
            item.status = GameItemStatus.Close;
            item.isMatched=false; 
        });
        this.shuffle(); 
    }
    
    isWinGame():boolean{ // kiểm tra người dùng thắng game hay chưa
        return this.items.filter(item=> 
                item.status===GameItemStatus.Open).length === this.items.length; 
    }



    // Phương thức renderHTML được sử dụng để tạo và hiển thị các phần tử HTML của mỗi GameItem lên trên giao diện người dùng
    renderHTML(rootElement:HTMLElement, item:GameItem){ 
                // <div class="col-2 gameItem m-2 p1 text-center">
                //     <img src="" alt="" class="img-fluid">
                // </div>
               
        const divItem: HTMLDivElement = document.createElement('div'); 
        divItem.className = 'col-2 gameItem m-2 p1 text-center';
        divItem.id = item.divId; 
        divItem.addEventListener('click',this.processGameItemClicked); 

        // kiểm tra đường dẫn src được truyền vào
        const imgItem: HTMLImageElement = document.createElement('img');
        imgItem.src = `images/${item.image}`; 
        imgItem.className = 'img-fluid invisible'; 

        item.imageElement = imgItem; 
        divItem.appendChild(imgItem); 
        rootElement.appendChild(divItem);
        
    }



    // hiển thị nút reset trên giao diện người dùng và thiết lập sự kiện click cho nút đó
    renderResetButton(rootElement: HTMLElement):void{ 
        let button:HTMLButtonElement =  
            rootElement.querySelector('button#reset') as HTMLButtonElement; 
        
        if(button){
            button.addEventListener('click',this.processResetButtonClicked); 
        }
    }

    renderGameBoard():void{ // hiển thị toàn bộ thông tin ở trong game
        this.shuffle();

        let boardDiv : HTMLElement = this.element.querySelector('#board') as HTMLElement; // gọi tới phương thức id board truyền kiểu htmlelement

        if(boardDiv){ 
            this.items.forEach(it =>{
                this.renderHTML(boardDiv,it);
            });
        }
        this.renderResetButton(this.element); 
    }

 // kiểm tra có khớp ảnh vs nhau ko
    isMatched(id:number, imgElement:HTMLImageElement):boolean{ 
        let openedItems : GameItem[] = this.items.filter(item => {
            if(item.status === GameItemStatus.Open && !item.isMatched){
                return item;
            }
        });

        if(openedItems.length ==2){ 
            let checkMatchedFilter = openedItems.filter(item=>item.id == id);

            if(checkMatchedFilter.length <2  ){ 
                openedItems.forEach(item=>{
                    this.changeMatchedBackground(item.imageElement,false);
                });

                setTimeout(()=>
                openedItems.forEach(item=>{ 
                    if(item.imageElement){
                        item.imageElement.className = 'img-fluid invisible';
                        item.status=GameItemStatus.Close;
                        item.isMatched = false;

                    this.changeMatchedBackground(item.imageElement);
                    } 
                }),600);
            }else{ // xử lí khi trùng khớp -- > mở đối tượng ra
                openedItems.forEach(item=>{
                    item.isMatched =true;
                    this.changeMatchedBackground(item.imageElement);
                });
                return true;
            }
        }
        return false;
    }

    
    changeMatchedBackground(imgElement:HTMLElement | null, isMatched:boolean = true){ 
        if(imgElement?.parentElement){ 
            if(isMatched){
                imgElement.parentElement.className = 'col-2 gameItem m-1 p-1 text-center'; 
            }else{
                imgElement.parentElement.className = 'col-2 gameItem m-1 p-1 text-center unmatched';
            }
        }
    }

// sự kiện game click
    @autobind
    processGameItemClicked(event:Event):void { 
        console.log('hello');
        let element : HTMLElement | null = event.target as HTMLElement;

        if(element.tagName ==='img'){
            element = element.parentElement;
        }

        for(const item of this.items){
            if(item.divId == element?.id && !item.isMatched && item.status === GameItemStatus.Close){
                //Nếu phần tử chưa được mở và không trùng khớp, mở nó
                item.status = GameItemStatus.Open;
                let imgElement = element.querySelector('img');

                if(imgElement){
                    imgElement.className = 'img-fluid visible';
                    this.isMatched(item.id,imgElement);
                }
            }   
        }
    }

    @autobind
    processResetButtonClicked(event:Event):void{ 
        this.reinitGame(); 
        console.log("hiiii");
        const boardElement : HTMLElement = document.querySelector('#board') as HTMLElement;
        boardElement.innerHTML=''; 
        this.renderGameBoard(); 
    }

    shuffle() { 
        this.items = _.shuffle(this.items);
    }


}